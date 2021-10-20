const URL = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";
const request = require('postman-request');
const cheerio = require('cheerio');

console.log("before")
request(URL, (error, response, html) => {
    if (error) {
        console.log(error);
    } else {
        HTMLextracter(html);
    }
})
let winteamelem;
function HTMLextracter(html) {
    let $ = cheerio.load(html);
    let teamsarr = $(".match-info.match-info-MATCH.match-info-MATCH-half-width .team");
    for (let i = 0; i < teamsarr.length; i++) {
        let hasclass = $(teamsarr[i]).hasClass("team-gray");
        if (hasclass == false) {
            let teamnameElem = $(teamsarr[i]).find(".name");
            winteamelem = teamnameElem.text().trim();
        }
    }


    let inningsArr = $(".card.content-block.match-scorecard-table>.Collapsible");
    for (let i = 0; i < inningsArr.length; i++) {
        // team name
        let teamelem = $(inningsArr[i]).find('.header-title.label');
        let teamname = teamelem.text();
        teamname = teamname.split("INNINGS")[0];
        teamname = teamname.trim();

        // batsmen team
        let tableelem = $(inningsArr[i]).find(".table.batsman");
        let allbowler = $(tableelem).find("tr");
        for (let j = 0; j < allbowler.length; j++) {
            let allColsOfBowlers = $(allbowler[j]).find("td");
            let isBatsmenCol = $(allColsOfBowlers[0]).hasClass("batsman-cell");
            if(isBatsmenCol == true){
                let href = $(allColsOfBowlers[0]).find("a").attr("href");
                let name = $(allColsOfBowlers[0]).text();
                let fullLink = "https://www.espncricinfo.com"+href;
                
                getBirthdaypage(fullLink , name , teamname);
            }
        }
    }
}

function getBirthdaypage(url , name , teamname){
    request(url , (error , response  , html) =>{
        if(error){
            console.log(error);
        }else{
            extractBirthday(html , name , teamname);
        }
    })
}

function extractBirthday(html , name , teamname){
    let $ = cheerio.load(html);
    let details = $(".player-card-description");
    let birthday = $(details[1]).text();
    console.log(`team name : ${teamname} player name: ${name} was born on : ${birthday}`);
}