const yelp = require('yelp');
const request = require('request');


// explicit text message from the user
exports.receivedMessage = (messagingEvent) => {
	console.log('message', JSON.stringify(messagingEvent));	
};


// get started, button click, and so on
exports.receivedPostback = (messagingEvent) => {
	var recipientId = messagingEvent.sender.id;

	console.log('postback', JSON.stringify(messagingEvent));
	
	if (messagingEvent.postback.payload === "NEW_THREAD_STARTED") {
		sendResponse({
			recipient: {id: recipientId},
			sender_action: "typing_on"
		});

		setTimeout(() => {
		    sendResponse({
			recipient: {id: recipientId},
			message: {
				text: "Hey, I'm GoudaBot! I can easily help you find good restaurants with specific filters. Just write me what are your expectations, and I'll try to find good results. Make sure to respect the right formulation format, I'm new here!"
			}
		    }, {
			recipient: {id: recipientId},
			message: {
				text: "For example, you can ask me \"Show me a 3 star restaurant in Oshawa\", or \"4 star and over italian restaurant within 2 km\". The menu below contains the format required, if you happen to forget it. Bon appétit! :D"
			}
		    })
		}, 1500);
	}
};


function sendResponse(response, secondResponse) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: process.env.page_access_token },
    method: 'POST',
    json: response
  }, (err) => {
    if (!err && secondResponse) {
      request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.page_access_token },
        method: 'POST',
        json: secondResponse
      })
    }
  });
}
