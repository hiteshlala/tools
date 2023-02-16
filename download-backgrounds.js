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

function getImage(fname, destination, srcDest) {
  const writeTo = `${destination}${fname}`;
  const path = `https://hiteshlala.com/${srcDest}`;
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

  // convert directory data into image list objects
  let imageList = [];
  const dataDir = Object.keys(data).sort();
  for(let key of dataDir) {
    console.log(key)
    const dataDirList = data[key];
    for(let image of dataDirList) {
      imageList.push({
        path: `${key}/images/${encodeURIComponent(image)}`,
        name: image
      });
    }
  }

  for (const img of imageList) {
    console.log(img.name);
    await getImage(img.name, dest, img.path)
  }
}

runner()
.catch(console.log)
.finally(() => {
  console.log('done');
})
