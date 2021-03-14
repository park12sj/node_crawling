
const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify/lib/sync')
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const csv = fs.readFileSync('csv/data.csv');
const records = parse(csv.toString('utf-8'));

fs.readdir('poster', err => {
    if(err){
        console.log('폴더가 없어 생성합니다.')
        fs.mkdirSync('poster')
    }
});

fs.readdir('screenshot', err => {
    if(err){
        console.log('폴더가 없어 생성합니다.')
        fs.mkdirSync('screenshot')
    }
});

const crawler = async()=>{
    try{
        const end = [];
        const browser = await puppeteer.launch({
            headless:false,
            args: ['--window-size=1920,1080']
        });
        // await Promise.all(records.map(async (r,i)=>{
        const page = await browser.newPage();
        await page.setViewport({
            width:1920,
            height:1080
        });
        for (const[i,r] of records.entries()){
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36');
            await page.goto(r[1]);
            // const scoreEL = await page.$('.score.score_left .star_score');
            // if(scoreEL){
            //     const text = await page.evaluate(tag => tag.textContent, scoreEL);
            //     console.log(r[0], '평점', text.trim());
            //     result[i] = ([r[0],r[1],text.trim()]);
            // } 
            const result = await page.evaluate(() => {
                const scoreEL = document.querySelector('.score.score_left .star_score');
                let score = '';
                if(scoreEL){
                    score = scoreEL.textContent
                }
                const imgEL = document.querySelector('.poster img');
                let img =  '';
                if(imgEL){
                    img = imgEL.src;
                }
                return {score, img}
            });

            if(result.score){
                console.log(r[0], '평점', result.score.trim());
                end[i] = ([r[0],r[1], result.score.trim()]);
            };
            if(result.img){
                await page.screenshot({
                    path:`screenshot/${r[0]}.png`,
                    fullPage:true,
                    // clip:{
                    //     x:100,
                    //     y:100,
                    //     width:300,
                    //     height:300
                    // }
                });
                const imgResult = await axios.get(result.img.replace(/\?.*$/, ''), {
                    responseType:'arraybuffer'
                });
                fs.writeFileSync(`poster/${r[0]}.jpg`,imgResult.data);
            };

            await page.waitForTimeout(1000);
        };   
        await page.close();
        await browser.close();
        const str = stringify(end);
        fs.writeFileSync('csv/result.csv', str)
    } catch(e){
        console.log(e)
    }


    // for (const [i,r] of records.entries()){
    //     const response = await axios.get(r[1]);
    //     if (response.status===200){
    //         const html = response.data;
    //         const $ = cheerio.load(html);
    //         const score = $('.score.score_left .star_score').text();
    //         console.log(r[0],'평점: ', score.trim());
    //     }
    // }


    // await Promise.all(records.map(async (r) => {
    //     const response = await axios.get(r[1]);
    //     if (response.status===200){
    //         const html = response.data;
    //         const $ = cheerio.load(html);
    //         const score = $('.score.score_left .star_score').text();
    //         console.log(r[0],'평점: ', score.trim());
    //     }
    // }));
};

crawler();

