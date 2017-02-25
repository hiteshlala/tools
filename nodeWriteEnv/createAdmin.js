'use strict';

let spawn = require( 'child_process' ).spawn;
let fs = require( 'fs' );
let crypt = require( 'crypto-js' );
let jwt = require( 'jsonwebtoken' );

let uname = process.argv[2];
let  pswd = process.argv[3];
let fname = process.argv[4];
let  lname = process.argv[5];
let email = process.argv[6];

let batfile = 'setEnv.bat';
let keyfile = 'key.pem';

let admin = { 
  username: uname || 'admin',
  firstname: fname || "FirstName",
  lastname: lname || "LastName",
  email: email || "",
  password: 'pswd',
  role: "admin",
  status: "active",
  resetuser: false
};


let hashpswd = password => {
  password = password || 'admin';
  return crypt.SHA3( password ).toString();
};

let encryptadmin = ( admin, salt ) => {
  salt = salt || 'fluffy poodles';
  return jwt.sign( admin, salt );
};

let writebatfile = encryptedadmin => {
  let data = `echo 'batfile executed'
setx ADMINUSER "${encryptedadmin}" /m`;
  fs.writeFileSync( batfile, data, 'utf8');
};

let executebatfile = ( batfile ) => {
  let command = spawn(__dirname + '/' + batfile );
  command.on( 'close', d => {
    console.log( '\nEnvironment Variable Set Code:', d );
  });
  command.on( 'error', e => {
    console.log( 'Error', e );
  });
};


console.log( '\n user name:', uname );

console.log( '\n hashing password...' );
pswd = hashpswd( pswd );
admin.password = pswd;

console.log( '\n reading salt...' );
let salt = fs.readFileSync( keyfile, 'utf8' );

console.log( '\n encrypting admin...' );
let encrypted = encryptadmin( admin, salt );

console.log( '\n writing bat file....' );
writebatfile( encrypted );

console.log( '\n execute bat file....' );
executebatfile( batfile );

console.log( '\n done' );



