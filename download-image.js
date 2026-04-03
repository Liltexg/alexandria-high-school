
import axios from 'axios';
import fs from 'fs';
import path from 'path';

// The provided image URL
// Note: This URL seemed to fail with Invoke-WebRequest (404), which usually means it might need headers or the link is bad.
// However, I will try to fetch it again with axios, possibly handling redirects properly.
const imgUrl = "https://multimodal-artifacts-prod.s3.amazonaws.com/incoming-images/1739545710834-8c8e1462-877b-4029-a1b7-cd58bd85f69a.jpeg";
const outputPath = path.resolve('src/assets/school_front.jpg');

async function downloadImage() {
    try {
        const response = await axios({
            url: imgUrl,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Error downloading image:', error.message);
        // Fallback: create a dummy file if download fails so build doesn't crash?
        // No, better to know.
        process.exit(1);
    }
}

downloadImage().then(() => console.log('Image downloaded successfully.')).catch(console.error);
