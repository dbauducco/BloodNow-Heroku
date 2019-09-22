var express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
var app = express();
const httpRequest = require('request-promise');
const urlencoded = require('body-parser').urlencoded;

// Parse incoming POST params with Express middleware
app.use(urlencoded({ extended: false }));

app.get('/',function(req,res)
{
    res.send('How are you?');
});

app.post('/test', (request, response) => {
  // Use the Twilio Node.js SDK to build an XML response
  const twiml = new VoiceResponse();
 
  twiml.pause({legth: 3});
    
  const getNumber = async (pCallID) => {
    var options = { method: 'POST',
          url: 'https://us-central1-react-test-app-252223.cloudfunctions.net/getPhoneNumber',
          headers: 
           { 'cache-control': 'no-cache',
             'Content-Type': 'application/x-www-form-urlencoded' },
          form: { callID: pCallID} };
    const num = await httpRequest(options);
    return num;
  }
    
  if (request.body.Digits) {
      
      twiml.say("One second please.");
      twiml.pause({length: 1});

      var options = { method: 'POST',
          url: 'https://us-central1-react-test-app-252223.cloudfunctions.net/getPhoneNumber',
          headers: 
           { 'cache-control': 'no-cache',
             'Content-Type': 'application/x-www-form-urlencoded' },
          form: { callID: request.body.Digits} };
      httpRequest(options).then(body => {
         
        if (body == "Empty!") {
         twiml.say('That caller ID does not exist,\nlets start over');
         twiml.redirect('/test');
        } else {
         twiml.say("Connecting you now.");
         twiml.dial(body, {});
        }
        
        response.type('text/xml');
        response.send(twiml.toString());
      });
      
      //if (body != "Empty!") {
      //twiml.say("Connecting you now.");
      //twiml.dial(number, {});
          //} else {
        //    twiml.say("That call ID is not associated with a phone number.");
            
          //}
      
  } else {
    
      // Use the <Gather> verb to collect user input
      const gather = twiml.gather({ numDigits: 5 });
      gather.say('Thank you for calling BloodNow.\nPlease enter the 5 digit call id.');

      // If the user doesn't enter input, loop
      twiml.redirect('/test');


      // Render the response as XML in reply to the webhook request
      response.type('text/xml');
      response.send(twiml.toString());
  }
});

var server = app.listen(process.env.PORT || 3000,function() {});


/*const http = require('http');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const express = require('express');

http
  .createServer((req, res) => {
    // Create TwiML response
    const twiml = new VoiceResponse();

    if (req.body.Digits) {
       console.log(req.body.Digits); 
    }
    
    twiml.say('Thank you for calling BloodNow.\nEnter the 5 digit code.');
    twiml.gather({numDigits: 5})
    twiml.say('Please enter the 5 digit code now.');
    
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  })
  .listen(process.env.PORT || 3000);*/

// twiml.dial('+18328336997',{});*/