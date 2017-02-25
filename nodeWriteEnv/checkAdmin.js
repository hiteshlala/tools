'use strict';

let spawn = require( 'child_process' ).spawn;
let fs = require( 'fs' );
let crypt = require( 'crypto-js' );
let jwt = require( 'jsonwebtoken' );

let batfile = 'setEnv.bat';
let keyfile = 'pipekey.pem';

let encrypted = process.env.ADMINUSER;
let salt = fs.readFileSync( keyfile, 'utf8' );
let admin = jwt.decode( encrypted, salt );
console.log( admin );