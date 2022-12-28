// Here we'll setup a test command as a basic example of how to create a command.

// We'll be doing a similar model to how we have it in the ../events/commandListener.js file but not exactly the same.
// We'll be using the module.exports method to export the command.
module.exports = {
    // Let's start by creating our configuration object.
    configuration: {
        commandName: 'test', // This is the name of the command.
        aliases: ['example'], // This is an array of aliases for the command.
        description: 'This is an example command.', // This is the description of the command.
        usage: 'example', // This is the usage of the command.
        devOnly: true // This is a boolean which will check if the command is a developer only command.
    },
    // Now let's create our run function, this is where our command will run when it's called for by the user.
    run: async (session, message, args) => {
        // Now that we're in our run function, we can do whatever we want. For this example, we'll just reply to the message with "This is an example command."
        message.reply('This is an example command.')
    }
}