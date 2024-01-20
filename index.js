const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// Port configuration
const portApp1 = 3000;
const portApp2 = 3001;

// Data file path
const dataFilePath = path.join(process.cwd(), 'data.json');

// Function to fetch public IP address
async function getPublicIpAddress() {
    try {
        const response = await axios.get('https://canyouseeme.org/');
        const $ = cheerio.load(response.data);
        const publicIp = $('#ip').attr('value');
        return publicIp || null;
    } catch (error) {
        console.error('Error fetching public IP address:', error.message);
        return null;
    }
}

// App 1 on port 3000
const app1 = express();
app1.use(express.static('public'));
app1.use(bodyParser.json());
app1.set('view engine', 'ejs');

app1.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app1.get('/create-sharing', (req, res) => {
    res.sendFile(__dirname + '/views/create-sharing.html');
});

app1.post('/create-sharing', async (req, res) => {
    // Fetch the public IP address
    const publicIp = await getPublicIpAddress();
    console.log('Public IP address:', publicIp);

    // Read existing data from the file
    let existingData = [];
    try {
        existingData = require(dataFilePath);
    } catch (error) {
        console.error('Error reading existing data:', error);
    }

    // Append new data with creation date and link
    const newData = {
        sharingName: req.body.sharingName,
        sharingDirectory: req.body.sharingDirectory,
        sharingPassword: req.body.sharingPassword,
        creationDate: new Date().toLocaleString()
    };

    existingData.push(newData);

    // Write the updated data back to the file
    fs.writeFile(dataFilePath, JSON.stringify(existingData, null, 2), (writeError) => {
        if (writeError) {
            console.error('Error writing data to file:', writeError);
            res.status(500).json({ message: 'Error saving data' });
        } else {
            console.log('Data saved successfully:', newData);

            // Send a success response with the alert message
            res.status(200).json({
                message: 'Sharing data received and saved successfully',
                alert: `Link to your shared files http://${publicIp}:${portApp2}/?sharingId=${existingData.length - 1}`
            });
        }
    });
});

app1.delete('/delete-sharing/:index', (req, res) => {
    const index = parseInt(req.params.index);

    if (isNaN(index)) {
        res.status(400).json({ success: false, message: 'Invalid sharing index' });
        return;
    }

    let existingData = [];
    try {
        existingData = require(dataFilePath);
    } catch (error) {
        console.error('Error reading existing data:', error);
        res.status(500).json({ success: false, message: 'Error reading data' });
        return;
    }

    if (index < 0 || index >= existingData.length) {
        res.status(404).json({ success: false, message: 'Sharing not found' });
        return;
    }

    // Remove the sharing at the specified index
    existingData.splice(index, 1);

    // Write the updated data back to the file
    fs.writeFile(dataFilePath, JSON.stringify(existingData, null, 2), (writeError) => {
        if (writeError) {
            console.error('Error writing data to file:', writeError);
            res.status(500).json({ success: false, message: 'Error saving data' });
        } else {
            console.log('Sharing deleted successfully:', index);
            res.json({ success: true, message: 'Sharing deleted successfully' });
        }
    });
});

app1.get('/explore-sharing', async (req, res) => {
    // Read existing data from the file
    let existingData = [];
    const publicIp = await getPublicIpAddress();
    try {
        existingData = require(dataFilePath);
    } catch (error) {
        console.error('Error reading existing data:', error);
    }

    // Render the explore-sharing.html page with the data
    res.render('explore-sharing', { sharingData: existingData, publicIp });
});

app1.listen(portApp1, '127.0.0.1', () => {
    console.log(`App1 is running on http://localhost:${portApp1}`);
});

// App 2 on port 3001
const app2 = express();
app2.use(express.static('images'));
app2.use(bodyParser.json());
app2.set('view engine', 'ejs');

// Read data from data.json
function readData() {
    try {
        const data = fs.readFileSync(dataFilePath);
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data from file:', error);
        return [];
    }
}

// Handle requests for exploring a sharing directory
app2.get('/', (req, res) => {
    const sharingId = parseInt(req.query.sharingId);
    const traveledPath = req.query.traveledPath || '';

    if (isNaN(sharingId)) {
        res.status(400).json({ message: 'Invalid sharing ID' });
        return;
    }

    const sharingData = readData();

    // Find the sharing with the given ID
    const selectedSharing = sharingData[sharingId];

    if (!selectedSharing) {
        res.status(404).json({ message: 'Sharing not found' });
        return;
    }

    // Build the full path to the requested directory
    const requestedPath = path.join(selectedSharing.sharingDirectory, traveledPath);

    try {
        // Read the content of the requested directory
        const directoryContent = fs.readdirSync(requestedPath);
        console.log(directoryContent);
        const extensionToImagePath = {
            "txt": "txt-icon.png",
            "pdf": "/pdf-icon.png",
            "jpg": "png-icon.png",
            "png": "png-icon.png",
            "gif": "png-icon.png",
            "bmp": "png-icon.png",
            "jpeg": "png-icon.png",
            "dll": "dll-icon.png",
            "exe": "exe-file.png",
            "default": "default-icon.png",
            "zip": "compressed-icon.png",
            "rar": "compressed-icon.png",
            "7z": "compressed-icon.png",
        };

        // Function to extract file extension from the file name
        function getFileExtension(fileName) {
            const dotIndex = fileName.lastIndexOf('.');
            return dotIndex !== -1 ? fileName.slice(dotIndex + 1).toLowerCase() : null;
        }

        // Enrich each file object in directoryContent with type and extension
        const enrichedDirectoryContent = directoryContent.map(fileName => {
            const extension = getFileExtension(fileName);
            const type = extension ? 'file' : 'folder';

            return {
                name: fileName,
                type,
                extension
            };
        });

        // Pass enrichedDirectoryContent to the EJS template
        res.render('browser', { directoryContent: enrichedDirectoryContent, extensionToImagePath, traveledPath, sharingId });

    } catch (error) {
        console.error('Error reading directory content:', error);
        res.status(500).json({ message: 'Error reading directory content' });
    }
});
// Add this route in your server code
app2.post('/check-password', (req, res) => {
    const sharingId = req.body["id"];
    const enteredPassword  = req.body["password"];

    // Perform password check logic here
    // Replace this with your actual password check logic
    const isPasswordCorrect = checkPassword(sharingId, enteredPassword);

    if (isPasswordCorrect) {
        res.json({ success: true, message: 'Password is correct.' });
    } else {
        res.json({ success: false, message: 'Incorrect password.' });
    }
});
// Handle file downloads
app2.get('/download', (req, res) => {
    const sharingId = parseInt(req.query.sharingId);
    const traveledPath = req.query.traveledPath || '';
    const fileName = req.query.fileName;

    const sharingData = readData();
    const selectedSharing = sharingData[sharingId];

    if (!selectedSharing) {
        res.status(404).json({ message: 'Sharing not found' });
        return;
    }

    const filePath = path.join(selectedSharing.sharingDirectory, traveledPath, fileName);

    // Send the file for download
    res.download(filePath, fileName, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).json({ message: 'Error sending file' });
        }
    });
});


function checkPassword(sharingId, enteredPassword) {
    // Read existing data from the file
    let existingData = [];
    try {
        existingData = require(dataFilePath);
    } catch (error) {
        console.error('Error reading existing data:', error);
        return false; // Return false if there's an error reading data
    }

    // Find the item in data.json with the matching sharingId
    const sharingItem = existingData[sharingId];
    console.log(sharingItem.sharingPassword == enteredPassword);
    if (sharingItem && sharingItem.sharingPassword == enteredPassword) {
        // Password is correct
        return true;
    } else {
        // Password is incorrect
        return false;
    }
}



app2.listen(portApp2, '0.0.0.0', () => {
    console.log(`App2 is running and accessible from other machines on http://<your_local_ip>:${portApp2}`);
});
