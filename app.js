
// GLOBAL VARIABLES 
var selectStation;
var selectedSataion;
var selectedLine;
var calSelect;
var selectOp;
var tttt;

var key = '845f49d51cc2832084befe2f183560099eed95cfe459c20acf25f0359b71fb47';

var dirDrop = document.getElementById('Direction');
var locationBtn = document.getElementById('location');
var op = document.getElementById('operator');
var lineList = document.getElementById('line');
var saveBtn = document.getElementById('save');
var modal = document.getElementById('modal');

var timeTable=[];
var withSemiColon=[];
var tTindex;
var colonIndex;
var nowHour;
var nowMin;
var nowSec;
var totalTime;
var dayCal;



// FUNCTIONS TO LISTEN FOR CHANGES IN THE MODAL AND GET SELECTIONS FROM THE DIDDERENT APIS

// LISTEN FOR OPRATOR SELECTION
op.addEventListener('change', function(e){
  operator = e.currentTarget.value;
  selectOp = operator;
  var lineUrl = `https://api-tokyochallenge.odpt.org/api/v4/odpt:Railway?odpt:operator=odpt.Operator:${operator}&acl:consumerKey=845f49d51cc2832084befe2f183560099eed95cfe459c20acf25f0359b71fb47`;
  getLineInfo(lineUrl);
});

// USE THE OPERATOR SELECTION TO GET LIST OF AVIALABLE LINES
function getLineInfo(lineUrl){
  var lnXhr = new XMLHttpRequest;
  lnXhr.open('GET',lineUrl,true);
  lnXhr.onload = function (){
    var lnParse = JSON.parse(this.responseText);
    var linesArray =[];
    for(var i = 0;i < lnParse.length;i++){
      var x =  lnParse[i]['odpt:railwayTitle'
      ]['en'];
      linesArray.push(x);
    }
    var ln = document.getElementById('line');
    ln.innerHTML="";
    linesArray.forEach(function(lines){
      var stOP =document.createElement('option');
      stOP.innerHTML=lines;
      ln.appendChild(stOP);
    });   
  }
  lnXhr.send();
}

// LISTEN FOR THE USERS' LINE SELECTION
lineList.addEventListener('change', function(e){
  var selectLine = e.currentTarget.value;
  selectedLine = e.currentTarget.value.replace(/Line|[-]|\s/g,"");
  var stUrl = `https://api-tokyochallenge.odpt.org/api/v4/odpt:Railway?odpt:operator=odpt.Operator:${operator}&acl:consumerKey=845f49d51cc2832084befe2f183560099eed95cfe459c20acf25f0359b71fb47`;
  getStationInfo(stUrl, selectLine);
});
function getStationInfo(stUrl, selectLine){
  var stxhr = new XMLHttpRequest;
  stxhr.open('GET',stUrl,true);
  stxhr.onload = function (){
    var stParse = JSON.parse(this.responseText);
    var linesArray = [];
    var stationsArray = [];
    var found;
    for(var i = 0;i < stParse.length;i++){
      var x =  stParse[i]['odpt:railwayTitle'
      ]['en'];
      if(x == selectLine){
        found = stParse[i];
        var stationList= [];
        stationList = found['odpt:stationOrder'];
        for(var n = 0; n<stationList.length;n++){
          var onlyNames;
          onlyNames = stationList[n]['odpt:stationTitle']['en'];
          stationsArray.push(onlyNames);
        }
      }
      linesArray.push(x);
    }
    var stDrop = document.getElementById('station');
    stDrop.innerHTML="";
    stationsArray.forEach(function(lines){
      var stOP =document.createElement('option');
      stOP.innerHTML=lines;
      stDrop.appendChild(stOP);
    }); 
  }
  stxhr.send();
}

var stationsList = document.getElementById('station');
stationsList.addEventListener('change', function(e){
  selectStation = e.currentTarget.value;
  selectedSataion = e.currentTarget.value.replace(/Line|[-]|\s/g,"");
  var dirUrl = `https://api-tokyochallenge.odpt.org/api/v4/odpt:StationTimetable?odpt:operator=odpt.Operator:${selectOp}&odpt:station=odpt.Station:${selectOp}.${selectedLine}.${selectedSataion}&odpt:calendar=odpt.Calendar:Weekday&acl:consumerKey=${key}`;
  getDirInfo(dirUrl);
});

function getDirInfo(url){
  var dirXhr = new XMLHttpRequest;
  console.log(url);
  dirXhr.open('GET',url,true);
  dirXhr.onload = function (){
    var lnParse = JSON.parse(this.responseText);
    var linesArray =[];
    for(var i = 0;i < lnParse.length;i++){
      var x =  lnParse[i]['odpt:railDirection'];
      linesArray.push(x);
    }
    linesArray.unshift('Select');
    var dir = document.getElementById('Direction');
    dir.innerHTML="";
    linesArray.forEach(function(lines){
      var stOP =document.createElement('option');
      stOP.innerHTML=lines;
      dir.appendChild(stOP);
    }); 

    
  }
  dirXhr.send();
}

dirDrop.addEventListener('change', function(e){
  dirSelect = e.currentTarget.value;
  tttt = `https://api-tokyochallenge.odpt.org/api/v4/odpt:StationTimetable?odpt:operator=odpt.Operator:${selectOp}&odpt:station=odpt.Station:${selectOp}.${selectedLine}.${selectedSataion}&odpt:calendar=odpt.Calendar:Weekday&odpt:railDirection=${dirSelect}&acl:consumerKey=${key}`;
  console.log(tttt);
});

saveBtn.addEventListener('click', function(){
  modal.style.display= "none";
  getTime();
  apiCall();
});
locationBtn.addEventListener('click', function(){
  console.log('hi');
  modal.style.display= "block";
});



function getTime() {
  var date = new Date();
  nowHour = addZero(date.getHours());
  nowMin = addZero(date.getMinutes());
  nowSec = addZero(date.getSeconds());
  var day = date.getDay();
  if(day > 0 && day < 6){
    dayCal = 'Weekday';
  } else{
    dayCal = 'Weekend';
  }
  totalTime = `${nowHour}${nowMin}`

  // DISPLAY THE TIME IN DOM
  document.getElementById('a').innerHTML = `${nowHour}:${nowMin}`;
  apiCall();
  // CALLS THE getTime FUNCTON EVERY 1 SECOND 
  setTimeout(getTime, 500);
}

// ADDS A ZERO TO THE BEGINNING OF NUMBERS LOWER THAN 10
function addZero(i){
  if(i < 10){
    i = "0" + i; 
  }
  return i; 
}

// THIS IS KIND OF LIKE PART TWO OF THE APP. I SHOULD PROBABLY BE SEPERATED SOME HOW. IT CALLS THE API ONE LAST TO GET THE CHOOSEN TIME 

function apiCall(){
var xhr = new XMLHttpRequest;

xhr.open('GET',tttt, true);
xhr.onload = function (){
  
  var parse = JSON.parse(this.responseText);
  var a = parse[0];
 
  var b = a["odpt:stationTimetableObject"];
  for(var i = 0;i < b.length;i++){
    var d =  b[i]['odpt:departureTime'];
    var removed = d.replace(":","");
    withSemiColon.push(d);
    timeTable.push(removed);
  }
  compare();
}
xhr.send();
}

function compare(){
  let scheduleArray = timeTable;
  leastDiff = scheduleArray[0];
  var nextNext;
  let diff = Math.abs(totalTime - leastDiff);
  for(var i = 0; i<scheduleArray.length; i++){
    let newDiff = Math.abs(totalTime - scheduleArray[i]);
    if(newDiff <  diff){
      diff = newDiff;
      leastDiff = scheduleArray[i];
    }
    if(leastDiff <= totalTime){
      leastDiff = scheduleArray[i+1];
      nextNext = scheduleArray[i+2];
    }
    tTindex = scheduleArray.indexOf(leastDiff);
    document.getElementById('b').innerHTML= withSemiColon[tTindex];
    document.getElementById('c').innerHTML= withSemiColon[tTindex+1];
    document.getElementById('title').innerHTML=selectStation;
    // document.getElementById('bound').innerHTML=direction;
  }
}
