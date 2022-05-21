/*
  A script to see if any of the processes that are part of the Pegasus spyware are
  running on my machine.  This is unlikely since these exploits are for mobile but
  it was just something to do while sitting at the hospital.

  https://github.com/AmnestyTech/investigations
  https://www.amnesty.org/en/latest/research/2021/07/forensic-methodology-report-how-to-catch-nso-groups-pegasus/

  The script dumps current running processes to
  /Users/hiteshlala/Programming/junk/*.processes.log
  then scans any for any of the listed processes in
  /Users/hiteshlala/Programming/AmnestyTech_investigations/2021-07-18_nso/processes.txt

*/

const { argv } = require('process');
const cp = require('child_process');
const fs = require('fs');


function writeProcesesToLofFile(outFile) {
  return new Promise((resolve, reject) => {
    console.log('\nGet Processes...');
    const p = cp.spawn('ps', ['-A']);
    p.stdout.pipe(outFile);
    p.stderr.pipe(outFile);

    p.stdout.on('data', (d) => console.log(d.toString()) );
    p.stderr.on('data', (d) => console.log(d.toString()) );
    p.on('close', (code) => {
      const msg = `Exited with code: ${code} ${code == 0 ? 'OK' : 'ERROR'}`;
      if ( code === 0 ) resolve(msg);
      else reject(new Error(msg));
    });
  });
}

async function runner() {
  try {
    // const newLogFile = `/Users/hiteshlala/Programming/junk/${1653164020572}.processes.log`;
    const newLogFile = `/Users/hiteshlala/Programming/junk/${Date.now()}.processes.log`;
    console.log(`\nNew log file:\n   ${newLogFile}`);
    const outFile = fs.createWriteStream(newLogFile);
    await writeProcesesToLofFile(outFile);
    

    const toScan = fs.readFileSync(newLogFile, { encoding: 'utf8' });

    const scanFor = fs.readFileSync(
      '/Users/hiteshlala/Programming/AmnestyTech_investigations/2021-07-18_nso/processes.txt', 
      { encoding: 'utf8' })
        .trim()
        .split('\n');
        
    console.log('\nBegin Scanning:')
    for( let i = 0; i < scanFor.length; i++) {
      const spy = scanFor[i];
      console.log('    Scanning for:', spy);
      const exploit = new RegExp(spy);
      if ( exploit.test(toScan)) {
        console.log('      Exploit Found!');
      }
    }

    console.log('\nDone')
  }
  catch(e) {
    console.log(e);
  }

}

runner();