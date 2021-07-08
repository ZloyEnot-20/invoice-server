const puppeteer = require('puppeteer');
const PuppeteerVideoRecorder = require('puppeteer-video-recorder');
const chalk = require('chalk');
const log = console.log;
const recorder = new PuppeteerVideoRecorder();

const express = require('express');
const app = express();
const server = require('http').Server(app);
const cors = require('cors');
app.use(cors());
app.use(express.json());

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function getCmInfo(id) {
  log(chalk.blue('Server: ') + chalk.green('started'));
  // Informing that we started

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disabled-setupid-sandbox"],
  });
  const page = await browser.newPage();
  // await recorder.init(page, 'video');
  // Making navigation time equal to 0
  page.setDefaultNavigationTimeout(0);

  //Going to omni/stax page
  await page.goto('https://www.jtracker.com/', {
    waitUntil: 'networkidle2',
  });
  //await page.screenshot({ path: 'jtracker.png', fullPage: true });
  await page.type('#username', 'Justin.uzbeks');
  await page.type('#password', 'Userudt34@');
  await page.click('[value="Login"]');
  log(chalk.blue('Stage: ') + chalk.green('2'));

  await page.waitForSelector('#primaryNav > ul > li:nth-child(4)');
 // await page.screenshot({ path: 'finish.png', fullPage: true });
  await page.click('#primaryNav > ul > li:nth-child(4)');
  log(chalk.blue('Stage: ') + chalk.green('3'));
 // await page.screenshot({ path: 'order.png', fullPage: true });
  await page.waitForSelector('.fstyle');
  await page.evaluate('document.querySelector(".fstyle").value = 0');
  await page.waitForSelector('form:nth-child(1)');
  log(chalk.blue('Stage: ') + chalk.green('4'));
  await page.evaluate('document.querySelector("form:nth-child(1)").submit()');
  delay(3000);
  // await page.click('[value="0"]');
  await page.waitForSelector('#srch');
  await page.type('#srch', id);
  await page.click('[value="Search"]');
  log(chalk.blue('Stage: ') + chalk.green('5'));
  await page.waitForSelector('.id > a');
 // await page.screenshot({ path: 'srch.png', fullPage: true });
  await page.click('.id > a');
  await page.waitForSelector('.tab:nth-child(2)');
  await page.click('.tab:nth-child(2)');

  log(chalk.blue('Stage: ') + chalk.green('6'));
  await page.waitForSelector('#first_name');

  const data = await page.evaluate(() => {
    const name = document.querySelector('#first_name').value;
    const surname = document.querySelector('#last_name').value;
    const email = document.querySelector('#email').value;
    const phone = document.querySelector('#phone').value;
    const price = document.querySelector('#deposit_required1').value;
    const car =
      document.querySelector('#year1').value +
      ' ' +
      document.querySelector('#make1').value +
      ' ' +
      document.querySelector('#model1').value;
    return {
      name,
      surname,
      email,
      phone,
      price,
      car,
    };
  });
  log(chalk.blue('Process: ') + chalk.green('Done'));
  return data;
}

function getInvoice(name, surname, email, phone, price, car, id) {
  try {
    (async () => {
      let startTIme = Date.now();
      log(chalk.blue('Server: ') + chalk.green('started'));
      // Informing that we started
      log(name, surname, email, phone, price, car, id);
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await recorder.init(page, 'video');
      // Making navigation time equal to 0
      page.setDefaultNavigationTimeout(0);

      //Going to omni/stax page
      await page.goto('https://paywithomni.com/', {
        waitUntil: 'networkidle2',
      });

      //Making a screenshot that we visit a page
      await page.screenshot({ path: 'main.png', fullPage: true });
      await recorder.start();
      //Starting authorization
      await page.type('[name="email"]', 'John@udtransportation.com');
      await page.type('[name="password"]', 'User30udt$');
      await page.click('[name="submit"]');

      //Logging that authorization went ok
      log(chalk.blue('Stage-login: ') + chalk.green('Passed'));
      //Filling the invoice
      delay(1000);
      //Waiting till all selectors will be available
      await page.waitForSelector('[name="payment.meta.lineItems[0].price"]');
      //Invoice's price
      log('Error here1');
      await page.type('[name="payment.meta.lineItems[0].price"]', `${price}`);

      //Type of vehicle
      await page.type('.ant-input', `${car}`);

      //Reference ID
      await page.type('[name="payment.meta.reference"]', `${id}`);
      log('Error here2');
      // Calculating a tax
      await page.type(
        '.-right > .ant-input-lg',
        `${(Number(price) / 100) * 3.5}`
      );
      log('Error here3');
      //Making tips available
      await page.click('#isTipEnabled');

      //Turning off partial payments
      await page.click('#isPartialPaymentEnabled');

      //Logging that all fields are filled
      log(chalk.blue('Stage-info: ') + chalk.green('Passed'));
      delay(2000);
      //Going to the next page
      await page.click('#payment-details-page-continue-step-one-button');
      await page.screenshot({ path: 'customer.png', fullPage: true });
      //Waiting till button is available
      await delay(1000);

      //Pressing a button to add new customer
      await page.click('.ui-heading > .bsKpOF');
      await delay(1000);

      //Typing customer's name
      await page.type('#customer-first-name-input-field', `${name}`);
      await delay(1000);

      //Typing customer's surname
      await page.type('#customer-last-name-input-field', `${surname}`);

      //Typing customer's email address
      await page.type('#customer-email-input-field', `${email}`);

      //Typing customer's phone number
      await page.type('#customer-phone-input-field', `${phone}`);
      // await page.screenshot({ path: 'info.png', fullPage: true });
      delay(2000);
      //Logging that everything went ok
      log(chalk.blue('Stage-cm: ') + chalk.green('Passed'));

      //Saving our customer
      await page.click('#new-customer-save-button');
      await delay(2000);

      //Creating an invoice
      // await page.waitForSelector('#invoice-method-button');
      await page.click('#invoice-method-button');
      await delay(5000);
      await page.waitForSelector(
        '.invoice-actions-component__StyledBrandedInlineAction-sc-1gxs3ug-1'
      );
      //Sending invoice to customer
      await page.click(
        '.invoice-actions-component__StyledBrandedInlineAction-sc-1gxs3ug-1'
      );

      await page.screenshot({ path: 'send.png', fullPage: true });
      //Tophone number
      await page.click('.ant-dropdown-menu-vertical > li:nth-child(2)');
      log(chalk.blue('Message: ') + chalk.green('Sent...'));
      delay(5000);
      await page.click('.hUGtQN');

      //Waiting for message to be sent

      delay(5000);
      await page.waitForFunction(
        'document.querySelector(".ieLXtJ").getAttribute("disabled") == null'
      );
      await page.click(
        '.invoice-actions-component__StyledBrandedInlineAction-sc-1gxs3ug-1'
      );
      await page.screenshot({ path: 'phone.png', fullPage: true });

      //To  email address
      await page.click('.ant-dropdown-menu-vertical > li:nth-child(1)');
      delay(2000);
      log(Date.now() - startTIme);
      await page.screenshot({ path: 'in.png', fullPage: true });

      //Logging that almost finished
      log(chalk.blue('Email: ') + chalk.green('Sent...'));
      await page.screenshot({ path: 'invoice.png', fullPage: true });
      log(chalk.blue('Process: ') + chalk.green('Done...'));
      await recorder.stop();
      await browser.close();
    })();
  } catch (error) {
    console.log('You made a mistake');
    browser.close();
  }
}
let data = {};

app.get('/invoice', async (req, res) => {
  try {
    const { order_id: orderId } = req.body;
    //const { car, id, price, name, surname, email, phone } = req.body;
    console.log(orderId);
    data = { ...(await getCmInfo(orderId)), id: orderId };
    // getInvoice(car, id, price, name, surname, email, phone);

    res.send('success');
  } catch (err) {
    console.log(err);
    res.send('Error: ' + err);
  }
});

app.get('/getInv', async (req, res) => {
  const { name, surname, email, phone, price, car, id } = data;
  getInvoice(name, surname, email, phone, price, car, id);
  res.json();
});

app.get('/test', (req, res) => {
 
  res.send('ga gaa');
});

server.listen(process.env.PORT || 8000, (err) => {
  if (err) {
    throw Error(err, 'ERRRA');
  }
  console.log('Server started');
});
