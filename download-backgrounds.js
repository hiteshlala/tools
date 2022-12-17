#!/usr/bin/env node

const fs = require('fs');
const https = require( 'https' );

const dest = '/Users/hiteshlala/Desktop/junk/'; // macos
// const dest = '/Users/Hitesh/Desktop/junk/'; // windows machine

function download(url, dest) {
  return new Promise((resolve, reject) => {
    var file = fs.createWriteStream(dest);
    https.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(resolve);
      });
    });
  });
}  

function getImage(fname, destination) {
  const writeTo = `${destination}${fname}`;
  const path = `https://hiteshlala.com/backgrounds/images/${encodeURIComponent(fname)}`;
  return download(path, writeTo);
}

function getImageList() {
  const url = `https://hiteshlala.com/backgrounds/directory.js`;
  return new Promise((resolve, reject) => {
    let strdata = ""
    const req = https.get(url, function(res) {
      res.on('data', d => strdata += d);
      res.on('end', () => {
        strdata = strdata.replace('const data =', '');
        strdata = strdata.replace(';', '');
        const flist = JSON.parse(strdata)
        resolve(flist);
      });
    })
    req.on('error', reject);
  });
}


async function runner() {
  const data = await getImageList()
  for (const img of data) {
    console.log(img);
    await getImage(img, dest)
  }
}

runner()
.catch(console.log)
.finally(() => {
  console.log('done');
})
