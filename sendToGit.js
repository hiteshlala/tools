#!/usr/bin/env node

const cp = require('child_process');
const { argv } = require('process');

const message = argv[2] || 'update data';

function commit() {
  return new Promise((resolve, reject) => {
    console.log('\nCommit...');
    const p = cp.spawn('git', ['commit', '-m', message]);
    p.stdout.on('data', (d) => console.log(d.toString()));
    p.stderr.on('data', (d) => console.log(d.toString()));
    p.on('close', (code) => {
      const msg = `Commit exited with code: ${code} ${code == 0 ? 'OK' : 'ERROR'}`;
      if ( code === 0 ) resolve(msg);
      else reject(new Error(msg));
    });
  });
}

function add() {
  return new Promise((resolve, reject) => {
    console.log('\nAdd...');
    const p = cp.spawn('git', ['add', '.']);
    p.stdout.on('data', (d) => console.log(d.toString()));
    p.stderr.on('data', (d) => console.log(d.toString()));
    p.on('close', (code) => {
      const msg = `Add exited with code: ${code} ${code == 0 ? 'OK' : 'ERROR'}`;
      if ( code === 0 ) resolve(msg);
      else reject(new Error(msg));
    });
  });
}

function push() {
  return new Promise((resolve, reject) => {
    console.log('\nPush...');
    const p = cp.spawn('git', ['push']);
    p.stdout.on('data', (d) => console.log(d.toString()));
    p.stderr.on('data', (d) => console.log(d.toString()));
    p.on('close', (code) => {
      const msg = `Push exited with code: ${code} ${code == 0 ? 'OK' : 'ERROR'}`;
      if ( code === 0 ) resolve( msg );
      else reject(new Error(msg));
    });
  });
}

async function runner() {
  try {
    let result = await add();
    console.log(result);
    result = await commit();
    console.log(result);
    result = await push();
    console.log(result);
  }
  catch(e) {
    console.log('Error:', e.message);
  }
}

runner()
.catch(console.log);
