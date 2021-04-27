const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config();

// const db = require('./models')

const crawler = async () => {
    try{
        // await db.sequelize.sync();

        const browser = await puppeteer.launch({headless:false, args:['--window-size=1920,1080', 'disable-notifications']});
        const page = await browser.newPage();
        await page.setViewport({
            width:1080,
            height:1080
        })
        await page.goto('https://instagram.com');
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
        // page.waitForResponse((response)=>{
        //     response.url().includes('login_attempt')
        // });
        
        page.waitForTimeout(3000);
        
        // //흰 화면 없애기
        // await page.waitForSelector('.iqfcb0g7 button');
        // await page.click('.iqfcb0g7 button');
        // page.waitForTimeout(1000);

        
        // await page.waitForSelector('div[aria-labelledby]');

        // let result = [];
        // while (result.length < 10){ //10개 post 크롤링
        //     const newPost = await page.evaluate(()=>{
        //         const firstFeed = document.querySelectorAll('div[aria-labelledby]')[0];
    
        //         // 첫번째 피드 작성자 이름, 작성 내용, 사진들
        //         const name = firstFeed.querySelectorAll('[id^=jsc_c]')[1].textContent;
        //         const content = firstFeed.querySelector('[data-ad-comet-preview]') && firstFeed.querySelector('[data-ad-comet-preview]').textContent;
        //         const imgList = firstFeed.querySelector('img.i09qtzwb') && [...firstFeed.querySelectorAll('img.i09qtzwb')].map(img => img.src);
        //         const img = firstFeed.querySelector('img.i09qtzwb') && firstFeed.querySelector('img.i09qtzwb').src;
    
        //         /*광고가 아니면 좋아요 누르기
        //         const sponsored = document.querySelectorAll('div[aria-labelledby]')[0]
        //             .textContent.includes('Sponsored');
        //         if (!sponsored){
        //             firstFeed.querySelector('div[aria-label=좋아요]').click()
        //         }
        //         */
    
        //         return {
        //             name, content, imgList, img
        //         }
        //     });

        //     result.push(newPost);
            
        //     await page.waitForTimeout(1000);
        //     await page.evaluate(()=>{
        //         const firstFeed = document.querySelectorAll('div[aria-labelledby]')[0];
        //         firstFeed.parentNode.removeChild(firstFeed);
        //     })
        //     await page.waitForTimeout(1000);
        // }   

        // // mysql에 저장
        // await Promise.all(result.map((p)=>{
        //     return db.Facebook.create({
        //         name : p.name,
        //         content : p.content,
        //         img : p.img
        //     });
        // }));


        // /* 로그 아웃 비활성화
        // //select 계정 button for click logout
        // await page.click('div[aria-label="계정"]')
        // page.waitForTimeout(2000);

        // //logout
        // await page.evaluate(()=>{
        //     document.querySelectorAll('div[aria-label="계정"] .a8nywdso .b20td4e0 .ow4ym5g4')[9].click();
        // })
        // */
        

    }catch(e){
        console.log(e);
    }
};

crawler();