# Chi Wai Kung Fu AWS Lambda function for Alexa

## Chi Wai Kung Fu
I'm a student at [Chi Wai Kung Fu Black belt Academy](http://chiwai.co.uk/) in Cheltenham, UK. Each month there's a different set of strikes to practice as well as the techniques and general training. This Alexa skill for Amazon Echo, Dot, Tap etc. knows all about the strikes of the month and the black belt elements.

It's a great reminder before you head out for training.

##Setup
This skill isn't published yet. When it is you'll be able to say:

    User : "Alexa, enable skill Chi Wai"

## Examples
    User: "Alexa, Ask Chi Wai, what are this month's strikes?"
    User: "Alexa, Ask Chi Wai, what are next month's strikes?"
    User: "Alexa, Ask Chi Wai, what are the strikes for November?"
    
    User: "Alexa, Ask Chi Wai, for the current black belt element?"
    User: "Alexa, Ask Chi Wai, for next months black belt element?"
    User: "Alexa, Ask Chi Wai, for the black belt element in August?"
        
You can also use it in interactive mode:

    User: "Alexa, talk to Chi Wai"
    Skill: ....
    User: "Zoon Ching"
    Skill: ....
    User: "What are next month's strikes?"
	Skill: ....
	User: "What's next month's black belt element?"
    
##Technical Details
 
This function has no external dependencies and very limited session management, it simply interrogates a set of static information.

The contents of **src** are intended to be hosted as an [AWS Lambda](http://aws.amazon.com/lambda) function. The index.js file is the brains of the operation, converting Alexa intents into queries on the strike of the month information.

The contents of **speech assets** are used to configure the Alexa skill in the [Amazon Developer Console](https://developer.amazon.com/edw/home.html)



