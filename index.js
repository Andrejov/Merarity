const Merarity = require('./dist/index');
const express = require('express');

const logger = new Merarity.Logger();

const app = express();
const cfg = new Merarity.MerarityConfig('./config.json', logger);
const bot = new Merarity.Merarity(cfg, logger);

app.get('', (req,res) => {
    res.writeHead(200);
    res.write('Merarity is working');
});

// eslint-disable-next-line no-undef
app.listen(process.env.PORT || 5000);

bot.run();