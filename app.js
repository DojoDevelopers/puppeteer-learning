const puppeteer = require('puppeteer');
const pf = require('fs');


let contents = null;


pf.readFile('pf.json', 'utf8', function(err, contents) {
(async () => {
  const browser = await puppeteer.launch({headless: false});
			const page = await browser.newPage();
	const cookie = {
		name: 'showNewsLetterThisSession',
		value: 'false',
		url: 'https://alice-stg02.mobly.com.br'
	};
	await page.setCookie(cookie);

	await page.goto('https://alice-stg02.mobly.com.br');
	

	//await page.goto('https://www.mobly.com.br');

	// await page.waitForSelector('my-account');
	await page.waitFor(2000);

	await page.click('.login-ajax');

	await page.click('#registration');

	if (content.type == 'input') {
		await page.focus(contents.target)
	await page.type(content.target, content.value);
	} else {
		await page.select(content.target, content.value);
	}
	
})();
	});	


	//await page.click("#radioTypeCompany");
	//await page.click("#RegistrationForm_state_tax_number_free");
	
//	await page.type("#RegistrationForm_legal_name", 'Legal name');
//	await page.type("#RegistrationForm_fantasy_name", 'Legal name');
//	await page.type(".company-email", 'emai@a.com');
//	await page.type("#RegistrationForm_password", '123456');
//	await page.type("#RegistrationForm_password2", '123456');
//	
//	await page.focus('#RegistrationForm_company_tax_identification');
//	await page.type("#RegistrationForm_company_tax_identification","00000000000191");
//	await page.select("#RegistrationForm_fk_customer_address_region", '41');
//	await page.select("#RegistrationForm_fk_customer_segment", '13');



	// await browser.close();

