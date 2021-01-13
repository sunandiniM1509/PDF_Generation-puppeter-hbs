const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const data = require('./database.json');
const hbs = require("handlebars")
const path = require("path");
const moment = require("moment");

const compile =async function(templateName,data){

    const filePath = path.join(process.cwd(),'src', 'templates', `${templateName}.hbs`);
    const html = await fs.readFile(filePath,'utf-8');
    return hbs.compile(html)(data);
};

hbs.registerHelper('dateFormat',function(value,format){
    console.log(value,format)
    return moment(value).format(format);
});

(async function(){
    try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const content = await compile('table',data);
        await page.setContent(content);
        await page.emulateMediaType('screen');
        await page.pdf({
            path:'mypdf.pdf',
            format:'A4',
            printBackground:true
        });

        console.log('done');
        await browser.close();
        process.exit();
    }
    catch(e){
        console.log("error is",e)
    }
})();