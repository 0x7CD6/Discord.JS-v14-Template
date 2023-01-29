/**
 * @file index.js
 * @description This is the main file for the bot, it's where we initialize the bot and load all of the commands and events.
 * @author <name> (blank for you)
 * @license <license> (blank for you)
 * @version 1.0.0
 * 
 * @requires dotenv
 * @requires discord.js
 * @requires fs
 * @requires colors
 * 
 * Helpful Documentational Links:
 * [DotEnv] https://www.npmjs.com/package/dotenv
 * [Discord.js] https://discord.js.org/#/
 * [Discord.js Guide] https://discordjs.guide/
 * [Discord.js Commando] https://discord.js.org/#/docs/commando/master/general/welcome
 * [Node.js File System] https://nodejs.org/api/fs.html
 * [Colors] https://www.npmjs.com/package/colors
*/


/**
 * @description We're going to load our required modules we need to run this application here.
 */
require('colors')                     // We're going to use the colors package (found at line 23) to colorize our console output.


require('dotenv').config()           // We're going to use the dotenv package (found at line 17) to load our environment variables from our .env file.
//                                       We don't initialize this variable because all we need to do is load the inital #config method (https://github.com/motdotla/dotenv/blob/master/lib/main.js#L58) 
//                                       Because of this, we can just use the #require method to load the package and load the contents of what we need.

const Discord = require('discord.js') // We're going to use the Discord.js (found at line 21) package to utilize the API provided by Discord (https://discord.com/developers/docs/intro)
//                                       for the bot which we'll be making today. :)

const fs = require('fs')              // We're going to use the Node.js File System (found at line 22) package to read the contents of our commands and events folders.

// We store our intents in a constant variable (which means it can't be modified later) so we can use it later on in our code.
// Our intents are what we'll use to tell Discord what we want to do with our bot, this was added to prevent bots from doing things they shouldn't be doing if they are compromised or used for malicious purposes.

// In our case, We'll be using the following intents:
const sessionIntents = [
    Discord.GatewayIntentBits.Guilds, // Guilds is used to get information about the guilds the bot is in.
    Discord.GatewayIntentBits.GuildMessages, // GuildMessages is used to get information about the messages in the guilds the bot is in.
    Discord.GatewayIntentBits.MessageContent, // MessageContent is used to get the content of the messages in the guilds the bot is in.
    Discord.GatewayIntentBits.GuildMembers, // GuildMembers is used to get information about the members in the guilds the bot is in.
]

// Once all of our modules have been loaded, we need to now initialize anything which needs to be initialized.

// We're going to use a constant variable (which means it can't be modified later) to store our Discord.Client object.
// This object is what we'll use to interact with the Discord API and register all of our event interactions via the methods below.

// We'll call this "session" because it's the session of the Discord API which we'll be using to interact with the Discord API.
// Once we define this constant variable (which is a Discord.Client object), we need to initialize it with the #new keyword.
// We need to now fill in the #Client constructor with the options we want to use for our session, in this case we'll be using intents (https://discordjs.guide/popular-topics/intents.html#privileged-intents).
// We already defined our intents in the #sessionIntents constant array.
const session = new Discord.Client({ intents: sessionIntents })

// Before we do anything else, we're going to load our list from our ../storage/list.json file which we'll be using to store our lists of things.
// We'll be doing this differently to how you might originally see people doing this, we're going to be storing this as part of our session object.
// We can do this by simply just adding a new property to our session object.
// We'll call this property "developers" because it's the list of developers for the bot.
session.developers = require('../storage/list.json').developers
// This will now allow us to access the list of developers from anywhere in our code which uses the session object.

// Now we need to set the prefix from our list.json file.
session.prefix = require('../storage/list.json').prefix
// This will now allow us to access the prefix from anywhere in our code which uses the session object.


// Now we need to make sure that the Commands Collection (https://discord.js.org/#/docs/collection/master/class/Collection) is initialized and apart of our #session object.
// We can do this by simply just adding a new property to our session object.
session.commands = new Discord.Collection()
session.aliases = new Discord.Collection()

// Now we need to register our 'ready' event listener so we can tell the console when the bot is ready to go.
session.on('ready', () => {
    // We'll use the #console.log method to log the message to the console.
    // We'll use the #colors.green method to colorize the message green.
    register()
})

// Let's make a function which will go over all of the files inside the events folder and commands folder and register them.
// We'll call this function "register".
function register() {
    // Now we need to get all of the files inside the events folder.
    // We'll use the #readdirSync method from the Node.js File System package (found at line 22) to get all of the files inside the events folder.
    // We'll store the contents of the events folder in a constant variable (which means it can't be modified later) called "events".
    const events = fs.readdirSync('./src/events/').filter(file => file.endsWith('.js'))
    const commands = fs.readdirSync('./src/commands/').filter(file => file.endsWith('.js'))
    // Now we need to loop over all of the files inside the events folder.
    // I would personally usually use a #forEach loop (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) but I'm going to use a #for...of loop (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
    // This way it will be easier to understand for people who are new to JavaScript.

    // We'll use a #for...of loop to loop over all of the files inside the events folder.
    for(const file of events) {
        // We need to now get a filepath to the file we're currently looping over.
        const eventFile = require('../src/events/' + file)
        
        // We need to now register our event listener, we'll use the #on method from the Discord.js package (found at line 18) to register our event listener.
        // We'll call the #on method on the #session constant variable (which we defined at line 61).
        // We'll pass in the #eventName property from the #configuration property from the #eventFile constant variable (which we defined at line 102) as the first parameter.
        // Next we'll pass in the #run method from the #eventFile constant variable (which we defined at line 102) as the second parameter.
        session.on(eventFile.configuration.eventName, (...args) => eventFile.run(session, ...args))

        // We'll use the #session.log method to send a message to the console that the event listener has been registered.
        // We use the eventFile#configuration#eventName property to get the name of the event we're registering and the #file variable to get the name of the file we're currently looping over so we can inform which event and where it's being registered from.
        session.log("Event Registration", `Registered event listener for ${eventFile.configuration.eventName} in file ${file}!`)
    }

    // Now we need to build one for the commands too so we can register all of the commands.
    for(const file of commands) { 
        // We need to now get a filepath to the file we're currently looping over.
        const commandFile = require('../src/commands/' + file)
        
        // We need to now register our command, we'll use the #set method from the Discord.js package (found at line 18) to register our command.
        // We'll call the #set method on the #commands collection from the #session constant variable (which we defined at line 77).
        // We'll pass in the #commandName text from the #configuration property from the #commandFile constant variable (which we defined at line 118) as the first parameter.
        session.commands.set(commandFile.configuration.commandName, commandFile)

        // Let's register the aliases too, we'll use a quick #forEach loop to loop over all of the aliases.
        commandFile.configuration.aliases.forEach(alias => {
            /// Since this is just a quick #forEach loop, we can just use the #set method to set the second parameter as the actual command name so we can use it later.
            session.aliases.set(alias, commandFile.configuration.commandName)
        })
        // We'll use the #session.log method to send a message to the console to verify that the command has been registered.
        session.log("Command Registration", `Registered command listener for ${commandFile.configuration.commandName} in file ${file}!`)
    }
}

// Now we need to make sure that the bot is logged in, we'll use the #login method from the Discord.js package (found at line 18) to login the bot.
// We'll call the #login method on the #session constant variable (which we defined at line 61) then we'll pass in the #token property from the dotenv token variable, once doing so we'll use the #then method to run a function once the bot has logged in.
// Just to make sure there's no issues happening, we'll run a #catch method to catch any errors that may occur, if there are any errors we'll use the #session.log method to send a message to the console.
// We'll also use the #process.exit method to exit the process, this will prevent the bot from running.

// Replace the #FillThisIn_WithYourToken_Please text with your token or it won't work, you can get your token from the Discord Developer Portal, you can find a guide on how to get your token from the Discord Developer Portal here: https://www.youtube.com/watch?v=YEgFvgg7ZPI
session.login(FillThisIn_WithYourToken_Please).then(() => session.log("Token Login", "It looks like you've logged in through the Discord API successfully.")).catch((err) => {
    session.log("Token Login", `It looks like you've failed to log in through the Discord API. Error is provided below.`)
    console.log(`${err}\n`.blue)
    process.exit(1) // We'll use the #exit method from the Node.js process object (https://nodejs.org/api/process.html#process_process_exit_code) to exit the process, this will prevent the bot from running.
})


// Let's set #log inside the #session variable to be the #session.log method, that way we can use the #log method to log our information to the console throughout the bot by using session#log("prefix", "message")
session.log = require('./util/Utils.js').sendConsoleMessage
