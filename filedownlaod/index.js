/**
 * This is a simple Koa server that has a file download endpoint.
 * This demonstrates how to take some in memory data and pass it along
 * to the client side to be treated as a file download.
 */

const fs = require( 'fs' );
const Koa = require( 'koa' );
const Router = require( 'koa-router' );

const dummydata = {
  one: 'one',
  two: 'two',
  three: 'three',
  four: 'four'
};

function dblookup() {
  return new Promise(( resolve, reject ) => {
    // mimich a db lookup with a delay
    // convert data to a buffer
    setTimeout( () => resolve( Buffer.from( JSON.stringify( dummydata ), 'utf8' )  ), 2000 );

    // can also pass a file directly
    // resolve( fs.createReadStream( 'filename.txt) );
  });
}

const home = new Router();
home.get( '/', ctx => {
  console.log( ctx.method, ctx.url, ctx.ip );
  console.log( ctx.host, ctx.protocol );
  ctx.type = 'html';
  ctx.body = fs.createReadStream( 'index.html' );
  // ctx.body = fs.readFileSync( 'index.html' ); // also works
});
home.get( '/file', ( ctx )=> {
  console.log( ctx.method, ctx.url, ctx.ip );
  console.log( ctx.host, ctx.protocol );
  return dblookup()
  .then( r => {
    ctx.set( {
      'Content-Disposition': 'filename=somedata.json',
    });
    ctx.body = r;
  })
  .catch( e => {
    ctx.body = e;
  });
});

const app = new Koa();
app.on('error', ( err, ctx ) => {
  console.log(`Server Error: ${err}`);
});
app.use( home.routes() );
app.use( home.allowedMethods() );
app.listen( 7002 );

