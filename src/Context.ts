import { Message, TextChannel, VoiceChannel } from "discord.js";
import { Merarity } from "./Merarity";

export class Context
{
    message: Message
    pattern: ContextElement[];

    valid: boolean = true;
    invalid?: number;
    values: any[] = [];
    command?: string;

    constructor(msg: Message, pattern: ContextElement[])
    {
        this.message = msg;
        this.pattern = pattern;
    }

    async parse(bot: Merarity)
    {
        const clean = this.message.content.trim().substr(1);

        const split: string[] = [];
        let quote = false;
        let word = "";
        clean.split('').forEach(ch => {
            if(ch == `"`) quote = !quote;

            if(!quote && ch == " ")
            {
                split.push(word);
                word = "";
                return;
            }

            word = word + ch;
        })
        split.push(word);

        this.command = split.shift() ?? '';

        this.pattern.forEach((p, i) => {
            const optional = p.startsWith('o');
            if(optional) p = p.substr(1) as ContextElement;

            const raw = split[i];

            if(raw != undefined)
            {
                if(p == 'text')
                {
                    return this.values.push(raw);
                }else if(p == 'number')
                {
                    const nan = +raw;
                    if(isNaN(nan))
                    {
                        this.valid = false;
                        this.invalid = i;
                    }else{
                        return this.values.push(nan);
                    }
                }else if(p == 'mention')
                {
                    const user = this.getUserFromMention(raw, bot);

                    if(user)
                    {
                        return this.values.push(user);
                    }else{
                        this.valid = false;
                        this.invalid = i;
                    }
                }else if(p == 'channel')
                {
                    const ch = bot.client.channels.cache
                        .filter(c => c.type == 'text' || c.type == 'voice')
                        .find(c => (c as TextChannel | VoiceChannel).name.trim().toLowerCase() == raw.trim().toLowerCase())

                    if(ch)
                    {
                        return this.values.push(ch);
                    }else{
                        this.valid = false;
                        this.invalid = i;
                    }
                }
            }else{
                if(optional)
                {
                    this.values.push(undefined);
                    return;
                }
            }
            this.valid = false;
            this.invalid = i;
            this.values.push(undefined);
        })
    }
    
    private getUserFromMention(mention: string, bot: Merarity) {
        if (!mention) return;
    
        if (mention.startsWith('<@') && mention.endsWith('>')) {
            mention = mention.slice(2, -1);
    
            if (mention.startsWith('!')) {
                mention = mention.slice(1);
            }
    
            return bot.client.users.cache.get(mention);
        }else{
            return undefined;
        }
    }
}

export type ContextElement = `${ContextElementOptional}${ContextElementType}`;

export type ContextElementOptional = '' | 'o';

export type ContextElementType =
    'number' |
    'text' |
    'mention' |
    'channel';