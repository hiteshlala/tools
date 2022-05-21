const fs = require('fs');

const folder = '/Users/hiteshlala/Documents/Music-Score/Celtic Fiddle Music - Georgia Nettleton - Celtic Fiddle Harmony Sheet Music Multipack 2';

const files = fs.readdirSync(folder);

files.forEach( f => {
  let newName = f.replace('Celtic Fiddle Music - Georgia Nettleton - Celtic Fiddle Harmony Sheet Music Multipack 2 - ', '');

  const startsWith = newName.slice(0, 3);
  if ( /[0-9]/.test(startsWith) ) {
    newName = newName.slice(3);
  }

  newName = newName.replace(/ /g, '-');

  const [name, extension] = newName.split('.');
  newName = `${name}_Georgia_Nettleton.${extension}`;

  console.log(f);
  console.log(newName);
  console.log();

  // fs.renameSync(`${folder}/${f}`, `${folder}/${newName}`);

})

// console.log(files);