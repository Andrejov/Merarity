import { Client, Message } from "discord.js";
import { Logger } from "./Logger";
import { MerarityConfig } from "./MerarityConfig";

export class Merarity
{
    logger: Logger;
    config: MerarityConfig;

    client: Client;

    constructor(config: MerarityConfig,logger?: Logger)
    {
        this.logger = logger ?? new Logger();
        this.config = config;

        this.client = new Client();

        this.client.on('ready', this.onReady.bind(this));
        this.client.on('message', this.onMessage.bind(this));
    }

    run()
    {
        this.logger.info("Starting Merarity bot...");
        this.client.login(this.config.auth.discordkey);
    }

    private async onReady(): Promise<void>
    {
        this.logger.info("Bot ready.")
    }

    private async onMessage(msg: Message): Promise<void>
    {
        
    }
}