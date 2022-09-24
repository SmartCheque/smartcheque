import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import path from "path"
import hostConfig from "../config/hostConfig"

const appInit = () => {
  const app = express();


  //await databaseInit();

  const corsOptions = {
    origin: hostConfig.origin
  }

  app.use(cors(corsOptions))

  // parse requests of content-type - application/json
  app.use(bodyParser.json())

  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({
    extended: true
  }))

  // force: true will drop the table if it already exists
  // db.sequelize.sync({force: true}).then(() => {
  //   console.log('Drop and Resync Database with { force: true }');
  //   initial();
  // });

  // simple route
  app.get("/", (_req, res) => {
    res.json({
      message: "Welcome to nfteverywhere backend."
    });
  });

  //private file server
  const publicPath = path.join(__dirname, '../../../public')
  app.use(express.static(publicPath))

  // routes
  require('../routes/contractRoutes').default(app)
  require('../routes/authRoutes').default(app)
  require('../routes/userRoutes').default(app)
  require('../routes/fileRoutes').default(app)
  require('../routes/maintenanceRoutes').default(app)
  require('../routes/walletRoutes').default(app)

  // set port, listen for requests
  const PORT = process.env.PORT || hostConfig.port;
  return app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
  })

}

export default appInit
