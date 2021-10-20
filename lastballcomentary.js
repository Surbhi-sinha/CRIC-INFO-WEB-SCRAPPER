const request = require('postman-request');
const cheerio = require('cheerio');

const URL = 'https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/ball-by-ball-commentary'
request(URL , (error,response , html)=> {
    if(error){
        console.log(error);
    }else{
        HTMLextracter(html);
    }
})

function HTMLextracter(html) {
    const seltool = cheerio.load(html);
    let containerarr = seltool('.match-comment-wrapper .match-comment-long-text p');
    let data = seltool(containerarr[0]).text();
    console.log(data);
}