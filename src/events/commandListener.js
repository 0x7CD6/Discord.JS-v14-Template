// Now that we're in our command listener event file, we need to make a function which will register all of our event listeners.

// We need to add a section inside the module exports for defining which event listener we're exporting. 
// We can do this by adding a "configuration" property to the module exports object and setting it to an object with the event name and if the event is a developer only event.
// We'll also add a "run" function to the module exports object and set it to a function which will run when the event listener is triggered.
module.exports = {
    configuration: {
        eventName: 'messageCreate',
        devOnly: false
    },
    // Now we need to define our event listener.
    // We'll do this by adding a "run" property to the module exports object and setting it to a function which will run when the event listener is triggered.
    run: async (session, message) => {
        // Now that we're in our 'messageCreate' event for the Command Listener event file, we need to check if the message is a command and begins with our prefix (session#prefix).
        // We can do this by checking if the message content starts with the prefix. If it does, we'll run the command, if not we'll return and do nothing.
        // We'll do this by using a switch statement, which will check if the message content starts with the prefix.
        // If it's true, we'll run the command, if it's false, we'll return. (It should often be a break statement, but since we're returning, we don't need it.)
        switch (message.content.startsWith(session.prefix)) {
            case true:
                // Let's make a variable for the command.
                // We can do this by splitting the message content by spaces and getting the first element.
                const commandName = message.content.split(' ')[0].slice(session.prefix.length)

                // We need to now make an arguments variable by splitting the message content by spaces and getting all elements except the first one.
                const args = message.content.split(' ').slice(1)

                // Now we need to make two constant variables which will get the command from the commands collection and the aliases from the aliases collection from the #session object we passed in.
                const command = session.commands.get(commandName)
                const alias = session.aliases.get(commandName)

                // Now we need to check if the command is either part of the command or aliases collection, we can do this by checking if the command and alias variable is undefined.
                // If both are undefined, we'll return and do nothing, otherwise we'll run the command.
                // the && operator will check if both variables are undefined, if they are, it'll return true, if not, it'll return false.
                if (command === undefined && alias === undefined) return

                // Now that we've verified the command is valid, we need to check if it's a command or an alias, we'll do this in a switch case.
                switch(command === undefined) {
                    case true:
                        // Because this is true, what that means is that the command variable is undefined, so we'll get the command from the aliases collection and make it a constant variable so we can execute the command.
                        // We'll run our #checks function which will check if the user is a bot, if the channel is a DM, if the message has a webhook ID, if the message is a system message, if the message is a partial, and if the command is a developer only command.
                        checks(session.commands.get(alias), session, message, args)
                        break // We need to add a break statement so we don't run the command twice.
                    case false:
                        // Because this is false, what that means is that the command variable is not undefined, so we'll get the command from the commands collection and make it a constant variable so we can execute the command.
                        // We'll run our #checks function which will check if the user is a bot, if the channel is a DM, if the message has a webhook ID, if the message is a system message, if the message is a partial, and if the command is a developer only command.
                        checks(session.commands.get(commandName), session, message, args)
                        break // We need to add a break statement so we don't run the command twice.
                }
                break
            case false: return 
        }
    }
}


// Due to us being lazy, we want to just make a function which will register all of our checks to make sure the user isn't a bot and stuff like that.
function checks(command, session, message, args) {
    switch(message) {
        case message.author.bot: // If the author of the message is a bot, we'll return so the command doesn't run.
        case message.channel.type === 'DM': // If the channel type is a DM, we'll return so the command doesn't run.
        case message.webhookID: // If the message has a webhook ID, we'll return so the command doesn't run.
        case message.system: // If the message is a system message, we'll return so the command doesn't run.
        case message.partial: // If the message is a partial, we'll return so the command doesn't run.
            return
    }

    // Now we need to check if the command is a developer only command.
    // We can do this by checking if the command is a developer only command and if the author of the message is not a developer.
    // If both are true, we'll return so the command doesn't run.

    // The reason why we only use the configuration#devOnly without anything after it is because it's a boolean, if it's true it'll just return true, if it's false it'll return false.
    // We can use ! in a boolean at the start to inverse it so it checks for the opposite.
    if (command.configuration.devOnly && !session.developers.includes(message.author.id)) return message.reply('This command is a developer only command, you cannot run it.').then(msg => setTimeout(() => msg.delete(), 5 * 1000)).catch(err => console.error(err))
    // To explain a bit more, once we reply to the message, we'll delete the message after 5 seconds. We can do this by using the setTimeout function and passing in a function which will delete the message and a time in milliseconds, which is 5 seconds.
    // For your convincence, I've given a very simple base for converting seconds to milliseconds, 1 second = 1000 milliseconds, in this case in the setTimeout function, we're passing in 5 * 1000, which is 5 seconds in milliseconds.

    // Now we run the command by passing in the session, message, and args variables.
    command.run(session, message, args)
}