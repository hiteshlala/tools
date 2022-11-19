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
  node wordlasso.js <PATTERN> <INCLUDES> <EXCLUDES>

or
  ./wordlasso.js <PATTERN> <INCLUDES> <EXCLUDES>

<PATTERN>:
  required pattern of known and unknown letters in the word.
  example patterns:
    h..l.
    ...le.

<INCLUDES>
  optional include letters
  h..l.  o
  ...le. cab

<EXCLUDES>
  optional exclude letters
  h..l.  o z
  ...le. cab rf
  ...le. . rf   # this shows how you have an empty include list
`;

if (!firstArg) {
  console.log('\nWord pattern required.');
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
const data = rawdata.trim().split('\n');

// console.log('Number of Words:', data.length); // 235887

console.log(`\nSearching for "${firstArg}"`);

let options = data.filter(word => {
  if (word.length !== wordLength) return false;
  for(let i = 0; i < searchLetterIdx.length; i++) {
    if(word[searchLetterIdx[i]].toLowerCase() !== letters[searchLetterIdx[i]]) return false;
  }
  return true;
});

// includes letters list
if (argv[3] && argv[3] !== '.') {
  const mustcontain = argv[3].toLowerCase().split('');
  console.log('Includes:', mustcontain);
  options = options.filter(word => {
    return mustcontain.reduce((result, letter) => {
      return result && (word.toLowerCase()).includes(letter);
    }, true);
  });
}

// excludes letters list
if (argv[4]) {
  const mustnotcontain = argv[4].toLowerCase().split('');
  console.log('Excludes:', mustnotcontain);
  options = options.filter(word => {
    return mustnotcontain.reduce((result, letter) => {
      return result && !((word.toLowerCase()).includes(letter));
    }, true);
  });
}

console.log('\nFiltered', data.length, 'Words!');
console.log(options.length, `potential matches of "${firstArg}" found:\n`);

let count = 0;
let line = '';
for(let i = 0; i < options.length; i++) {
  count++;
  line += `${options[i]}\t`;
  if ( count === 6) {
    count = 0;
    console.log(line);
    line = '';
  }
}
console.log(line);

console.log();