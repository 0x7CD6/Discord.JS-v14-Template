// We're going to make some changes to how we console log our information.
// We're going to make a function which will log our information to the console.
// We'll call this function "sendConsoleMessage" because it will log our information to the console.
function sendConsoleMessage(prefix, message) {
    // Just aa clone from the above function so not much comments needed
    const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')

    // We'll use the #console.log method to log the message to the console.
    console.log(`${date}: `.red + `${prefix}`.yellow + ` | `.green + `${message}`.cyan)
}

// We'll export the function so we can use it in other files.
module.exports = {
    sendConsoleMessage
}