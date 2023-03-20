import * as dotenv from 'dotenv';
dotenv.config();
import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import { promises as fs } from 'fs';

import banned from './data/banned.mjs';
import guests from './data/streamers.json' assert {type: "json"};

const clientId = process.env.CLIENTID;
const clientSecret = process.env.CLIENTSECRET;
const tokenData = JSON.parse(await fs.readFile('./tokens.878627958.json', 'UTF-8'));
const authProvider = new RefreshingAuthProvider(
	{
		clientId,
		clientSecret,
		onRefresh: async (userId, newTokenData) => await fs.writeFile(`./tokens.${userId}.json`, JSON.stringify(newTokenData, null, 4), 'UTF-8')
	}
);

await authProvider.addUserForToken(tokenData, ['chat']);

const chatClient = new ChatClient({ authProvider, channels: guests });
await chatClient.connect(
    console.log(`bot has been loaded in the following channels: ${guests}`)
);

chatClient.onMessage((channel, user, text) => {
	if (text === 'merp') {
		chatClient.say(channel, 'qᴙɘm')
	};
});
    
chatClient.onMessage((channel, user, text) => {
    if (text === '!botinfo') {
        chatClient.say(channel, `Hiyea, i'm a creation from SkippTekk, feel free to reach him on my twitch page!`)
        console.log(`bot info was ran in ${channel}`)
    };
});
    

console.log(guests)
//Join function and shit 
chatClient.onMessage((channel, user, text, msg) => {
    if(text === '!join'){
        if(guests.includes(user)){
            chatClient.say(channel,`I'm already in your channel ${user}`)
        }else {
            chatClient.say(channel, `Attempting to join channel for ${user}, if you want me to leave. use the !leave command`);
            chatClient.join(user);
            guests.push(user);
            console.log(guests);
            fs.writeFile('./data/streamers.json',JSON.stringify(guests), 'utf8',)
        }
    } else if (text === '!leave'){
        if (msg.userInfo.isBroadcaster){
            chatClient.say(channel,`Okie dokie, I shall leave now, thanks for having me!`);
            for(var i=0; i< guests.length; i++){
                if (guests[i] === user){
                    guests.splice(i,1)
                }
            }
            chatClient.part(user);
            console.log(guests);
            fs.writeFile('./data/streamers.json',JSON.stringify(guests), 'utf8',);

        }
    }
});
chatClient.onMessage((channel, user, text) => {    
    for (const s of Object.keys(banned)){
        if(text.toLocaleLowerCase().indexOf(s) !== -1)
        return chatClient.say(channel, `${user} said a bad word`)
    } 
})