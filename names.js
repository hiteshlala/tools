#!/usr/bin/env node

/*
  Return number (argv[]) of names 
*/

const fs = require('fs');

const { argv } = process;

const macPath = '/usr/share/dict/propernames';


const  rawdata = fs.readFileSync(macPath, {encoding: 'utf8'});
const data = rawdata.trim().split('\n');

console.log('\nNumber of Names:', data.length); // 1308



const numNames = parseInt(argv[2]);

if (numNames && Number.isInteger(numNames) ) {
  console.log(`\nRandomly selecting ${numNames} names.\n`)
  const names = [];
  for(let i = 0; i < numNames; i++) {
    const name = data[Math.floor(Math.random() * data.length)];
    names.push(name);
  }
  console.log(names);
  console.log();
}
else {
  console.log( '\nTo get a list of 5 names enter:\n\t./names.js 5\nor\n\tnode names.js 5\n'); 
}
