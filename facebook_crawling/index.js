const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config();

const crawler = async () => {
    try{
        const browser = await puppeteer.launch({headless:false, args:['--window-size=1920,1080']});
        const page = await browser.newPage();
        await page.setViewport({
            width:1080,
            height:1080
        })
        await page.goto('https://facebook.com');
        const id = process.env.EMAIL;
        const password = process.env.PASSWORD;
        // await page.evaluate((id,password)=>{
        //     document.querySelector('#email').value = id;
        //     document.querySelector('#pass').value = password;
        //     document.querySelector('._6ltg button').click();
        // })
        await page.type('#email', id);
        await page.type('#pass', password)
        await page.hover('._6ltg button');
        page.waitForTimeout(1000);
        await page.click('._6ltg button');
        // await page.click('.s45kf179');
        page.waitForTimeout(6000);
        // await page.click('.iqfcb0g7');
        await page.click('.s45kf179');

    }catch(e){
        console.log(e);
    }
};

crawler();