
const express = require('express');
const useragent = require('express-useragent');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();
app.use(bodyParser.json());
app.use(useragent.express());
const apiKey = process.env.API_KEY;
const otpTemplateName = "otp verification";


app.get('/', (req, res) => {
  const source = req.useragent;
  if (source.isAndroid) {
    return res.redirect('https://play.google.com/store/apps/details?id=dev.probity.reshimgathi&pcampaignid=web_share');
  }
  if (source.isiPhone || source.isiPad || source.isiPod) {
    return res.redirect('https://apps.apple.com/in/app/race-master-3d-car-racing/id1579072162');
  }
  res.send('Welcome to our website! Please visit the store links on your mobile device.');
});



app.get('/home/profile/:id', (req, res) => {
    const source = req.useragent;
    const profileId = req.params.id;
    
    console.log(`User visited profile with ID: ${profileId}`);
    if (source.isAndroid) {
        return res.redirect('https://play.google.com/store/apps/details?id=dev.probity.reshimgathi&pcampaignid=web_share');
    }
    
    if (source.isiPhone || source.isiPad || source.isiPod) {
        return res.redirect('https://apps.apple.com/in/app/race-master-3d-car-racing/id1579072162');
    }

    res.send(`Welcome to profile ${profileId}! Please visit the store links on your mobile device.`);
});



app.get('/.well-known/assetlinks.json', (req, res) => {
  const filePath = path.join(__dirname, 'assetlinks.json');
  res.sendFile(filePath);
});


app.get('/apple-app-site-association', (req, res) => {

    console.log("Requested Apple Certificate");

    const filePath = path.join(__dirname, 'apple-app-site-association');

    res.setHeader('Content-Type', 'application/json');
  
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
  

app.get('/.well-known/apple-app-site-association', (req, res) => {

    console.log("Requested Apple Certificate");

    const filePath = path.join(__dirname, 'apple-app-site-association');
  
    res.setHeader('Content-Type', 'application/json');
  
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });



// Send OTP
app.post('/api/v1/auth/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;
  
  if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
  }

  const sendOtpUrl = `https://2factor.in/API/V1/${apiKey}/SMS/${phoneNumber}/AUTOGEN3/${otpTemplateName}`;

  try {
      const response = await axios.get(sendOtpUrl);
      if (response.data.Status === 'Success') {
          res.status(200).json({
              message: 'OTP sent successfully',
              details: response.data
          });
      } else {
          res.status(500).json({ message: 'Failed to send OTP', error: response.data });
      }
  } catch (error) {
      res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
});

// Validate OTP
app.post('/api/v1/auth/validate-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
      return res.status(400).json({ message: 'Phone number and OTP are required' });
  }

  const validateOtpUrl = `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY3/${phoneNumber}/${otp}`;

  try {
      const response = await axios.get(validateOtpUrl);
      if (response.data.Status === 'Success') {
          res.status(200).json({
              message: 'OTP validated successfully',
              details: response.data
          });
      } else {
          res.status(400).json({ message: 'Invalid OTP', error: response.data });
      }
  } catch (error) {
      res.status(500).json({ message: 'Error validating OTP', error: error.message });
  }
});




  


const PORT = 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
