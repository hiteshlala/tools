const salary = 140000;

const weeks = 52;
const days = weeks * 5; // 5 day work week
const hours = days * 8; // 8 hour work day


function calculateRates( salary ) {
  const weekly = Math.round(salary/weeks);
  const monthly = Math.round(salary/12);
  const daily = Math.round(salary/days);
  const hourly = Math.round(salary/hours);
  console.log();
  console.log( '$/year', salary);
  console.log( '$/month', monthly)
  console.log( '$/weekly', weekly );
  console.log( '$/day', daily)
  console.log( '$/hour', hourly)
  console.log();
}

calculateRates(140000);
calculateRates(160000);