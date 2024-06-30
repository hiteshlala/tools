fetch('https://docs.brew.sh/Manpage', {
  method: 'GET',
})
.then(r => r.text())
.then(console.log)
.catch(console.log)