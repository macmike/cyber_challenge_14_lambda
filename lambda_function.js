exports.handler = (event, context, callback) => {
    
    //these get called asynchronously so we've got to wait later until they're done
    getCode(callback,url1,1);    
    getCode(callback,url2,2);    
    getCode(callback,url3,3);    
    getCode(callback,url4,4);    
    getCode(callback,url5,5);    
    
    setTimeout(function(){
        checkForResults(event, context, callback);
    },500);
    
};

const url1 = "https://assess.joincyberdiscovery.com/challenge-files/clock-pt1?verify=NsmB%2BXNLbNs5ek4zWN6P1w%3D%3D";
const url2 = "https://assess.joincyberdiscovery.com/challenge-files/clock-pt2?verify=NsmB%2BXNLbNs5ek4zWN6P1w%3D%3D";
const url3 = "https://assess.joincyberdiscovery.com/challenge-files/clock-pt3?verify=NsmB%2BXNLbNs5ek4zWN6P1w%3D%3D";
const url4 = "https://assess.joincyberdiscovery.com/challenge-files/clock-pt4?verify=NsmB%2BXNLbNs5ek4zWN6P1w%3D%3D";
const url5 = "https://assess.joincyberdiscovery.com/challenge-files/clock-pt5?verify=NsmB%2BXNLbNs5ek4zWN6P1w%3D%3D";
const resultUrl = "https://assess.joincyberdiscovery.com/challenge-files/get-flag?verify=NsmB%2BXNLbNs5ek4zWN6P1w%3D%3D&string=";
var codes = [];

function getCode(callback, url, codenum) {
    console.log(`GetCode(${codenum})`);
    getWebRequest(url, function webResonseCallback(err, data) {
        if (err) {
            console.log('error getting code:' + err);
            callback(null, "Sorry I couldn't connect to the server: " + err);
        } else {
            //something like this
            codes[codenum-1] = data;
            console.log(`codes[${codenum}] = ${data}`);
        }
    });
}

function checkForResults(event, context, callback){
        
    if (allCodesCollected(codes)){
        //got the code, let's call out for the final answer
        var combinedCode = codes.join('');
        console.log(`Combined code: ${combinedCode}`);
        getFinalAnswer(event,context, callback, combinedCode);
         
    } else {
        //if we don't have all of the results yet wait a bit and check again
        //console.log('Not all codes collected yet, waiting another 100ms');
        setTimeout(checkForResults(event, context, callback),2000); 
    }
}


function getFinalAnswer(event, context, callback, combinedCode){
    //console.log(`GetCode(${codenum})`);
    getWebRequest(resultUrl + combinedCode, function webResonseCallback(err, data) {
        if (err) {
            console.log('error getting final answer:' + err);
            callback(null, "Sorry I couldn't connect to the server: " + err);
        } else {
            //something like this
            var finalAnswer = data;
            console.log(`finalAnswer = ${data}`);
            //build a response object and return
            var resultObj = {}
            resultObj.codes = codes;
            resultObj.combinedCode = combinedCode;
            resultObj.finalAnswer = finalAnswer;
            callback(null,resultObj);
        }
    });  
}


///mucking about to see if the array is correct

function allCodesCollected(codesArray){
 //console.log(`  array size: ${codesArray.length} values: ${codesArray.join()}`);
 return (codesArray.length === 5) &&
   (codesArray[0] != '') &&
   (codesArray[1] != '') &&
   (codesArray[2] != '') &&
   (codesArray[3] != '') &&
   (codesArray[4] != '');
}



//calling a webservice

var http = require('https');
 
function getWebRequest(url,doWebRequestCallBack) {
    //console.log("getWebRequest("+url+")");
    http.get(url, function (res) {
        var webResponseString = '';
        //console.log('Status Code: ' + res.statusCode);
 
        if (res.statusCode != 200) {
            doWebRequestCallBack(new Error("Non 200 Response"));
        }
 
        res.on('data', function (data) {
            webResponseString += data;
        });
 
        res.on('end', function () {
            //console.log('Got some data: '+ webResponseString);            
            doWebRequestCallBack(null, webResponseString);
        });
    }).on('error', function (e) {
        //console.log("Communications error: " + e.message);
        doWebRequestCallBack(new Error(e.message));
    });
}

