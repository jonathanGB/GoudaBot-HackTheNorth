const yelp = require('yelp');

// explicit text message from the user
exports.receivedMessage = (messagingEvent, sendStatus) => {
	sendStatus();	
};


// get started, button click, and so on
exports.receivedPostback = (messagingEvent, sendStatus) => {
	sendStatus();
};
