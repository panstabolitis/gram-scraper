const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');

const downloadFile = async (url, filename) => {
    const response = await axios.get(url, { responseType: 'stream' });
    const writer = fs.createWriteStream(filename);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
};

const downloadInstagramMedia = async (url) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
  
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('div._aagv img', { timeout: 5000 });

    // Now, try to get the media
    const imageUrl = await page.evaluate(() => {
        const image = document.querySelector('div._aagv img');
        return image ? image.src : null;
    });

    if (imageUrl) {
        console.log('Image URL:', imageUrl);
        downloadFile(imageUrl, 'image.jpg');
    } else {
        console.log('Media not found!');
    }

    await browser.close();
};

const URL = "https://www.instagram.com/p/EXAMPLE/";
// Replace this URL with the actual Instagram post URL
downloadInstagramMedia(URL)
.catch(e => console.log(e));
