#!/usr/bin/env node

const fs = require('fs');

const { argv } = process;

const linuxPath = '/etc/share/dict/';
const macPath = '/usr/share/dict/words';

const firstArg = argv[2];

const helpmessage = `
------------------------- Word Lasso --------------------------
Given a word pattern find all words in the local dictonary that 
could match.

Invoke by entering:
  node wordlasso.js <PATTERN>

or
  ./wordlasso.js <PATTERN>

<PATTERN>:
  required pattern of known and unknown letters in the word.
  example patterns:
    h..l.
    ...le.
`;

if (!firstArg) {
  console.log('Word pattern required.');
  console.log(helpmessage)
  return;
}

if (firstArg === '-h' || firstArg === '--help' || firstArg === '-help') {
  console.log(helpmessage);
  return;
}

const wordLength = firstArg.length;
const letters = firstArg.toLowerCase().split('');
const searchLetterIdx = letters.reduce((prev, curr, idx) => {
  if(curr !== '.') {
    prev.push(idx);
  }
  return prev;
}, []);


const  rawdata = fs.readFileSync(macPath, {encoding: 'utf8'});
const data = rawdata.split('\n');

// console.log('Number of Words:', data.length); // 235887

const options = data.filter(word => {
  if (word.length !== wordLength) return false;
  for(let i = 0; i < searchLetterIdx.length; i++) {
    if(word[searchLetterIdx[i]].toLowerCase() !== letters[searchLetterIdx[i]]) return false;
  }
  return true;
});

console.log('\nFiltered', data.length, 'Words!');
console.log(options.length, `potential matches of "${firstArg}" found:\n`);

let count = 0;
let lines = '';
for(let i = 0; i < options.length; i++) {
  count++;
  lines += `${options[i]}\t`;
  if ( count === 6) {
    count = 0;
    console.log(lines);
    lines = '';
  }
}
console.log();