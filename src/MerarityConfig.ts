import fs from 'fs';
import { Logger } from './Logger';

export class MerarityConfig
{
    auth = {
        discordkey: ""
    }

    logger: Logger;

    loadJSON(path: string)
    {
        if(fs.existsSync(path))
        {
            const contents = fs.readFileSync(path).toString();

            const json = JSON.parse(contents);

            this.auth.discordkey = json.auth.discordkey;
        }else{
            this.logger.warn('Config file does not exist');
        }
    }

    loadEnv()
    {
        this.auth.discordkey = process.env.DISCORDKEY ?? this.auth.discordkey;
    }

    constructor(path?: string, logger?: Logger)
    {
        this.logger = logger ?? new Logger();

        if(path)
        {
            this.loadJSON(path);
        }

        this.loadEnv();
    }
}