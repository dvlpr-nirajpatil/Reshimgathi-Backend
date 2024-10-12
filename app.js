// Import the required modules
const express = require('express');
const useragent = require('express-useragent');
const path = require('path');

// Create an Express application
const app = express();

// Use the useragent middleware to parse user-agent headers
app.use(useragent.express());

// Route for the root URL "/"
app.get('/', (req, res) => {
  const source = req.useragent;

  // Check if the user is on an Android device
  if (source.isAndroid) {
    return res.redirect('https://play.google.com/store/apps/details?id=dev.probity.reshimgathi&pcampaignid=web_share');
  }

  // Check if the user is on an iOS device
  if (source.isiPhone || source.isiPad || source.isiPod) {
    return res.redirect('https://apps.apple.com/in/app/race-master-3d-car-racing/id1579072162');
  }

  // Default message for non-Android, non-iOS devices
  res.send('Welcome to our website! Please visit the store links on your mobile device.');
});

// Route to serve the assetlinks.json file
app.get('/.well-known/assetlinks.json', (req, res) => {
  const filePath = path.join(__dirname, 'assetlinks.json');
  res.sendFile(filePath);
});



app.get('/profile/:id', (req, res) => {
    const source = req.useragent;
    const profileId = req.params.id;
  

    console.log(`User visited profile with ID: ${profileId}`);
  
    // Check if the user is on an Android device
    if (source.isAndroid) {
      return res.redirect('https://play.google.com/store/apps/details?id=dev.probity.reshimgathi&pcampaignid=web_share');
    }
  
    // Check if the user is on an iOS device
    if (source.isiPhone || source.isiPad || source.isiPod) {
      return res.redirect('https://apps.apple.com/in/app/race-master-3d-car-racing/id1579072162');
    }
  
    // Default message for non-Android, non-iOS devices
    res.send(`Welcome to profile ${profileId}! Please visit the store links on your mobile device.`);
  });
  
  

// Define the port number
const PORT = 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
