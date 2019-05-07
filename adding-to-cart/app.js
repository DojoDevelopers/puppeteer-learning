const puppeteer = require('puppeteer');

let contents = null;
let url = "https://www.mobly.com.br"

const cookie = {
	name: 'showNewsLetterThisSession',
	value: 'false',
	url: url
};

console.log('Starting...');

(async () => {
	// const browser = await puppeteer.launch();
	const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox']});
	const page = await browser.newPage();
	await page.setCookie(cookie);
	await page.goto(url);

	await page.waitForSelector('#searchInput');
	
	await page.focus('#searchInput');
	await page.type('#searchInput', 'sofa');
	await page.click('#search-button');

	await page.waitFor(2000);
	await page.waitForSelector('.sel-catalog-product-list-item')

	let productClass = await page.$('.sel-catalog-product-list-item')
	let a = await productClass.$$eval('div .itm-link', nodes => nodes.map(n => n.href));
	let price = await productClass.$$eval('div .itm-price-current', nodes => nodes.map(n => n.innerText));


	await page.goto(a[0]);
	await page.waitForFunction('!document.querySelector(".sel-cart-add-button").disabled')

	await page.click('.bt-buy');
	await page.waitForSelector('a.close-keep-buying');
	await page.waitFor(3000);
	await page.click('a.close-keep-buying');
	await page.focus('#searchInput');
	await page.type('#searchInput', 'cadeira');
	await page.click('#search-button');

	await page.waitFor(2000);
	await page.waitForSelector('.sel-catalog-product-list-item')

	productClass = await page.$('.sel-catalog-product-list-item')
	a = await productClass.$$eval('div .itm-link', nodes => nodes.map(n => n.href));
	price = await productClass.$$eval('div .itm-price-current', nodes => nodes.map(n => n.innerText));


	await page.goto(a[0]);
	await page.waitForFunction('!document.querySelector(".sel-cart-add-button").disabled')

	await page.click('.bt-buy');

})();


//  await page.click("#radioTypeCompany");
//  await page.click("#RegistrationForm_state_tax_number_free");
	
//	await page.type("#RegistrationForm_legal_name", 'Legal name');
//	await page.type("#RegistrationForm_fantasy_name", 'Legal name');
//	await page.type(".company-email", 'emai@a.com');
//	await page.type("#RegistrationForm_password", '123456');
//	await page.type("#RegistrationForm_password2", '123456');
//	
//	await page.type("#RegistrationForm_company_tax_identification","00000000000191");
//	await page.select("#RegistrationForm_fk_customer_address_region", '41');
//	await page.select("#RegistrationForm_fk_customer_segment", '13');
