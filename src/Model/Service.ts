import { Logger } from "../Util/Logger";
import { Merarity } from "../Merarity";
import { ServiceManager } from "../ServiceManager";

export class Service
{
    logger: Logger;
    bot: Merarity;
    manager: ServiceManager;

    timer: boolean | number = false;

    constructor(bot: Merarity | ServiceManager, logger?: Logger)
    {
        if(bot instanceof Merarity)
        {
            this.bot = bot;
        }else{
            this.bot = bot.bot;
            logger = logger ?? bot.logger;
        }

        this.manager = this.bot.serviceManager;
        this.logger = (logger ?? new Logger()).child(`SRV:${this.getName().substr(0,5)}`);
    }

    getName(): string 
    {
        return this.constructor.name;
    }

    async register(): Promise<void>
    {
        // To override
    }

    async unregister(): Promise<void>
    {
        // To override
    }

    async tick(): Promise<void>
    {
        // To override
    }
}