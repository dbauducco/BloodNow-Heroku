// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = 'ACa27760c88d9975d5f8a3c2a242cf3b56';
const authToken = '608d99df3a7a03ca4d3abd151e8a7bcb';
const client = require('twilio')(accountSid, authToken);

client.calls
      .create({
         url: 'http://demo.twilio.com/docs/voice.xml',
         to: '+18328336997',
         from: '+12054028369'
       })
      .then(call => console.log(call.sid));