import * as solc from 'solc'
import * as fs from 'fs'
import * as path from 'path';
import * as fse from 'fs-extra';
import * as ethers from 'ethers'

interface FileTs {
  header: string[],
  import: string[],
  class: string[],
  abi: string[],
  create: string[],
  createWithManager: string[],
  get: string[],
  getWithManager: string[],
  getHash: string[],
}

const solidityPath = 'solidity/'

const findImports = (_path: string) => {
  if (_path[0] === '@') {
    return {
      contents: fs.readFileSync(path.join('node_modules', _path)).toString()
    }
  } else {
    return {
      contents: fs.readFileSync(path.join(solidityPath, _path)).toString()
    }
  }
}

const loadContract = (_path: string) => {
  if (_path[0] === '@') {
    return {
      content: fs.readFileSync(path.join('node_modules', _path)).toString()
    }
  } else {
    return {
      content: fs.readFileSync(path.join(solidityPath, _path)).toString()
    }
  }
}

const compileInput = (contractConfig: any, outputPath: string, fileTs: FileTs) => {

  if (contractConfig.outputPath) outputPath = outputPath + contractConfig.outputPath

  let output = JSON.parse(solc.compile(JSON.stringify(contractConfig.input), { import: findImports }));

  const contractHash = ethers.utils.id(JSON.stringify(contractConfig.input))

  let hasError = 0;

  if (output.errors) {
    for (var errorNb in output.errors) {

      if (output.errors[errorNb].type === 'Warning') {
        if (output.errors[errorNb].sourceLocation.file.startsWith("@ensdomains/ens-contracts/contracts")) {
          console.log("skip ens library warning")
        } else if (output.errors[errorNb].sourceLocation.file.startsWith("@ensdomains/buffer/contracts")) {
          console.log("skip ens buffer library warning")

          /*
          } else if (output.errors[errorNb].sourceLocation.file.startsWith("@chainlink/contracts/src/v0.7")) {
            console.log("skip chainlink library warning")
          } else if (output.errors[errorNb].sourceLocation.file.startsWith("@openzeppelin/contracts/token/ERC777/ERC777.sol")) {
            console.log("skip ERC777 library warning")
          */
        } else {
          console.log(output.errors[errorNb])
          hasError = 1;
        }
      } else {
        console.log(output.errors[errorNb])
        hasError = 1;
      }
    }
  }
  if (hasError) {
    console.log("copilation error")
    process.exit(1)
  }

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }

  for (var contract in output.contracts) {
    for (var contractName in output.contracts[contract]) {
      console.log("contract ", contractName, contractHash)
      let outputfile = {
        abi: output.contracts[contract][contractName].abi,
        bytecode: output.contracts[contract][contractName].evm.bytecode.object,
        linkReferences: output.contracts[contract][contractName].evm.bytecode.linkReferences,
      }
      const contractSize = ((outputfile.bytecode.length / 2) - 1);
      const contractSizeP = Math.floor(contractSize * 100 / 24576)
      console.log(contractName +
        " compiled, size : " +
        contractSize + " <= " +
        24576 +
        " / " +
        contractSizeP +
        "%")
      if (contractSize > 24576) {
        console.error("max ethereum contract size reach")
        process.exit(1)
      }
      fs.writeFileSync(outputPath + contractName + '.json', JSON.stringify(outputfile))
      fileTs.import.push(
        "import json" + contractName + " from './" + (contractConfig.outputPath || "") + contractName + '.json' + "'")

      fileTs.abi.push(
        "export const getAbi" + contractName + " = () => {\n" +
        "\treturn json" + contractName + ".abi\n" +
        "}\n")
      if (contractSize > 0) {
        if (!contractConfig.arg) {
          contractConfig.arg = []
        }
        fileTs.create.push(
          "export const createContract" + contractName + " = async (\n" +
          contractConfig.arg.map((arg: { name: string, type: string }) => {
            return "\t" + arg.name + " : " + (arg.type === "ethers.Contract" ? "{address : string}" : arg.type) + ",\n"
          }).join("") +
          "\tsigner: ethers.Signer\n" +
          ") => {\n" +
          "\tconst factory = new ethers.ContractFactory(\n" +
          "\t\tjson" + contractName + ".abi,\n" +
          "\t\tjson" + contractName + ".bytecode,\n" +
          "\t\tsigner\n" +
          "\t)\n" +
          "\tconst contract = await factory.deploy(\n" +
          contractConfig.arg.map((arg: { name: string, type: string }) => {
            return "\t\t" + arg.name + (arg.type === "ethers.Contract" ? ".address" : "") + ",\n"
          }).join("") +
          "\t)\n" +
          "\tawait contract.deployed()\n" +
          "\treturn contract\n" +
          "}\n")
        const contractArgDef = contractConfig.arg.map((arg: { name: string, type: string }) => {
          return "\t" + arg.name + " : " + (arg.type === "ethers.Contract" ? "{address : string}" : arg.type) + ",\n"
        }).join("")
        const contractArg = contractConfig.arg.map((arg: { name: string, type: string }) => {
          return "\t\t" + arg.name + (arg.type === "ethers.Contract" ? ".address" : "") + ",\n"
        }).join("")
        const contractArg2 = contractConfig.arg.map((arg: { name: string, type: string }) => {
          return "\t\t\t\t" + arg.name + (arg.type === "ethers.Contract" ? ".address" : "") + ",\n"
        }).join("")
        fileTs.createWithManager.push(
          "export const createWithManagerContract" + contractName + " = async (\n" +
          contractArgDef +
          "\ttransactionManager: TransactionManager\n" +
          ") => {\n" +
          "\tconst factory = new ethers.ContractFactory(\n" +
          "\t\tjson" + contractName + ".abi,\n" +
          "\t\tjson" + contractName + ".bytecode,\n" +
          "\t)\n" +
          "\tconst utx = factory.getDeployTransaction(\n" +
          contractArg +
          "\t)\n" +
          "\treturn new Contract" + contractName + "(\n" +
          "\t\tawait transactionManager.sendContractTx(\n" +
          "\t\t\tutx,\n" +
          "\t\t\tgetContract" + contractName + ",\n" +
          "\t\t\t 'Create contract " + contractName + "',\n" +
          "\t\t\t\"" + contractName + "\",\n" +
          "\t\t\t[\n" +
          contractArg2 +
          "\t\t\t],\n" +
          "\t\t),\n" +
          "\t\ttransactionManager,\n" +
          "\t)\n" +
          "}\n"
        )
        fileTs.class.push(
          "export class Contract" + contractName + " extends ContractGeneric {\n" +
          "\treadonly [key: string]: ContractFunction | any\n" +
          "\tconstructor(contract: ethers.Contract, transactionManager: TransactionManager) {\n" +
          "\t\tsuper(contract, transactionManager)\n" +
          "\t\tinitContract(this, json" + contractName + ".abi)\n" +
          "\t}\n" +
          "}\n"
        )
      }
      fileTs.get.push(
        "export const getContract" + contractName + " = (\n" +
        "\tcontractAddress: string,\n" +
        "\tsigner: ethers.Signer,\n" +
        ") => {\n" +
        "\treturn new ethers.Contract(\n" +
        "\t\tcontractAddress,\n" +
        "\t\tjson" + contractName + ".abi,\n" +
        "\t\tsigner,\n" +
        "\t)\n" +
        "}\n")
      fileTs.getWithManager.push(
        "export const getWithManagerContract" + contractName + " = (\n" +
        "\tcontractAddress: string,\n" +
        "\ttransactionManager: TransactionManager\n" +
        ") => {\n" +
        "\treturn new Contract" + contractName + "(new ethers.Contract(\n" +
        "\t\tcontractAddress,\n" +
        "\t\tjson" + contractName + ".abi,\n" +
        "\t\ttransactionManager.signer,\n" +
        "\t), transactionManager)\n" +
        "}\n")
      fileTs.getHash.push(
        "export const getHashContract" + contractName + " = (\n" +
        ") => {\n" +
        //"\treturn ethers.utils.id(JSON.stringify(json" + contractName + "))\n" +
        "\treturn ethers.BigNumber.from('" + contractHash + "') \n" +
        "}\n")
    }

  }
}

const buildContractConfig = (contractConfig: { contract: string, input?: any }) => {
  const config = {
    language: 'Solidity',
    sources: {},
    settings: {
      "optimizer": {
        "enabled": true,
        "runs": 10000,
      },
      "evmVersion": "london",
      outputSelection: {
        '*': {}
      }
    }
  }
  config.sources[contractConfig.contract + ".sol"] = loadContract(contractConfig.contract + ".sol")
  config.settings.outputSelection['*'][contractConfig.contract.slice(contractConfig.contract.lastIndexOf('/') + 1)] = ['evm.bytecode.object', 'abi', 'linkReferences']
  contractConfig.input = config
  return contractConfig;
}


const main = async () => {

  const defineSource = JSON.parse(fs.readFileSync("solidity/soliditySource.json").toString())

  const fileTs = {
    name: "contractAutoFactory.ts",
    header: [
      "import { ethers } from 'ethers'",
      "import { TransactionManager } from '" + defineSource.TransactionManager + "'",
      "import { ContractGeneric, initContract, ContractFunction } from '" + defineSource.ContractGeneric + "'"
    ],
    import: [],
    class: [],
    abi: [],
    create: [],
    createWithManager: [],
    get: [],
    getWithManager: [],
    getHash: [],
  }



  if (fs.existsSync(defineSource.outputPath)) {
    fs.rmSync(defineSource.outputPath, { recursive: true })
  }
  fs.mkdirSync(defineSource.outputPath)


  defineSource.file.forEach((contractConfig: { contract: string, config?: any }) => {
    compileInput(buildContractConfig(contractConfig), defineSource.outputPath, fileTs)
  })

  const fileTsOutput =
    fileTs.header.map((str: string) => str).join('\n') + "\n\n" +
    fileTs.import.map((str: string) => str).join('\n') + "\n\n" +
    fileTs.class.map((str: string) => str).join('\n') + "\n\n" +
    //fileTs.abi.map((str: string) => str).join('\n') + "\n\n" +
    fileTs.create.map((str: string) => str).join('\n') + "\n\n" +
    fileTs.createWithManager.map((str: string) => str).join('\n') + "\n\n" +
    fileTs.get.map((str: string) => str).join('\n') + "\n\n" +
    fileTs.getWithManager.map((str: string) => str).join('\n') +
    fileTs.getHash.map((str: string) => str).join('\n') + "\n\n"
  fs.writeFileSync(defineSource.outputPath + fileTs.name, fileTsOutput)


  fs.rmSync(defineSource.outputCopyPath, { recursive: true, force: true })

  // To copy a folder or file
  fse.copySync(defineSource.outputPath, defineSource.outputCopyPath)

}

if (require.main === module) {
  try {
    main()
  } catch (err) {
    console.error(err)
  }
}
