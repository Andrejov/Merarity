import { Logger } from "./Util/Logger";
import { Merarity } from "./Merarity";
import { Service } from "./Model/Service";
import { ActivityService } from "./Services/Activity.service";
import { MinecraftService } from "./Services/Minecraft.service";

export class ServiceManager
{
    logger: Logger
    bot: Merarity;
    
    services: Service[] = [];

    timers: NodeJS.Timer[] = [];

    constructor(bot: Merarity, logger?: Logger)
    {
        this.bot = bot;
        this.logger = logger ?? new Logger();
    }

    load()
    {
        this.services = [];
        this.services.push(new ActivityService(this));
        // this.services.push(new MinecraftService(this));
    }

    async register()
    {
        this.logger.debug(`Starting services...`)
        for(let serv of this.services)
        {
            this.logger.debug(`Registering service ${serv.getName().toUpperCase()}`);
            await serv.register();

            if(typeof serv.timer == 'number')
            {
                this.timers.push(setInterval(serv.tick.bind(serv), serv.timer));
            }
        }
        this.logger.info(`Registered ${this.services.length} services`);
    }

    async unregister()
    {
        this.logger.debug(`Stopping services...`)

        this.timers.forEach(timer => {
            clearInterval(timer);
        })

        for(let serv of this.services)
        {
            this.logger.debug(`Unregistering service ${serv.getName().toUpperCase()}`)

            await serv.unregister();
        }
        this.logger.info(`Unregistered ${this.services.length} services`);
    }

    get<T extends Service>(constructor: {new(bot: Merarity | ServiceManager, logger?: Logger): T}): T | undefined
    {
        const find = this.services.find(s => s instanceof constructor);
        return find ? find as T : undefined;
    }
}