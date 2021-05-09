const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config();

const db = require('./models')

const crawler = async () => {
    try{
        await db.sequelize.sync();

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

        const result = []
        let prevPostId = '';
        while (result.length<10){
            const newPost = await page.evaluate(() => {
                const article = document.querySelector('article:first-child');
                if (!article){
                    return "continue"
                };
                const postId = article.querySelector('.c-Yi7') && article.querySelector('.c-Yi7').href.split('/').slice(-2,-1)[0];                let name = article.querySelector('a.sqdOP');
                if (name) {
                    name = name.textContent;
                } else {
                    name = '#';
                };
                const img = article.querySelectorAll('img')[0].src;
                const button = article.querySelector('[data-testid="post-comment-root"]').querySelectorAll('span')[1].querySelector('button')
                if (button) {button.click()};
                const content = article.querySelector('[data-testid="post-comment-root"]').querySelectorAll('span')[1].querySelector('span').textContent;

                
                const like = article.querySelectorAll('.wpO6b')[1];
                if (like.querySelector('[aria-label="좋아요"]')){
                    like.click()
                };
                
                return {
                    postId, name, img, content
                };    
            }); 
            if (newPost === "continue"){
                await page.evaluate(() => {
                    window.scrollBy(0,100);
                });
                continue;
            };
            if (newPost.postId !== prevPostId){ 
                if (!result.find((v) => v.postId === newPost.postId)){
                    const exist = await db.Instagram.findOne({where: { postId:newPost.postId}});
                    if (!exist){
                        result.push(newPost);
                    }            
                };
            };
            await page.waitForTimeout(1000);

            prevPostId = newPost.postId;
            
            await page.waitForTimeout(1000);
            await page.evaluate(() => {
                window.scrollBy(0,800);
            });
        }   
        console.log(result)
        await Promise.all(result.map((r) => {
            return db.Instagram.create({
                postId: r.postId,
                media: r.img,
                writer: r.name,
                content: r.content
            })
        }))
        console.log(result.length);

    }catch(e){
        console.log(e);
    }
};

crawler();