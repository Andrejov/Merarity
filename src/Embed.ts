import { DMChannel, NewsChannel, TextChannel } from "discord.js";

export class Embed
{
    static async send(channel: TextChannel | DMChannel | NewsChannel, text: string | string[], title?: string)
    {
        await channel.send({
            embed: {
                color: 0xaa00aa,
                description: Array.isArray(text) ? text.join('\r\n') : text,
                title: title ?? undefined
            }
        })
    }
}