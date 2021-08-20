import { Service } from "../Model/Service";
import util from 'minecraft-server-util';
import { StatusResponse } from "minecraft-server-util/dist/model/StatusResponse";
import { ActivityService } from "./Activity.service";
import { StatusOptions } from "minecraft-server-util/dist/model/Options";

export class MinecraftService extends Service
{
    async register()
    {
        this.timer = 5000;
    }

    async tick()
    {
        const cfg = this.bot.config.service_mc;

        let message = "";

        try {
            this.logger.trace(`Pinging server at ${cfg.ip}:${this.bot.config.service_mc.port || 25565}...`);
            const status = await this.ping();

            message = cfg.online
                .split('${players}').join("" + (status.onlinePlayers ?? '?'))
                .split('${maxplayers}').join("" + (status.maxPlayers ?? '?'))
                
            this.logger.trace(`Server is up: ${status.onlinePlayers}/${status.maxPlayers}`);
        } catch (error) {
            this.logger.trace(`Error pinging server (${error})`)
            message = cfg.offline
        }

        this.manager.get(ActivityService)?.setText(message);
    }

    async ping()
    {
        return new Promise<StatusResponse>((resolve, reject) => {
            const opts: StatusOptions = {
                enableSRV : true,
                timeout: 4000,
                port: this.bot.config.service_mc.port || 25565
            };

            // this.logger.trace(`Pinging ${this.bot.config.service_mc.ip}:${opts.port}...`)

            util.status(
                this.bot.config.service_mc.ip,
                opts
            ).then(r => resolve(r))
            .catch(e => reject(e));
        })
    }
}