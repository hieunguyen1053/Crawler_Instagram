const puppeteer = require('puppeteer');
const scrollPageToBottom = require("puppeteer-autoscroll-down")
const downloader = require('image-downloader');
const fs = require('fs');

const getPosts = require("./util/getPostLinks");
const account = require('./private/account.json');

launch = async (link) => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: { width: 1280, height: 720 } });
    const page = await browser.newPage();
    // await login(page, account);
    await page.goto(link, { waitUntil: 'networkidle0' });
    await scrollPageToBottom(page, 250, 200);
    const posts = await getPosts(page);
    for (const post of posts) {
        const imgs = await getImgs(page, post);
        for (const img of imgs) {
            const largestImg = getLargestImg(img);
            downloader({
                url: largestImg,
                dest: './result'
            });
        }
    }
    await browser.close();
}

login = async (page, account) => {
    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'load' });

    await Promise.all([
        page.waitForSelector('input[name="username"]'),
        page.waitForSelector('input[name="password"]')
    ])
    await page.type('input[name="username"]', account.username);
    await page.type('input[name="password"]', account.password);
    await page.click('button[type="submit"]');
}

getLargestImg = (srcset) => {
    const splitedSrcs = srcset.split(',');
    return largestImg = splitedSrcs[splitedSrcs.length - 1].split(' ')[0];
}

getImgs = async (page, post) => {
    await page.goto('https://www.instagram.com' + post, { waitUntil: 'networkidle0' });
    return await page.evaluate(() => {
        let foo = document.querySelectorAll('.KL4Bh > img');
        foo = [...foo];
        let bar = foo.map(i => i.getAttribute('srcset'));
        return bar;
    });
}

launch('https://www.instagram.com/vxcthu/');