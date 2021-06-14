const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const token = '';
const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (strContains(msg.text, '/saymeow')) {
        sayMeow(chatId);

        return;
    }

    if (strContains(msg.text, '/link')) {
        link(chatId, msg.text);

        return;
    }

    if (strContains(msg.text, '/unlink')) {
        unlink(chatId, msg.text);

        return;
    }

    if (strContains(msg.text, '/')) {
        getLink(chatId, msg.text);
    }
});

function strContains(str, search) {
    return str.indexOf(search) !== -1;
}

function sayMeow(chatId) {
    bot.sendMessage(chatId, 'meow');
}

function link(chatId, message) {
    const arr = message.split(' ');

    if (!arr[1] || !arr[2]) {
        return;
    }

    fs.readFile('links.json', 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }

        var links = JSON.parse(data.toString());

        links[arr[1]] = arr[2];
        const dataToSave = JSON.stringify(links);
        fs.writeFile('links.json', dataToSave, (err) => {
            if (err) {
                throw err;
            }

            console.log("JSON data is saved.");
        });
    });
}

function unlink(chatId, message) {
    const arr = message.split(' ');

    if (!arr[1]) {
        return;
    }

    fs.readFile('links.json', 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }

        var links = JSON.parse(data.toString());

        delete links[arr[1]];
        const dataToSave = JSON.stringify(links);
        fs.writeFile('links.json', dataToSave, (err) => {
            if (err) {
                throw err;
            }

            console.log("JSON data is saved.");
        });
    });
}

function getLink(chatId, message) {
    const key = message.replace('/', '');
    fs.readFile('links.json', 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }

        var links = JSON.parse(data.toString());
        if (typeof (links[key]) != "undefined" && links[key] !== null) {
            bot.sendMessage(chatId, links[key]);
        }
    });
}