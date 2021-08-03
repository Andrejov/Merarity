import { Message } from "discord.js";
import { Command } from "./Command";
import { ICommandModule } from "./CommandModule";
import { Administration } from "./Commands/Administration";
import { Embed } from "./Embed";
import { Logger } from "./Logger";
import { Merarity } from "./Merarity";
import { Response, ResponseStatus } from "./Response";

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

        this.loadModule(new Administration());

        this.refreshAliases();

        this.logger.info(`Loaded ${this.commands.length} commands and ${Object.keys(this.aliases).length} aliases`)
    }

    loadModule(module: ICommandModule)
    {
        module.commands().forEach(cmd => this.loadCommand(cmd));
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
            const clean = msg.content.trim();
            const args = clean.split(' ');

            return cmd.callback(msg, this.bot, args);
        }

        return Response.empty();
    }

    async onMessage(msg: Message): Promise<boolean>
    {
        const cmd = this.getCommand(msg);

        if(cmd)
        {
            this.logger.trace(`Handling command ${cmd.aliases[0]}`)
            let response;

            try {
                response = await this.handleCommand(msg, cmd);
            } catch (error) {
                this.logger.warn(`Unhandled exception executing command ${cmd.aliases[0]}`);
                response = Response.err('Unknown error');
            }

            if(response.status == ResponseStatus.OK)
            {
                await msg.react('🔥');
            }else if(response.status == ResponseStatus.BAD_PARAMS)
            {
                await msg.react('⚠️');
                // Embed.send(msg.channel, '')
            }else if(response.status == ResponseStatus.ERROR)
            {
                await msg.react('⛔');
            }

            return true;
        }

        return false;
    }
}