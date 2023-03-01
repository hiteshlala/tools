

console.log('multi-child.js called', process.pid);
process.send({ message: 'ready', pid: process.pid });


process.on('message', message => {
  console.log(process.pid, 'message recived:', message);
  if (message.close) {
    console.log('killing', process.pid)
    process.exit();
  }
});






