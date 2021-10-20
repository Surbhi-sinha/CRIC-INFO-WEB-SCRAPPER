// const URL= "https://www.espncricinfo.com/series/ipl-2021-1249214/mumbai-indians-vs-chennai-super-kings-27th-match-1254084/full-scorecard"

const request = require('postman-request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

function processScoreCard(URL){

    request(URL , cb);
}
function cb(error , response , html){
    if(error){
        console.log('an error has occured.');
    }else{
        extractDetails(html);
    }
}

function extractDetails(html){
    const $ = cheerio.load(html);
    // common for both the teams :- RESULT , VENUE , DATE  
    
    const description = $('.header-info .description');
    const descriptionarr = description.text().split(",");
    const venue = descriptionarr[1].trim();
    const date = descriptionarr[2].trim();
    const status = $(".event .status-text"); 
    const result = status.text();
    console.log(venue);
    console.log(date);
    console.log(result);
    
    const innings = $(".card.content-block.match-scorecard-table .Collapsible");
    let teamname="";
    let opponentName="";
    for(let i = 0 ; i < innings.length ; i++){
       teamname = $(innings[i]).find("h5").text()
       teamname = teamname.split("INNINGS")[0].trim();
       teamname = teamname[0];
       let opponentidx = i==0?1:0;
       opponentName = $(innings[opponentidx]).find("h5").text()
       opponentName= opponentName.split("INNINGS")[0].trim();
       
       let cInnings = $(innings[i]);
       const allRows = cInnings.find(".table.batsman tbody tr");
       for(let j = 0 ; j< allRows.length ; j++){
           let allCols = $(allRows[j]).find("td");
           let isworthy = $(allCols[0]).hasClass("batsman-cell");
           if(isworthy == true){
            //    player balls runs 4s 6s SR
            let playerName = $(allCols[0]).text().trim();
            let balls = $(allCols[2]).text().trim();
            let runs = $(allCols[3]).text().trim();
            let four = $(allCols[5]).text().trim();
            let six = $(allCols[6]).text().trim();
            let SR  = $(allCols[7]).text().trim();
            // console.log(`TEAMNAME : ${teamname} and OPPONENT NAME : ${opponentName} playername : ${playerName} balls: ${balls} runs : ${runs} four : ${four} six : ${six} SR : ${SR}` )
            processPlayer(teamname , opponentName , playerName,venue , date , balls , runs , four , six , SR );
            }
       }
    }
}

function processPlayer(teamname , opponentName , playerName,venue , date , balls , runs , four , six , SR ){
    let teamPath = path.join(__dirname , "ipl" , teamname);
    dirCreator(teamPath);
    let filepath = path.join(teamPath, playerName+".xlsx");
    let content = excelReader(filepath , playerName);
    let playerObj ={
        "teamname":teamname,
        "playerName" : playerName,
        "opponentName": opponentName,
        "venue" : venue,
        "date": date,
        "balls": balls,
        "runs": runs,
        "four":four,
        "six": six,
        "SR" : SR
    }
    content.push(playerObj);
    excelWriter(filepath , content , playerName);

}
function dirCreator(filepath){
    if(fs.existsSync(filepath) == false){
        fs.mkdirSync(filepath)
    }
}
function excelWriter(filepath , jsonData , sheetName){
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(jsonData);
    xlsx.utils.book_append_sheet(newWB , newWS , sheetName);
    xlsx.writeFile(newWB , filepath);
}

function excelReader (filepath , sheetName){
    if(fs.existsSync(filepath) == false){
        return [];
    }
    let WB = xlsx.readFile(filepath);
    let excelData = WB.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;

}
module.exports = {
    processScoreCard : processScoreCard
}