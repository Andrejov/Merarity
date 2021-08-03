import fs from 'fs';

export class MerarityConfig
{
    auth = {
        discordkey: ""
    }

    load(path: string)
    {
        const contents = fs.readFileSync(path).toString();

        const json = JSON.parse(contents);

        this.auth.discordkey = json.auth.discordkey;
    }

    constructor(path?: string)
    {
        if(path)
        {
            this.load(path);
        }
    }
}