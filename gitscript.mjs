import octo from '@octokit/core';
import cp from 'node:child_process';
import fs from 'node:fs';
import chalk from 'chalk';

import conf from './config.json' assert { type: 'json' };

const { fga } = conf;
const expressDir = '../2'; // make sure you pull to tip and are on master

const debug = false;


const octokit = new octo.Octokit({
  auth: fga,
  baseUrl: 'https://github.medallia.com/api/v3'
});

async function getCommitStatus(hash) {
  const resp = await octokit.request(`GET /repos/Express/express/commits/${hash}/status`, {
    owner: 'OWNER',
    repo: 'REPO',
    ref: 'REF'
  });
  return resp;
}

function getCommitsFrom(startDate, endDate) { 
    const p = cp.spawnSync(
      'git', 
      [
        'log', 
        '--no-merges', 
        '--oneline',
        `--after="${startDate}"`,
        `--until="${endDate}"`
      ], 
      { cwd: expressDir }
    );
    return p.output.toString().trim();
}

async function processCohort(startDate = '2023-02-01', endDate = '2023-03-31') {
  console.log('processing from', startDate, 'to', endDate);
  console.group();
  const lines = getCommitsFrom(startDate, endDate).split('\n');
  const hashes = lines
    .map(l => l.split(' ')[0].replace(/ /g,'').replace(/\./g, '').replace(/,/g, ''))
    .filter(v => !!v );
  const result = {
    key: startDate,
    total: hashes.length,
    fail: 0,
    value: 0
  };
  console.log('found', result.total, 'commits');
  let count = 0
  console.group();
  for(let hash of hashes) {
    count++;
    try {
      const resp = await getCommitStatus(hash);
      console.log(hash, resp?.data?.state);
      if(resp?.data?.state == 'failure') { result.fail++; }
    }
    catch(e) {
      console.log(hash, 'error:', e.message);
    }
    if (count > 3 && debug) break;
  }
  console.groupEnd();
  console.groupEnd();
  result.value = result.fail/result.total;
  return result;
}


async function howManyMonthsBack(months = 12) {
  const today = new Date().toISOString();
  const result = [];
  let month = today.slice(5, 7);
  let year = today.slice(0, 4); 
  for(let i = 0; i < months; i++) {
    const startDate = `${year}-${month.toString().padStart(2,'0')}-01`;
    const endDate = `${year}-${month}-31`
    const d = await processCohort(startDate, endDate);
    result.push(d);
    if (month == 1) {
      month = 12;
      year--;
    } else {
      month--; 
    }
  }
  
  return result;
}

function makeBarChart( data, options = {} ) {
  const block = '▋';
  let { maxWidth } = options

  maxWidth = maxWidth ? (maxWidth % 2 == 0 ? maxWidth + 1 : maxWidth) : 100;

  let array = []
  for ( let i = 0, len = data.length; i < len; i++ ) {
    const item = data[i];
    const { key, value } = item
    const barColumns = Math.round( maxWidth * value )
    const restColumns = maxWidth - barColumns
    const keyLength = key.length;
    
    const colorize = options.colorize ? options.colorize( item, i, data ) : chalk.blue
    const label = options.renderLabel ?
      options.renderLabel( item, i, data ) :
      chalk.gray( ( value * 100 ).toFixed( 1 ) + '%' )

    array.push(
      ' '.repeat( keyLength ).slice( keyLength ) + key + ' ' +
      colorize( block.repeat( barColumns ) ) +
      chalk.gray( block.repeat( restColumns ) ) +
      ' ' + label
    )
  }

  return array.join( '\n\n' )
}


// ================ run here =================
const start = Date.now();
const data = await howManyMonthsBack(2);
const end = Date.now();

console.table(data);
fs.writeFileSync('expressFailCounts.json', JSON.stringify(data, null, 2), { encoding: 'utf8'});

const chart = makeBarChart(data);
console.log(chart);

console.log('\n took', end - start, 'ms to run');

