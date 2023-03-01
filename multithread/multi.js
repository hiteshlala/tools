const fs = require('node:fs');
const cp = require('node:child_process');
const { argv, stdin: input, stdout: output } = require('node:process');
const readline = require('node:readline');

const fileToRun = argv[2] || 'multi-child.js';


function createCruncher(signal, crunch) {
  crunch = crunch || fileToRun;

  const child = cp.fork(crunch, { signal });

  child.on('error', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  child.on('message', (message) => {
    console.log(`child process messaged ${JSON.stringify(message)}`);
  });

  return child;
}


const rl = readline.createInterface({ input, output });

function runner() {
  const crunchers = [];
  for(let i = 0; i < 4; i++) {
    const con = new AbortController();
    const { signal } = con;
    crunchers.push(createCruncher(signal));
  }

  function askQuestion() {
    rl.question('What todo?:', (answer) => {
      const [action, ...args] = answer.trim().split(' ');


      switch(action) {
        case 'kill':
          const index = args[0];
          if (index === 'all') {
            crunchers.forEach(c => {
              if (c && c.connected ) {
                c.send({ close: true })
              }
            });
          }
          else if ( crunchers[index] && crunchers[index].connected) {
            crunchers[index].send({ close: true });
          }
          break;

        case 'done':
          process.exit();
          break;
      }
      askQuestion();
    });
  }

  console.log('Initializing...')
  setTimeout(() => {
    askQuestion();
  }, 3000);
    
    

}

runner();

