const Merarity = require('./dist/index');

const cfg = new Merarity.MerarityConfig('./config.json');
const bot = new Merarity.Merarity(cfg);

bot.run();