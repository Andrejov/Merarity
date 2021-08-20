import fs from 'fs';
import { Logger } from './Util/Logger';

export class MerarityConfig
{
    auth = {
        discordkey: ""
    }
    service_mc = {
        ip: "",
        offline: "",
        online: "",
        port: 0,
    }

    logger: Logger;

    loadJSON(path: string)
    {
        if(fs.existsSync(path))
        {
            const contents = fs.readFileSync(path).toString();

            const json = JSON.parse(contents);

            const sections: ConfigSection[] = ['auth', 'service_mc']

            sections.forEach(sect => {
                if(json[sect])
                {
                    this.logger.trace(`Loading ${sect.toUpperCase()} config`);
                    Object.assign(this[sect], json[sect]);
                }
            })
        }else{
            this.logger.warn(`Config file ${path.split('/').splice(-2).join('/')} does not exist`);
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

export type ConfigSection = 'auth' | 'service_mc';