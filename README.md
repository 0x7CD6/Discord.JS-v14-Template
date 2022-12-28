<!-- Let's make a readme file for our layout for the discord bot in discord.js V.14 -->
# Discord.js V.14 Bot Layout
I'm too lazy to write this, this is just a template for a discord bot in discord.js V.14, I'll add more stuff later when I'm not lazy.

## How to use
1. Clone the repo
2. Run `npm install`
3. Create a file called `.env` and put your discord token inside it 
4. Run `node ./src/index.js` to start the bot

## How to add commands
1. Create a file in the `./src/commands` folder
2. Copy the code from `./src/commands/exampleCommand.js` and paste it into your new file
3. Change the name of the command & aliases in the `module.exports` object at the top of the file
4. Change the code in the `run` function to do whatever you want the command to do

## How to add events
1. Create a file in the `./src/events` folder
2. Copy the code from `./src/events/commandListener.js` and paste it into your new file
3. Change the name of the event in the `module.exports` object at the top of the file
4. Change the code in the `run` function to do whatever you want the event to do

## How to add slash commands
I didn't add support for this because quite frankly it's a pain in the ass to do so... have fun doing it yourself :)