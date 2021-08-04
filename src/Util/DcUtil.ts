import { NewsChannel, TextChannel, Webhook } from "discord.js";

export class DcUtil
{
    static async getWebhook(channel: TextChannel | NewsChannel): Promise<Webhook>
    {
        const hooks = await channel.fetchWebhooks();
        const bot = channel.client.user;

        let hook = hooks.find(w => w.channelID == channel.id && w.owner == bot);

        if(!hook)
        {
            hook = await channel.createWebhook('Merarity');
        }
        
        return hook;
    }
}