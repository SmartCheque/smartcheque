/*
* RaNdom Password Generator
*/
import crypto from 'crypto'
const PASSWORD_LENGTH = 18;
const LOWERCASE_ALPHABET = 'abcdefghijklmnopqrstuvwxyz'; // 26 chars
const UPPERCASE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // 26 chars
const NUMBERS = '0123456789'; // 10 chars
const SYMBOLS = ',./<>?;\'":[]\\|}{=-_+`~!@#$%^&*()'; // 32 chars
const ALPHANUMERIC_CHARS = LOWERCASE_ALPHABET + UPPERCASE_ALPHABET + NUMBERS; // 62 chars
const ALL_CHARS = ALPHANUMERIC_CHARS + SYMBOLS; // 94 chars

function generateRandomPassword(length: number, alphabet: string) {

  var rb = crypto.randomBytes(length);
  var rp = "";

  for (var i = 0; i < length; i++) {

    rb[i] = rb[i] % alphabet.length;
    rp += alphabet[rb[i]];

  }

  return rp;
}

/*
console.log("RaNdom Password: " + generateRandomPassword(PASSWORD_LENGTH, LOWERCASE_ALPHABET));
console.log("RaNdom Password: " + generateRandomPassword(PASSWORD_LENGTH, UPPERCASE_ALPHABET));
console.log("RaNdom Password: " + generateRandomPassword(PASSWORD_LENGTH, NUMBERS));
console.log("RaNdom Password: " + generateRandomPassword(PASSWORD_LENGTH, SYMBOLS));
console.log("RaNdom Password: " + generateRandomPassword(PASSWORD_LENGTH, ALPHANUMERIC_CHARS));
console.log("RaNdom Password: " + generateRandomPassword(PASSWORD_LENGTH, ALL_CHARS));
*/

function generatePassword() {
  return generateRandomPassword(PASSWORD_LENGTH, ALPHANUMERIC_CHARS);
}

export {
  generateRandomPassword,
  generatePassword,
  PASSWORD_LENGTH,
  LOWERCASE_ALPHABET,
  UPPERCASE_ALPHABET,
  NUMBERS,
  SYMBOLS,
  ALPHANUMERIC_CHARS,
  ALL_CHARS,
}
