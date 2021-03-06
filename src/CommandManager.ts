import { DMChannel, Message } from "discord.js";
import { Command } from "./Model/Command";
import { ICommandModule } from "./Model/CommandModule";
import { AdministrationModule } from "./Commands/Administration.module";
import { FunnyModule } from "./Commands/Funny.module";
import { UtilityModule } from "./Commands/Utility.module";
import { Context } from "./Context";
import { Embed } from "./Util/Embed";
import { Logger } from "./Util/Logger";
import { Merarity } from "./Merarity";
import { Response, ResponseStatus } from "./Model/Response";

export class CommandManager
{
    logger: Logger;
    bot: Merarity;

    prefix: string = ">";

    commands: Command[] = [];
    aliases: {
        [key: string] : Command
    } = {};

    constructor(bot: Merarity, logger?: Logger)
    {
        this.bot = bot;
        this.logger = logger ?? new Logger();
    }

    load(): void
    {
        this.logger.info("Initializing command manager")
        this.commands = [];
        this.aliases = {};

        this.loadModules();

        this.refreshAliases();

        this.logger.info(`Loaded ${this.commands.length} commands and ${Object.keys(this.aliases).length} aliases`)
    }

    loadModules()
    {
        this.loadModule(new AdministrationModule());
        this.loadModule(new UtilityModule());
        this.loadModule(new FunnyModule());
    }

    loadModule(module: ICommandModule)
    {
        module.commands()
            .map(cmd => {
                if(module.perms)
                {
                    cmd.callback = async(msg, bot, args) => {
                        const req = module.perms?.find(perm => !msg.member?.hasPermission(perm));
                        if(req)
                        {
                            return Response.perms(req)
                        }

                        return cmd.callback(msg,bot,args);
                    };
                }
                return cmd;
            })
            .forEach(cmd => this.loadCommand(cmd));
    }

    loadCommand(cmd: Command)
    {
        this.commands.push(cmd);
    }

    refreshAliases()
    {   
        this.aliases = {};

        this.commands.forEach(cmd => {
            cmd.aliases.forEach(alias => {
                this.aliases[alias] = cmd;
            })
        })
    }

    getCommand(msg: Message): Command | undefined
    {
        const clean = msg.content.trim();

        if(clean.length > 1 && clean.startsWith(this.prefix))
        {
            this.logger.trace(`Received valid prefix`);
            const word = clean.substr(1).split(' ')[0].toLowerCase();

            if(this.aliases[word])
            {
                return this.aliases[word];
            }
        }

        return undefined;
    }

    async handleCommand(msg: Message, cmd?: Command): Promise<Response>
    {
        if(!cmd) cmd = this.getCommand(msg);

        if(cmd)
        {
            // const clean = msg.content.trim();
            // const args = clean.split(' ');
            const ctx = new Context(msg, cmd.syntax);

            await ctx.parse(this.bot);

            if(!ctx.valid)
            {
                return Response.bad(
                    ctx.invalid!=undefined ? cmd.syntax[ctx.invalid] : '',
                    `Use: ${this.prefix}${cmd.aliases[0]} ` + 
                    cmd.syntax.map(p => p.startsWith('o') ? `[${p.substr(1)}]` : `<${p}>`)
                        .map((p,i) => i==ctx.invalid ? `**${p}**` : p)    
                        .join(' ')
                );
            }

            return await cmd.callback(msg, this.bot, ctx);
        }

        return Response.empty();
    }

    async onMessage(msg: Message): Promise<boolean>
    {
        if(msg.author.bot) return false;
        if(msg.channel instanceof DMChannel && msg.content.trim().startsWith(this.prefix))
        {
            await msg.react('??????');
            await Embed.send(msg, [
                `Unfortunately, this bot is disabled for DM channels`,
                `You can only use Merarity commands on connected guilds`
            ], `Unsupported`);
            return false;
        }

        const cmd = this.getCommand(msg);

        if(cmd)
        {

            this.logger.trace(`Handling command ${cmd.aliases[0]}`)
            let response;

            try {
                response = await this.handleCommand(msg, cmd);
            } catch (error) {
                this.logger.warn(`Unhandled exception executing command ${cmd.aliases[0]}`);
                this.logger.warn(`Contents: ${error}`);
                response = Response.err('Unknown error');
            }

            if(response.status == ResponseStatus.OK)
            {
                await msg.react('????');
            }else if(response.status == ResponseStatus.BAD_PARAMS)
            {
                await msg.react('??????');
                await Embed.send(msg.channel, [
                    'Your command syntax was wrong',
                    `Bad parameter: ${response.param ?? 'UNKNOWN'}`,
                    `${response.message ?? ''}`
                ], 'Bad request');
            }else if(response.status == ResponseStatus.INSUFFICIENT_PERMS)
            {
                await msg.react('???');
                await Embed.send(msg.channel, [
                    'Unfortunately, you dont have enough permissions to execute this command',
                    `Missing permission: **${response.param ?? 'UNKNOWN'}**`
                ], 'Insufficient permissions');
            }else if(response.status == ResponseStatus.ERROR)
            {
                await msg.react('???');
                await Embed.send(msg.channel, [
                    'Unfortunately, bot has encountered an (yet) unknown error',
                    'There is nothing we can do about it now',
                    response.message ?? '',
                ], 'Error');
            }else if(response.status == ResponseStatus.DELETE)
            {
                await msg.delete();
            }

            return true;
        }

        return false;
    }
}