#!/usr/bin/env node

const { argv } = require('process');
const { readFileSync, readdirSync, writeFileSync } = require('fs');

const dataFolder = argv[2];

if ( !dataFolder ) {
  console.log( 'data folder as cmd line argument is required')
  process.exit(1);
}

console.log('data folder:', dataFolder)
const template = readFileSync('./template.html', {encoding: 'utf8'});

let files;
try {
  files = readdirSync(dataFolder);
}
catch(e) {
  console.log(e.message);
  process.exit(1);
}

let towrite = '';

let filtered = files.filter( f => {
  if ( /.png/.test(f) ) return true;
  if ( /.jpeg/.test(f) ) return true;
  if ( /.jpg/.test(f) ) return true;
  if ( /.gif/.test(f) ) return true;
  if ( /.bmp/.test(f) ) return true;
  return false;
});

console.log('There are', filtered.length, 'image type files.');

filtered.forEach(f => {
  towrite += `<img src="${f}" name="${f}"><a targer="_blank" href="${f}">${f}</a>\n`;
});

const output = `${dataFolder}/index.html`; 
console.log('Writing to file', output);
writeFileSync(output, template.replace('__CONTENT__', towrite));

// '/Users/hiteshlala/Desktop/Pictures'