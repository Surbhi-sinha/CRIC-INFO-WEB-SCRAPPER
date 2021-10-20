const URL = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";
const request = require('postman-request');
const cheerio = require('cheerio');

console.log("before")
request(URL , (error,response , html)=> {
    if(error){
        console.log(error);
    }else{
        HTMLextracter(html);
    }
})
let winteamelem;
function HTMLextracter(html){
    let $ = cheerio.load(html);
    let teamsarr = $(".match-info.match-info-MATCH.match-info-MATCH-half-width .team");
    for(let i = 0 ; i < teamsarr.length ; i++){
        let hasclass = $(teamsarr[i]).hasClass("team-gray");
        if(hasclass == false){
            let teamnameElem= $(teamsarr[i]).find(".name");
            winteamelem = teamnameElem.text().trim();
        }
    }
    

    let inningsArr = $(".card.content-block.match-scorecard-table>.Collapsible");
    for(let i = 0 ; i < inningsArr.length ; i++){

        let teamelem = $(inningsArr[i]).find('.header-title.label');
        let teamname = teamelem.text();
        teamname = teamname.split("INNINGS")[0];
        teamname = teamname.trim();
        

        let mwkplayer ="";
        let maxwic = 0;
        if(winteamelem == teamname){
            // console.log(winteamelem);
            let tableelem = $(inningsArr[i]).find(".table.bowler");
            let allbowler = $(tableelem).find("tr");
            for(let j = 0  ; j < allbowler.length ; j++){
                let allColsOfBowlers = $(allbowler[j]).find("td");
                let playername = $(allColsOfBowlers[0]).text();
                let wicket = $(allColsOfBowlers[4]).text();
                if(wicket >= maxwic){
                    mwkplayer = playername;
                    maxwic = wicket;
                }
            }

            console.log(`winning team : ${teamname} max wicket taker player name : ${mwkplayer} max wicket taken : ${maxwic}`);
        }
    }
    // console.log(htmlstr);
}