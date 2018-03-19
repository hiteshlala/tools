'use strict';

const loadtest = require( 'loadtest' );

let conf = {
  url: 'http://localhost:9000',
  maxRequests: 50,
  concurrency: 4,
  statusCallback: callback
};
function callback( error, result, latency ) {
  // console.log('Current latency %j, result %j, error %j', latency, result, error);
  // console.log('Request elapsed milliseconds: ', result.requestElapsed);
  // console.log('Request index: ', result.requestIndex);
  // console.log('Request loadtest() instance index: ', result.instanceIndex);

  console.log( result.requestIndex, result )


}

loadtest.loadTest( conf, (error, result) => {
  if ( error ) {
    return console.error('Got an error: %s', error);
  }
  console.log('Tests run successfully');
  console.log( result );
})