const puppeteer = require('puppeteer');

let contents = null
let url = "https://www.mobly.com.br"

const cookie = {
	name: 'showNewsLetterThisSession',
	value: 'false',
	url: url
};

console.log('Starting...');

(async () => {
	// const browser = await puppeteer.launch();
	const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox']})
	const page = await browser.newPage()
	await page.setViewport({ width: 1024, height: 768 })
	await page.setCookie(cookie)
	await page.goto(url)

	let productsData = await searchFor('sofa', page)
	productsData = productsData.sort( comparePrices )
	console.log('ordered by price    ===> OK');
	await addToCart(productsData[0], page)

	await page.goto(url)
	productsData = await searchFor('cadeira', page)
	productsData = productsData.sort( comparePrices )
	console.log('ordered by price    ===> OK');
	await addToCart(productsData[0], page)

	await page.screenshot({path: 'result.png'});
	console.log('Printing result    ===> OK');
	await browser.close();

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
	console.log('starting search by '+term+'    ===> OK');

	await page.waitForSelector('.sel-catalog-product-list-item')
	console.log('results by '+term+'    ===> OK');

	let products = await page.$$('.sel-catalog-product-list-item')
	console.log('found '+products.length+'    ===> OK');

	for (let i = 0; i < products.length; i++) {
		let a = await products[i].$$eval('div .itm-link', nodes => nodes.map(n => n.href))
		let price = await products[i].$$eval('div .itm-price-current', nodes => nodes.map(n => n.innerText))
		productsData.push( {url: a[0], price: parseFloat(price[0].replace(',','.'), 2) } );
	}
	return productsData;
}
