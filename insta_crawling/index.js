const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config();

// const db = require('./models')

const crawler = async () => {
    try{
        // await db.sequelize.sync();

        const browser = await puppeteer.launch({
            headless:false, 
            args:['--window-size=1920,1080', 'disable-notifications'],
            userDataDir: 'C:\Users\Tmax\AppData\Local\Google\Chrome\User Data'
        });
        const page = await browser.newPage();
        await page.setViewport({
            width:1080,
            height:1080
        })
        await page.goto('https://instagram.com');
        if (await page.$('a[href="/o00oooo0o/"]')) {
            console.log('이미 로그인 돼있습니다');
        } else {
            await page.waitForSelector('.coreSpriteFacebookIcon');
            await page.click('.coreSpriteFacebookIcon'); // 페이스북으로 로그인 버튼
            await page.waitForNavigation();
    
            const id = process.env.EMAIL;
            const password = process.env.PASSWORD;
    
            //login
            await page.type('#email', id);
            await page.type('#pass', password)
            await page.hover('#loginbutton');
            page.waitForTimeout(1000);
            await page.click('#loginbutton');
            await page.waitForNavigation();
            await page.waitForSelector('.aOOlW');
            await page.click('.aOOlW');
            console.log('로그인 완료');
        }
        
        page.waitForTimeout(3000);

        const newPost = await page.evaluate(() => {
            const article = document.querySelector('article:first-child');
            const postId = article.querySelector('.c-Yi7') && article.querySelector('.c-Yi7').href;
            const name = article.querySelector('a.FPmhX').title;
            const img = article.querySelectorAll('img')[0].src;
            const content = article.querySelector('[data-testid="post-comment-root"]').querySelectorAll('span')[1].querySelector('span').textContent;
            
            return {
                postId, name, img, content
            };
        });
        console.log(newPost);

    }catch(e){
        console.log(e);
    }
};

crawler();