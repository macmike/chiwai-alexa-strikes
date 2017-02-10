'use strict';

/**
 * Chi Wai Strikes of the month skill
 * by Mike MacDonagh
 * 
 */
 
const APP_ID = 'amzn1.ask.skill.72bfb826-f8a3-49c2-9ce8-11f3da06558a';

//if true then lots of logging will be generated
const isDebug = false;


// --------------- The strike information -----------------------
 
var MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May', 
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
    ];
    
var STRIKETYPES = ['Foot','Hand','Elbow','Knee'];

const STR_STRIKES = 'strikes';
const STR_CURRENT = 'current';
const STR_NEXT = 'next';
const STR_SPECIFIC = 'specific';
const STR_BLACK = 'black';
const STR_NONE = 'none';
const STR_OPENSESSION_PROMPT = '\nPlease ask me another kung fu question.';
const STR_OPENSESSIONREPROMPT = 'Please ask me another question about Chi Wai kung fu strikes of the month or black belt elements.';

var STRIKES = [
        ['Back Heel', 'Hammer Fist', 'Hooking Elbow', 'Front Point'], 
        ['Outer Crescent Kick', 'Lower Crane Wing', 'Upper Cut Elbow', 'Inner Knee'], 
        ['Inner Crescent Kick', 'Mantis Fist', 'Inner Elbow', 'Outer Knee'], 
        ['Front Kick', 'Kung Fu Fist', 'Top Elbow', 'Front Knee'], 
        ['Roundhouse', 'Upper Crane Wing', 'Bottom Elbow', 'Top Knee'], 
        ['Side Kick', 'Jab and Reverse', 'Elbow Point', 'Knee Point'], 
        ['Hooking Kick', 'Chain Punch', 'Diagonal Elbow', 'Outer Knee'], 
        ['Axe Kick', 'Ridge Hand and Kung Fu Fist', 'Inner Elbow', 'Inner Knee'], 
        ['Push Kick', 'Hook and Mantis Strike', 'Back Elbow', 'Top Knee'], 
        ['Hooking Heel', 'Upper Cut', 'Hooking Elbow', 'Front Knee'], 
        ['Foot Exercises', 'Snap Punch', 'Top Elbow', 'Knee Point'], 
        ['Inner Heel Kick', 'Back Fist', 'Elbow Point', 'Outer Knee'], 
    ];


var BLACKBELTELEMENTS = [
    'Escrima Skills.',
    'Power and Efficient Striking. Foot strikes for 1st dans. Hand strikes for 2nd dans.',
    'Bo Staff Skills.',
    'Multiple Attacks. Unarmed for 1st dans. Armed for 2nd dans.',
    'Sticking Hands and Wall Work.',
    'Sparring and grappling.',
    ];
 

// --------------- Helpers that build all of the responses -----------------------



function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    if (isDebug) {console.log(`buildSpeechletResponse(title:${title}, shouldEndSession:${shouldEndSession}, reprompt:${repromptText})`)}
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `${title}`,
            content: `${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '2.0',
        response: speechletResponse,
        sessionAttributes: sessionAttributes,        
    };
}




// ---------------- intent helpers -------------------------//

function currentMonthIndex(){
    let aDate = new Date();
    return aDate.getMonth();
}

function getIntentMonthIndex(intent){
    const requestMonthSlot = intent.slots.Date;
    if (requestMonthSlot){    
        let requestMonth = new Date(requestMonthSlot.value);
        let monthIndex = requestMonth.getMonth();
        return monthIndex;
    } else {
        return currentMonthIndex();
    }    
}

function getCWInfoType(cwInfoSlot){
    //deal with chi wai requests
    let cwInfo = STR_NONE; 
    if (cwInfoSlot){    
        cwInfo = cwInfoSlot.value;
        if (cwInfo){
            if (isDebug) {console.log(`getCWInfoType(${cwInfo})`)}
            if (cwInfo.includes("black") || cwInfo.includes("belt") || cwInfo.includes("bible") || cwInfo.includes("bell")){
                cwInfo = STR_BLACK;
            } else if (cwInfo.includes("strike") || cwInfo.includes("stripe") || cwInfo.includes("strait") || cwInfo.includes("stroke") || cwInfo.includes("streit")) {
                cwInfo = STR_STRIKES;
            }
        }
        
    }
    if (isDebug) {console.log(`getCWInfoType:: result = ${cwInfo}`)}
    if (cwInfo === STR_NONE) {console.log(`getCWInfoType(${cwInfo}) failed to understand: cwInfoSlot.value`)}
    return cwInfo;
}


// ---------------- text builders -------------------------//

function buildMonthIntroText(aMonthIndex){
    let monthText = MONTHS[aMonthIndex];
    return `For the month of ${monthText}: `;
}

function buildBackBeltElementForMonth(aMonthIndex){
    if (aMonthIndex > 5) {aMonthIndex -= 6}
    let elementText = BLACKBELTELEMENTS[aMonthIndex];
    return `The Black Belt Element is ${elementText}`;
}

function buildSingleStrikeTextForMonth(aMonthIndex, aStrikeType){

    let returnStr = "";
    let aStrikeTypeIndex = -1;
    if (aStrikeType === STRIKES[0]){
        aStrikeTypeIndex = 0;
    } else if (aStrikeType === STRIKES[1]){
        aStrikeTypeIndex = 1;    
    } else if (aStrikeType === STRIKES[2]){
        aStrikeTypeIndex = 2;
    } else if (aStrikeType === STRIKES[3]){
        aStrikeTypeIndex = 3;
    }

    if (aStrikeTypeIndex === -1)
    {
        returnStr = null;
    } else {
        let strikeTypeText = STRIKETYPES[aStrikeTypeIndex];
        let strikeText = STRIKES[aMonthIndex][aStrikeTypeIndex];
        returnStr = `The ${strikeTypeText} strike is ${strikeText}`;    
    }
    return returnStr;
}


function buildStrikesTextForMonth(aMonthIndex){
    
        
    let returnStr = buildMonthIntroText(aMonthIndex) + " \n   " +
                    buildSingleStrikeTextForMonth(aMonthIndex,STRIKES[0]) + ". \n   " +
                    buildSingleStrikeTextForMonth(aMonthIndex,STRIKES[1]) + ". \n   " +
                    buildSingleStrikeTextForMonth(aMonthIndex,STRIKES[2]) + '. \n   And ' +
                    buildSingleStrikeTextForMonth(aMonthIndex,STRIKES[3]) + ".";
        
    return returnStr;
}

// --------------- Session helper ----------------------------//

function recreateSessionAttributes(session){
    
    
    if (!session.attributes) {session.attributes = {}}
    let sessionAttributes = session.attributes;
    if (sessionAttributes && sessionAttributes.isOpenSession){
        let newIsOpenSession = sessionAttributes.isOpenSession;
        sessionAttributes = {"isOpenSession": newIsOpenSession};
    } else {
        sessionAttributes = {"isOpenSession": false};
    }
    
    if (isDebug) {console.log(`recreateSessionAttributes::recreated isOpenSession attr = ${sessionAttributes.isOpenSession}`)}
    session.attributes = sessionAttributes;
    return sessionAttributes;
}

function getRepromptText(sessionAttributes){
    let result = null;
    if (sessionAttributes.isOpenSession){
        result = STR_OPENSESSIONREPROMPT;
    } 
    if (isDebug) {console.log(`getRepromptText() = ${result}`)}
    return result;
}

function getFollowOnQuestionText(sessionAttributes){
    let result = "";
    if (sessionAttributes.isOpenSession){
        result = STR_OPENSESSION_PROMPT;
    } 
    if (isDebug) {console.log(`getRepromptText() = ${result}`)}
    return result;
}

// ---------------- intent responses -------------------------//

function getWelcomeResponse(callback) {
    if (isDebug) {console.log("getWelcomeResponse()")}

    let sessionAttributes = {"isOpenSession":true};
        
    const cardTitle = 'Welcome';
    const speechOutput = 'Welcome to Chi Wai. ' +
        'Please ask me what the strikes of the month are, or the black belt element for any month';
        
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'Please ask me about the strikes of the month or the black belt element for any month';
    const shouldEndSession = false;

    if (isDebug) {console.log(`getWelcomeResponse::isOpenSession attr = ${sessionAttributes.isOpenSession}`)}

    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    if (isDebug) {console.log("handleSessionEndRequest")}
    
    const cardTitle = 'Session Ended';
    const speechOutput = 'Zoon Ching. Enjoy your training.';
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}


function getZoonChingResponse(intent, session, callback){
    if (isDebug) {console.log(`getZoonChingResponse`)}
    let sessionAttributes = recreateSessionAttributes(session);
    
    const cardTitle = `Chi Wai! Zoon Ching!`;
    const speechOutput = "Zoon Ching! That means respect. Traditionally we say it at the beginning and end of training." + getFollowOnQuestionText(sessionAttributes);
    
    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, getRepromptText(sessionAttributes), !sessionAttributes.isOpenSession));
}

function getAMonthStrikes(intent, session, callback, aMonthIndex) {
    
    if (isDebug) {console.log(`getAMonthStrikes(${aMonthIndex + 1})`)}
    
    let sessionAttributes = recreateSessionAttributes(session);
    if (isDebug) {console.log("getAMonthStrikes::sessionAttributes.isOpenSession attr = " + sessionAttributes.isOpenSession)}
    
    const monthText = MONTHS[aMonthIndex];
    const cardTitle = `Chi Wai! ${monthText} Strikes of the Month!`;
    const speechOutput = buildStrikesTextForMonth(aMonthIndex) + getFollowOnQuestionText(sessionAttributes);
    
    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, getRepromptText(sessionAttributes), !sessionAttributes.isOpenSession));
}

function getAMonthBlackBelt(intent, session, callback, aMonthIndex) {
    
    if (isDebug) {console.log(`getAMonthBlackBelt(${aMonthIndex + 1})`)}
    
    let sessionAttributes = recreateSessionAttributes(session);
    
    if (isDebug) {console.log("getAMonthBlackBelt::sessionAttributes.isOpenSession = " + sessionAttributes.isOpenSession)}
    
    const monthText = MONTHS[aMonthIndex];
    const cardTitle = `Chi Wai ${monthText} Black Belt Element!`;    
    const speechOutput = buildMonthIntroText(aMonthIndex) + " \n " + buildBackBeltElementForMonth(aMonthIndex) + getFollowOnQuestionText(sessionAttributes);
    
    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, getRepromptText(sessionAttributes), !sessionAttributes.isOpenSession));   
}

function getChiWaiInfo(intent, session, callback, timePeriod) {
    
    if (isDebug) {console.log(`getChiWaiInfo(${timePeriod})`)}
    
    let cardTitle = 'Chi Wai!';
    let repromptText = null;
    let speechOutput = null;
    let aMonthIndex = -1;

    //work out which month we're talking about
    if ((timePeriod === STR_CURRENT) || (timePeriod === STR_SPECIFIC)){
        aMonthIndex = getIntentMonthIndex(intent);
    } else if (timePeriod === STR_NEXT) {
        aMonthIndex = currentMonthIndex()+1;
        if (aMonthIndex > 11) {
          aMonthIndex = 0;
        }     
    }
    if (isDebug) {console.log(`getChiWaiInfo::aMonthIndex = ${aMonthIndex+1}`)}

    let cwInfo = getCWInfoType(intent.slots.CWInfo);
    if (cwInfo === STR_BLACK){    
        //do black belt element
        getAMonthBlackBelt(intent, session, callback, aMonthIndex);
        return;        
    } else if (cwInfo === STR_STRIKES) {
        //do monthly strikes
        getAMonthStrikes(intent, session, callback, aMonthIndex);  
        return;        
    } else {
        //deal with errors
        let sessionAttributes = recreateSessionAttributes(session);

        cwInfo = null;
        repromptText = "Would you like the strikes of the month or the blackbelt element?";
        speechOutput = "Sorry I didn't hear you properly. " + repromptText;
        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, false));                       
    }
        
    
}


// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}


/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    
    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;
    
    if (isDebug) {console.log(`onIntent(${intentName})`)}

    
    if (intentName === 'GetThisMonthsInfo') {
        getChiWaiInfo(intent, session, callback, STR_CURRENT); 
    } else if (intentName === 'GetNextMonthsInfo'){
        getChiWaiInfo(intent, session, callback, STR_NEXT); 
    } else if (intentName === 'GetAMonthInfo'){
        getChiWaiInfo(intent, session, callback, STR_SPECIFIC); 
    } else if (intentName === 'ZoonChingIntent'){
        getZoonChingResponse(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent' || intentName === 'AMAZON.NoIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

     
        
        if (event.session.application.applicationId !== APP_ID) {
             callback('Invalid Application ID');
        }
        

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};