#!/usr/bin/env node

const fs = require('fs');

const downloadFolder = '/Users/hiteshlala/Downloads';
const outpuFolder = '/Users/hiteshlala/Desktop/Pictures';
const files = fs.readdirSync(downloadFolder);
const months = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec'
};

const today = new Date();

const historyfname = 'imgsDownloadsToPictureFolders.last';
const date = `${today.getDate()}${months[today.getMonth()]}${today.getFullYear()}`;
const history = fs.readFileSync(historyfname, { encoding: 'utf8'}).split('-');

let count = 0;
if ( history[0] === date ) {
  count = parseInt(history[1]);
}

const imgs = files.filter( f => {
  if ( /.png/.test(f) && (/tesselation/.test(f) || /fractal/.test(f)) ) {
    return true;
  } else {
    return false;
  }
});

imgs.forEach((f) => {
  count++;
  const newfname = `fractal${count}-${date}.png` 
  console.log( f, newfname );
  fs.renameSync( `${downloadFolder}/${f}`, `${outpuFolder}/${newfname}`)
});

fs.writeFileSync(historyfname, `${date}-${count}\n`);

