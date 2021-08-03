import { Message } from "discord.js";
import { Merarity } from "./Merarity";
import { Response } from "./Response";

export class Command
{
    aliases: string[] = [];
    
    callback: (msg: Message, bot: Merarity, args: string[]) => Promise<Response>;

    constructor(aliases: string[] | string, 
        callback: (msg: Message, bot: Merarity, args: string[]) => Promise<Response>)
    {
        this.aliases = Array.isArray(aliases) ? aliases : [aliases];
        this.callback = callback;
    }
}