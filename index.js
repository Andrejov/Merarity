const Merarity = require('./dist/index');

const logger = new Merarity.Logger();

const cfg = new Merarity.MerarityConfig('./config.json', logger);
const bot = new Merarity.Merarity(cfg, logger);

bot.run();