import { Message } from "discord.js";
import { Context, ContextElement } from "./Context";
import { Merarity } from "./Merarity";
import { Response } from "./Response";

export class Command
{
    aliases: string[] = [];
    syntax: ContextElement[];
    
    callback: (msg: Message, bot: Merarity, args: Context) => Promise<Response>;

    constructor(aliases: string[] | string, syntax: ContextElement[], 
        callback: (msg: Message, bot: Merarity, args: Context) => Promise<Response>)
    {
        this.aliases = Array.isArray(aliases) ? aliases : [aliases];
        this.syntax = syntax;
        this.callback = callback;
    }
}