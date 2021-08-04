import { DMChannel, Message, NewsChannel, TextChannel } from "discord.js";

export class Embed
{
    static async send(channel: TextChannel | DMChannel | NewsChannel | Message, text: string | string[], title?: string)
    {
        if(channel instanceof Message)
        {
            channel = channel.channel;
        }

        await channel.send({
            embed: {
                color: 0xaa00aa,
                description: Array.isArray(text) ? text.join('\r\n') : text,
                title: title ?? undefined
            }
        })
    }
}