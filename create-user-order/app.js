const puppeteer = require('puppeteer');
const pf = require('./config.js');


let url = 'https://mobly.com.br';

(async () => {
        const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox']});
        const page = await browser.newPage();
        await page.setViewport({width: 1024, height: 768})
        const cookie = {
            name: 'showNewsLetterThisSession',
            value: 'false',
            url: config.url
        };
        await page.setCookie(cookie);

        await page.goto(config.url);

        await page.waitForFunction('typeof auth == "object"');

        await page.click('.login-ajax');

        await page.click('#registration');
    
        for (let keyPerson in config.people) {
            let person = config.people[keyPerson];
            
            
            if (person.type == 'input') {
                await page.focus(person.target)
                await page.type(person.target, person.value);
            } else {
                await page.select(person.target, person.value);
            }
                   
        }

        await page.click('#send');

        await page.waitFor(2000);

        let productsData = await searchFor('sofa', page)
        productsData = productsData.sort( comparePrices )
        console.log('ordered by price    ===> OK');
        await addToCart(productsData[0], page)

        //await page.goto(config.url)
        //productsData = await searchFor('cama', page)
        //productsData = productsData.sort( comparePrices )
        //console.log('ordered by price    ===> OK');
        //await addToCart(productsData[0], page)

        //await page.screenshot({path: 'result.png'});
        await page.goto(config.url + "/cart");

        await page.click('.sel-cart-checkout-button');

        await page.waitForFunction('typeof checkoutCustomer == "object"');
        for (let keyCheckout in config.checkout) {
            let checkout = config.checkout[keyCheckout];
            await page.focus(checkout.target)
            await page.type(checkout.target,checkout.value);
                   
        }
        //await page.waitForSelector('.sel-checkout-send', {visible: true})
        await page.waitFor(4000);
        await page.click('.sel-checkout-send')
        await page.screenshot({path: 'orderFinish.png'});





        })();


function comparePrices( a, b ) {
    if ( a.last_nom < b.last_nom ){
        return -1;
    }
    if ( a.last_nom > b.last_nom ){
        return 1;
    }
    return 0;
}

async function addToCart(element, page) {
    await page.goto(element.url)
    console.log(element.url + '    ===> OK');

    await page.waitForFunction('!document.querySelector(".sel-cart-add-button").disabled')
    await page.click('.bt-buy')
    console.log('buyed    ===> OK');

    await page.waitForSelector('a.close-keep-buying', {visible: true})
    console.log('Closed Modal    ===> OK');
}

async function searchFor(term, page) {
    let productsData = [];
    await page.waitForSelector('#searchInput', {visible: true})
    await page.focus('#searchInput')
    await page.type('#searchInput', term)
    await page.click('#search-button')
    console.log('starting search by ' + term + '    ===> OK');

    await page.waitForSelector('.sel-catalog-product-list-item')
    console.log('results by ' + term + '    ===> OK');

    let products = await page.$$('.sel-catalog-product-list-item')
    console.log('found ' + products.length + '    ===> OK');

    for (let i = 0; i < products.length; i++) {
        let a = await products[i].$$eval('div .itm-link', nodes => nodes.map(n => n.href))
        let price = await products[i].$$eval('div .itm-price-current', nodes => nodes.map(n => n.innerText))
        productsData.push({url: a[0], price: parseFloat(price[0].replace(',', '.'), 2)});
    }
    return productsData;
}
