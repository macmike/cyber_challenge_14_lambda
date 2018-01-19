# Using AWS lambda to solve Cyber Challenge 14
A lambda solution for a time based authenticator

This can be simply copied and pasted into Cloud9 or an AWS Lambda function

[Try it out here!](https://macmike.github.io/cyber_challenge_14_lambda/)

# Output
![CyberCodes Output](https://github.com/macmike/cyber_challenge_14_lambda/blob/master/cyber_codes_output.png)


# Overview

```javascript
function solveTimeBasedCodeChallenge(event, context, callback){
    
    //these get called asynchronously so we've got to wait later until they're done
    getCode(callback,url1,1);    
    getCode(callback,url2,2);    
    getCode(callback,url3,3);    
    getCode(callback,url4,4);    
    getCode(callback,url5,5);    
    
    //this bit waits for 300ms before checking for results
    setTimeout(function(){
        checkForResults(event, context, callback);
    },300);
}


//this function waits to until the array is full of codes, then it combines them
//into a single string, before looking for the final answer
function checkForResults(event, context, callback){
        
    if (allCodesCollected(codes)){
        //got the code, let's call out for the final answer
        var combinedCode = codes.join('');
        getFinalAnswer(event,context, callback, combinedCode);
         
    } else {
        //if we don't have all of the results yet wait a bit and check again
        setTimeout(checkForResults(event, context, callback),300); 
    }
}


//this function looks for the final answer using the combined code  
//build a JSON result object and exits the lambda function
function getFinalAnswer(event, context, callback, combinedCode){
    getWebRequest(resultUrl + combinedCode, function webResonseCallback(err, data) {
        if (err) {
            callback(null, "Sorry I couldn't connect to the server: " + err);
        } else {
            //something like this
            var finalAnswer = data;
            
            //build a response object and return
            var resultObj = {}
            resultObj.codes = codes;
            resultObj.combinedCode = combinedCode;
            resultObj.finalAnswer = finalAnswer;
            callback(null,resultObj);
        }
    });  
}
```
