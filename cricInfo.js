// const request = require('request')
const request = require('postman-request');
const cheerio = require('cheerio');

request('https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard', (error, response, html) => {
    if(error){
        console.log('error:', error); // Print the error if one occurred
    }else{
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('html: ', html); // Print the HTML for the Google homepage.
        htmlhandler (html);
    }
});

function htmlhandler(html){
    let seltool = cheerio.load(html);
    let containerarr = seltool('div .playerofthematch-content .playerofthematch-name');
    for(let i = 0 ; i < containerarr.length ; i++){
        let data = seltool(containerarr[i]).text();
        console.log('data: ' , data);
    }
    // console.log(seltool(containerarr).text());
}