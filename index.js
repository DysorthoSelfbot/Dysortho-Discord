const Discord = require('v11-discord.js');
const fetch = require('node-fetch');

const client = new Discord.Client()

var config = require('./config.json')

client.login(config.token)

client.on("message", async (message) => {
    if (message.author.id !== client.user.id) return

    console.log(typeof message.content)

    if (typeof message.content === "string") {

        var res = await fetch("https://orthographe.reverso.net/api/v1/Spelling", {
            method: "POST",
            headers: {
                'content-type': 'application/json',
                "referer": "https://www.reverso.net/",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36"
            },
            body: JSON.stringify({
                "interfaceLanguage": "fr",
                "language": "fra",
                "text": message.content,
                "autoReplace": true,
                "locale": "Indifferent",
                "generateRecommendations": false, "generateSynonyms": false, "getCorrectionDetails": true,
                "origin": "interactive"
            })
        })
        res = await res.json()
        console.log(res)

        res.corrections.forEach(async c =>console.log(`[\x1b[33m${c.type}\x1b[0m] \x1b[31m"${c.longDescription}\x1b[0m`) ^ console.table([["Faute", c.mistakeText], ["Correction", c.correctionText], ["Réponse(s) possible(s)", await c.suggestions.map(s => s.text)]]))

        message.edit(res.text)

    }
}).on('ready', () => {
    console.log(client.user.tag)
})