// script.js

function getCurrentDateTime() {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace('T', ' ');
}

console.log('Current Date and Time (UTC):', getCurrentDateTime());