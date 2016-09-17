const yelp = require('yelp');
const request = require('request');


// explicit text message from the user
exports.receivedMessage = (messagingEvent, userStates) => {
	var recipientId = messagingEvent.sender.id;
	console.log('message', JSON.stringify(messagingEvent));

	if (messagingEvent.message.hasOwnProperty('quick_reply') && messagingEvent.message.quick_reply.payload === "RIGHT_FORMAT") {
		sendResponse({
                        recipient: {id: recipientId},
                        message: {
                                text: "Legend: \n  [...] ignored\n  (...) optional\n  <...> Type expected\n  | either one\n\nFormat: \n  [Show me, find me] [the] (closest | best) (<cuisine adjective>) RESTAURANTS (IN <city> | WITHIN <number> km)\n\ne.g. \"best greek restaurants within 3 km\"\n\nI hope that makes sense :)"
                        }
                })
        } else if (messagingEvent.message.hasOwnProperty('attachments') && messagingEvent.message.attachments[0].type === "location") {
		var yelpObjCoord = userStates[recipientId];
		yelpObjCoord.coords = messagingEvent.message.attachments[0].payload.coordinates;

		// call yelp api
		console.log(yelpObjCoord);
	} else if (messagingEvent.message.text && /(?:(closest|best) ?([a-z-']+)?|([a-z-']*)) ?restaurants? (?:(in) (.+)|(within) ([0-9]+) ?(?:kms?|kilometres?))/i.test(messagingEvent.message.text)) {
		var yelpObj = {
			sorting: RegExp.$1 || 'match',
			category: RegExp.$2,
			in: RegExp.$5 || null,
			within: RegExp.$7 || null,
			coords: null
		};
		userStates[recipientId] = yelpObj;
		console.log(userStates)
		if (yelpObj.within) {
			// ask for coords
			sendResponse({
				recipient: {id: recipientId},
				message: {
					"text":"Please share your location:",
    					"quick_replies":[
      					    {
        					"content_type":"location",
      					    }
    					]
				}
			});
		} else {
			// call api with upgraded yelpObj
		}
	}	
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
				text: "For example, you can ask me \"Show me the closest restaurant in Oshawa\", or \"italian restaurant within 2 km\". The menu below contains the format required, if you happen to forget it. Bon appétit! :D",
				quick_replies: [
					{
						content_type: "text",
						title: "Format",
						payload: "RIGHT_FORMAT"
					}
				]
			}
		    })
		}, 1500);
	} else if (messagingEvent.postback.payload === "RIGHT_FORMAT") {
		sendResponse({
			recipient: {id: recipientId},
			message: {
				text: "Legend: \n  [...] ignored\n  (...) optional\n  <...> Type expected\n  | either one\n\nFormat: \n  [Show me, find me] [the] (closest | best) (<cuisine adjective>) RESTAURANTS (IN <city> | WITHIN <number> km)\n\ne.g. \"best greek restaurants within 3 km\"\n\nI hope that makes sense :)"
			}
		})
	} else if (messagingEvent.postback.payload === "NEED_HELP") {
		sendResponse({
			recipient: {id: recipientId},
			message: {
				text: "Hello again! If you need help to find good restaurants with custom filters, I can help you. Just write me what are your expectations, and I'll try to find good results. Make sure to respect the right format, otherwise I may not understand you :/"
			}
		}, {
			recipient: {id: recipientId},
			message: {
				text: "For example, you can ask me \"Show me restaurants in Montréal\", or \"Chinese restaurants within 2 km\". The menu below contains the format required, if you happen to forget it."
			}
		});
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

function callYelpAPI(obj) {
	// implement here
}
