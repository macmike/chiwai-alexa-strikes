'use strict';

/**
 * Chi Wai Strikes of the month skill
 * by Mike MacDonagh
 * 
 */
 
var APP_ID = 'amzn1.ask.skill.72bfb826-f8a3-49c2-9ce8-11f3da06558a';


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
        sessionAttributes,
        response: speechletResponse,
    };
}


// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Welcome to Chi Wai. ' +
        'Please ask me what the strikes of the month are, or the black belt element for any month';
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'Please ask me about the strikes of the month or the black belt element';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Zoon Ching. Enjoy your training.';
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}



// ---------------- intent helpers -------------------------//

function currentMonthIndex(){
    let aDate = new Date();
    return aDate.getMonth();
}

function getIntentMonthIndex(intent)
{
    const requestMonthSlot = intent.slots.Date;
    if (requestMonthSlot){    
        let requestMonth = new Date(requestMonthSlot.value);
        let monthIndex = requestMonth.getMonth();
        return monthIndex;
    } else {
        return currentMonthIndex();
    }    
}


// ---------------- text builders -------------------------//

function buildMonthIntroText(aMonthIndex)
{
    let monthText = MONTHS[aMonthIndex];
    return `For the month of ${monthText}: `;
}

function buildBackBeltElementForMonth(aMonthIndex)
{
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

// ---------------- text builders -------------------------//


function ___getAMonthsStrikes(intent, session, callback) {
    let cardTitle = 'Chi Wai!';
    const shouldEndSession = true;
    let speechOutput = "";
    
    let aMonthIndex = getIntentMonthIndex(intent);
    let aStrikeType = getIntentStrikeType(intent);

    cardTitle = `aMonthIndex: ${aMonthIndex} and aStrikeType: ${aStrikeType}`;
    
    if (aStrikeType === STR_STRIKES){
        speechOutput = buildStrikesTextForMonth(aMonthIndex);
    } else if (aStrikeType) {
        speechOutput = buildMonthIntroText(aMonthIndex) + buildSingleStrikeTextForMonth(aMonthIndex,aStrikeType);
    } else {
        speechOutput = "I'm sorry I didn't understand which strike you were asking for. Try foot, hand, elbow, knee, punch or kick.";
    }
    
    //speechOutput = `Month index: ${aMonthIndex} and Strike type: ${aStrikeType}`;
    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));      
}

function getAMonthStrikes(intent, session, callback, aMonthIndex) {
    const shouldEndSession = true;
    const monthText = MONTHS[aMonthIndex];
    const cardTitle = `Chi Wai! ${monthText} Strikes of the Month!`;
    const speechOutput = buildStrikesTextForMonth(aMonthIndex);
    
    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));       
}

function getAMonthBlackBelt(intent, session, callback, aMonthIndex) {
    
    const shouldEndSession = true;
    const monthText = MONTHS[aMonthIndex];
    const cardTitle = `Chi Wai ${monthText} Black Belt Element!`;    
    const speechOutput = buildMonthIntroText(aMonthIndex) + " \n " + buildBackBeltElementForMonth(aMonthIndex);
    
    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));          
}

function getChiWaiInfo(intent, session, callback, timePeriod) {
    
    let cardTitle = 'Chi Wai!';
    let shouldEndSession = true;
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

    let cwInfo = "none";
    const cwInfoSlot = intent.slots.CWInfo;

    //deal with chi wai requests
    if (cwInfoSlot){    
        cwInfo = cwInfoSlot.value;
        if ((cwInfo === "strikes") || (cwInfo === "strikes of the month")){
          getAMonthStrikes(intent, session, callback, aMonthIndex);
          return;
        } else if ((cwInfo === "blackbelt element") || (cwInfo === "black belt element")){
          getAMonthBlackBelt(intent, session, callback, aMonthIndex);
          return;
        } else {
            cwInfo = "none";
        }
    }
    
    //deal with errors
    if (cwInfo === "none")
    {
        cwInfo = null;
        repromptText = "Would you like the strikes of the month or the blackbelt element?";
        speechOutput = "Sorry I didn't hear you properly. " + repromptText;
        shouldEndSession = false;
    }
        
    
    callback({}, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));              
    
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
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;
    
    if (intentName === 'GetThisMonthsInfo') {
        getChiWaiInfo(intent, session, callback, STR_CURRENT); 
    } else if (intentName === 'GetNextMonthsInfo'){
        getChiWaiInfo(intent, session, callback, STR_NEXT); 
    } else if (intentName === 'GetAMonthInfo'){
        getChiWaiInfo(intent, session, callback, STR_SPECIFIC); 
   
    } else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
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