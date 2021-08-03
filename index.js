const Merarity = require('./dist/index');
const express = require('express');
const http = require('http');

const logger = new Merarity.Logger();

const app = express();
const cfg = new Merarity.MerarityConfig('./config.json', logger);
const bot = new Merarity.Merarity(cfg, logger);

app.get('/', (req,res) => {
    res.send('Merarity is working');
});

// eslint-disable-next-line no-undef
app.listen(process.env.PORT || 5000);
bot.run();

function keepAlive()
{
    const opts = {
        host: 'guarded-mountain-05994.herokuapp.com',
        port: '80',
        path: '/',
    };

    logger.info('Heroku keep-alive GET sent');
    http.get(opts, () => {
        // res.on('data', (chunk) => {

        // });
    });
}

setInterval(() => {
    keepAlive();
}, 10 * 60 * 1000);