import { Client, Message } from "discord.js";
import { CommandManager } from "./CommandManager";
import { Logger } from "./Util/Logger";
import { MerarityConfig } from "./MerarityConfig";
import { ServiceManager } from "./ServiceManager";

export class Merarity
{
    logger: Logger;
    config: MerarityConfig;

    client: Client;

    commandManager: CommandManager;
    serviceManager: ServiceManager;

    constructor(config: MerarityConfig, logger?: Logger)
    {
        this.logger = logger ?? new Logger();
        this.config = config;

        this.client = new Client();

        this.commandManager = new CommandManager(this, logger?.child('MGR:CMD'));
        this.serviceManager = new ServiceManager(this, logger?.child('MGR:SVC'));

        this.client.on('ready', this.onReady.bind(this));
        this.client.on('message', this.onMessage.bind(this));
    }

    async run()
    {
        this.logger.info("Starting Merarity bot...");
        this.client.login(this.config.auth.discordkey);

        this.serviceManager.load();

        this.commandManager.load();
    }

    private async onReady(): Promise<void>
    {
        this.logger.info("Bot ready.")
        await this.serviceManager.register();
    }

    private async onMessage(msg: Message): Promise<void>
    {
        this.logger.trace(`Received new message from ${msg.author}`)
        await this.commandManager.onMessage(msg);
    }
}