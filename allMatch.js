const cheerio = require('cheerio');
const request = require('postman-request');
const processSC = require('./ScoreCard');


function extractAllMatch(URL){
    request(URL , function (error , response, html) {
        if(error){
            console.log("an error has occured");
        }else{
            extractAllMatchScoreCard(html);
        }
    })
}

function extractAllMatchScoreCard(html){
    const $ = cheerio.load(html);
    const ScoreCardLink = $('a[data-hover="Scorecard"]');
    for(let i = 0 ; i < ScoreCardLink.length ; i++){
        const links = $(ScoreCardLink[i]).attr("href");
        // console.log(links); --just for checking that we are getting the links
        const fullScoreCardLinks = "https://www.espncricinfo.com" + links;
        processSC.processScoreCard(fullScoreCardLinks);
        // console.log(fullScoreCardLinks);
    }
}

module.exports = {
    extractAllMatch : extractAllMatch
}