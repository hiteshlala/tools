import https from 'node:https';

const protocol = 'https://'
// const domain = 'hitesh-asci-1.qa.den.medallia.com';
const domain =  'asci-latest.qa.den.medallia.com';
const company = 'merlin';

const username = '_hlala';
const password = 'Medallia1!2';

// curl -v -L --post302 -m 600 -X POST --data 'password=Medallia1!2&username=_hlala' https://hitesh-asci-1.qa.den.medallia.com/merlin/logonSubmit.do


const login = async () => {
  const body = `password=${password}&username=${username}`;

  const options = {
    hostname: domain,
    port: 443,
    // path: `/${company}/logonSubmit.do`,
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body),
      'Accept-Encoding': 'gzip, deflate',
      'Cache-Control': 'no-cache',
    },
  };

  const getCookies = () => new Promise((resolve, reject) => {
    const cookieOptions = {
      ...options,
      path: `/${company}/logonSubmit.do`,
    };

    const req = https.request(cookieOptions, (res) => {
      const location = res.headers.location;
      const status = res.statusCode;
      const cookiesStrings = `${res.headers['set-cookie']}`.split(',');
      const cookies = cookiesStrings.reduce((prev, curr) => {
        const [cookie] = curr.split(';');
        prev.push(cookie);
        return prev;
      }, []);

      res.setEncoding('utf8');

      res.on('data', (chunk) => { /* not interested in html */ });

      res.on('end', () => {
        resolve({ location, status, cookies });
      });
    });
    
    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
      reject(new Error(e.message));
    });
    
    req.write(body);
    req.end();
  });

  const cookies = await getCookies();
  console.log(cookies);

  const finalize = await fetch(cookies.location, {
    method: 'POST',
    headers: new Headers({
      Accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body),
      'Accept-Encoding': 'gzip, deflate',
      'Cache-Control': 'no-cache',
      Cookie: cookies.cookies,
    }),
    body,
  });

  return { cookies: finalize.headers.getSetCookie() };
};

const getUsers = async (cookies) => {
  const url = `${protocol}${domain}/apis/v0/users`;
  return fetch(url, {
    method: 'GET',
    headers: new Headers({
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'Cache-Control': 'no-cache',
      Cookie: cookies.cookies,
    }),
  })
  .then(r => {
    // for (const [k,v] of r.headers.entries()) {
    //   console.log(`${k}: ${v}`);
    // }
    return r.text();
  })
  .then(console.log)
  .catch(console.log);
};



const cookies = await login();
console.log('final:\n', cookies);

const users = await getUsers(cookies);
console.log(users);