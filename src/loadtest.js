const loadtest = require('loadtest');
const options = {
  url: 'http://localhost:3000/relations/workspaces/8dbba62c-671d-40da-bce7-448f7f650d22/pending',
  maxRequests: 100,
  requestsPerSecond: 10,
  concurrency: 100,
  cookies: [
    'Authentication=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkYTUyNzAwMy0zMGEyLTQwOWUtOWMyMi03OGRjODMzOTVhNjYiLCJpYXQiOjE2NTE1OTYwNTEsImV4cCI6MTY1MTU5Njk1MX0.N2e-hhemrAffxqit5bn9VgaXpbjTfZt8zTqUFHUie6Y; Path=/; HttpOnly; Expires=Tue, 03 May 2022 16:55:51 GMT;',
  ],
  method: 'GET',
};
loadtest.loadTest(options, function (error, result) {
  if (error) {
    return console.error('Got an error: %s', error);
  }
  console.log(result);
  console.log('Tests run successfully');
});
