import { Message } from "discord.js";
import { Command } from "../Model/Command";
import { ICommandModule } from "../Model/CommandModule";
import { Context } from "../Context";
import { Embed } from "../Util/Embed";
import { Merarity } from "../Merarity";
import { Response } from "../Model/Response";

export class AdministrationModule implements ICommandModule
{
    commands(): Command[] {
        return [
            new Command('ping', [], async (msg: Message, bot: Merarity, args: Context) => {
                await Embed.send(msg.channel,
                    [
                        `Latency:`,
                        `End-to-end: ${Date.now() - msg.createdTimestamp} ms`,
                        `Websocket: ${bot.client.ws.ping} ms`
                    ],
                    'Pong');
                return Response.ok();
            }),
            new Command(['help', 'info'], [], async (msg, bot, args) => {
                await Embed.send(msg,
                    [
                        `Merarity is a custom bot built for the **nes.** server`,
                        ``,
                        `More info: [Github repository](https://github.com/Andrejov/Merarity)`
                    ])

                return Response.ok();
            })
        ]
    }

}