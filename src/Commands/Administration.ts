import { Message } from "discord.js";
import { Command } from "../Command";
import { ICommandModule } from "../CommandModule";
import { Embed } from "../Embed";
import { Merarity } from "../Merarity";
import { Response } from "../Response";

export class Administration implements ICommandModule
{
    commands(): Command[] {
        return [
            new Command('ping', async (msg: Message, bot: Merarity, args: string[]) => {
                await Embed.send(msg.channel,
                    [
                        `Latency:`,
                        `End-to-end: ${Date.now() - msg.createdTimestamp} ms`,
                        `Websocket: ${bot.client.ws.ping} ms`
                    ],
                    'Pong');
                return Response.ok();
            })
        ]
    }

}