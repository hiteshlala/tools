'use strict';

let fs = require('fs');

function print( pathtodir ) {
  let files = fs.readdirSync( pathtodir );
  files.forEach( file => {
    let stats = fs.statSync( pathtodir + '/' + file);
    let created = new Date( stats.birthtime ).toDateString();
    console.log( created, file );
  });
}

function printFileDetais( pathtodir ) {
  let files = fs.readdirSync( pathtodir );
  files.forEach( file => {
    let stats = fs.statSync( pathtodir + '/' + file);
    console.log( file, stats );
  });
}

function sepByDay( pathtodir ) {
  let files = fs.readdirSync( pathtodir );
  let separated = {};
  files.forEach( file => {
    let stats = fs.statSync( pathtodir + '/' + file);
    let created = new Date( stats.mtime ).toDateString().replace(/ /g,'');
    separated[created] ? separated[created].push( file ) : separated[created] = [file];
  });
  console.log( JSON.stringify(separated, null, ' ') );
  // return separated;
  let folders = Object.keys( separated );
  console.log( folders.length );

  // fs.unlinkSync() // deletes a file

}

function sepByDay2( pathtodir ) {
  let files = fs.readdirSync( pathtodir );
  files.forEach( file => {
    let currFile = pathtodir + '/' + file;
    let stats = fs.statSync( currFile );
    let created = new Date( stats.mtime ).toDateString().replace(/ /g, '');
    let newPath = pathtodir + '/' + created;
    let newFile = newPath + '/' + file;
    if( fs.existsSync( newPath) ) {
      fs.renameSync( currFile, newFile );
      console.log( currFile, '     to     ', newFile );
    }
    else {
      fs.mkdirSync( newPath );
      console.log( 'creating directory', newPath );
      fs.renameSync( currFile, newFile );
      console.log( currFile, '     to     ', newFile );
    }
  });
}

// C:\Users\lhi\Downloads

// print('.');
// print('../versionBumper');

// sepByDay( '.' );
// sepByDay( '../versionBumper' );

// sepByDay( 'Pictures' );
// sepByDay2( 'Pictures' );

// console.log( fs.existsSync( '../../Users/lhi/Downloads' ) );
// console.log( fs.existsSync( '../../Users/lhi/Downloads/Some' ) );
// fs.mkdirSync( '../../Users/lhi/Downloads/Some' );
// console.log( fs.existsSync( '../../Users/lhi/Downloads/Some' ) );


// printFileDetais( 'Pictures');


let src = 'Pictures2';
let dest = 'Pictures';

function sepByMonth( src, dest ) {
  let srcfolders = fs.readdirSync( src );
  
  srcfolders.forEach( folder => {
    let newFolder = folder.substr(3,3) + folder.substr(-4);
    
    let filestomove = fs.readdirSync( src + '/' + folder );
    
    filestomove.forEach( file => {
      if( fs.existsSync( dest +'/' + newFolder) ) {
        fs.renameSync(  src + '/' + folder + '/'+ file,
                        dest + '/' + newFolder +'/' + file );
        console.log( 'moved', file );
      }
      else {
        fs.mkdirSync( dest + '/' + newFolder );
        console.log( 'creating directory', dest + '/' + newFolder );
        fs.renameSync(  src + '/' + folder + '/'+ file,
                        dest + '/' + newFolder +'/' + file );
        console.log( 'moved', file );
      }
    });
  });
}

sepByMonth( src, dest );