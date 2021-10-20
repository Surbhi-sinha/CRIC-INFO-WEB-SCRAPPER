const URL = 'https://www.espncricinfo.com/series/ipl-2021-1249214';
const cheerio = require('cheerio');
const request = require('postman-request');
const AllmatchesObj = require('./allMatch');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');


const pathname = path.join( __dirname, "IPL")
dirCreator(pathname);


request(URL, cb);
function cb(error, response, html) {
    if (error) {
        console.log('an error has occured.');
    } else {
        extratcALLMATCHpageLink(html);
    }
}

function extratcALLMATCHpageLink(html) {
    const $ = cheerio.load(html);
    const allResultLink = $(".widget-items.cta-link").find("a").attr("href");
    const fullLinkToResultPage = "https://www.espncricinfo.com"+allResultLink;
    // console.log(fullLinkToResultPage); for checking that we get the right link 
    AllmatchesObj.extractAllMatch(fullLinkToResultPage);
}



function dirCreator(filepath){
    if(fs.existsSync(filepath) == false){
        fs.mkdirSync(filepath)
    }
}
