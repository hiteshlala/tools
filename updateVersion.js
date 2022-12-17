const fs = require('fs');
const { argv } = require('process');
const cp = require('child_process');

const incMajor = argv[2] === 'major';
const incMinor = argv[2] === 'minor';


console.log('Bumping Version...');
const orig = fs.readFileSync('./package.json', { encoding: 'utf8' });
const origJson = JSON.parse(orig);
console.log('  Original:', origJson.version);
let [major, minor, patch] = origJson.version.split('.');

if (incMajor) {
  major = parseInt(major) + 1;
  minor = 0;
  patch = 0;
} else if (incMinor) {
  minor = parseInt(minor) + 1;
  patch = 0;
} else {
  patch = parseInt(patch) + 1;
}

const newversion = `${major}.${minor}.${patch}`;
origJson.version = newversion;

fs.writeFileSync('./package.json', JSON.stringify(origJson, null, '  '), {
  encoding: 'utf8',
});
console.log('     Final:', newversion);

// write a version file that can be loaded by app
// console.log( 'Writing version.js file...')
// fs.writeFileSync('./docs/version.js', `const version = '${newversion}';`, {
//   encoding: 'utf8',
// });


// write version to output html file
// let html = fs.readFileSync( './docs/index.html', { encoding: 'utf8' });
// html = html.replace( '__VERSION__', newversion );
// console.log( 'Setting Version to: ', newversion );
// fs.writeFileSync( './docs/index.html', html, 'utf8' );


console.log('    done');




