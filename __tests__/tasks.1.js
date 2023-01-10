const puppeteer = require("puppeteer");
const path = require('path');

const browserOptions = {
    headless: true,
    ignoreHTTPSErrors: true,
    defaultViewport: null,
    devtools: false,
}
let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch(browserOptions);
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
}, 30000);

afterAll((done) => {
    try { 
        this.puppeteer.close(); 
    } catch (e) 
    {} 
    done();
});

describe("Content", () => {
    it('Card image is used', async () => {
        try {
            const img = await page.$eval('img', el => el.src);
            expect(img).toMatch(/\.(png|jpg|gif)$/);
        } catch (error) {
            throw error
        }
    });
    it('Name and Last name are present', async () => {
        try {
            const name = await page.$eval('body', el => el.textContent);
            expect(name).toMatch(/[a-zA-Z]/);
        } catch (error) {
            throw error
        }
    });
});
describe("Styling", () => {
    it('The card is centered on the page', async () => {
        const card = await page.$('img');
        const cardPosition = await card.boundingBox();
        const pageWidth = await page.evaluate(() => document.body.clientWidth);
        const cardWidth = cardPosition.width;
        const cardLeft = cardPosition.x;
        const middleOfPageVertical = pageWidth / 2;
        const middleOfCardLeft = cardLeft + (cardWidth / 2);
        expect(middleOfCardLeft-middleOfPageVertical).toBeLessThan(30); // 30 is the margin of error allowed for the test to pass, you can change it to whatever you want, The correct value is 0
    });
    it('The card has a white border', async () => {
        const whiteBorder = await page.evaluate(() => {
            const card = Array.from(document.querySelectorAll('*')).filter(el => window.getComputedStyle(el).borderColor === 'rgb(255, 255, 255)');
            return card
            });
            expect(whiteBorder.length).toBeGreaterThan(0);
    });
    it('First name and last name have a border-radius', async () => {
        const borderRadius = await page.evaluate(() => {
            const name = Array.from(document.querySelectorAll('*')).filter(el => window.getComputedStyle(el).borderRadius !== '0px');
            return name
            });
            expect(borderRadius.length).toBeGreaterThan(0);
    });
    it('First and Last name go over the edge of the card', async () => {
        //get image position
        const cardPosition = await page.evaluate(() => {
            const card = document.querySelector('img');
            const cardPosition = card.getBoundingClientRect();
            // return cardPosition left and width
            return {
                right: cardPosition.right,
                width: cardPosition.width
            }
        });
        //get first name position
        const firstNamePosition = await page.evaluate(() => {
            // get the element containing text
            const firstName = Array.from(document.querySelectorAll('*')).filter(el => window.getComputedStyle(el).borderRadius !== '0px')[0];
            // get the position of the element
            const firstNamePosition = firstName.getBoundingClientRect();
            
            return {
                left: firstNamePosition.left,
                right: firstNamePosition.right
            }
        });
        expect(firstNamePosition.right).toBeGreaterThan(cardPosition.right);
        expect(firstNamePosition.left).toBeLessThan(cardPosition.right);
    });
   
});
