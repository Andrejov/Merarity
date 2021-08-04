import { VoiceChannel } from "discord.js";
import { Command } from "../Model/Command";
import { ICommandModule } from "../Model/CommandModule";
import { Embed } from "../Util/Embed";
import { Logger } from "../Util/Logger";
import { Response } from "../Model/Response";

export class UtilityModule implements ICommandModule
{
    perms = [];

    commands(): Command[] {
        return [
            new Command('group', ['channel'], async (msg, bot, args) => {
                if(!msg.member?.hasPermission('MOVE_MEMBERS'))
                {
                    return Response.perms('MOVE_MEMBERS');
                }

                const vc = args.values[0] as VoiceChannel;

                let moved = 0;

                if(msg.guild?.channels)
                {
                    for(var ch of msg.guild?.channels.cache.array())
                    {
                        if(ch.type == 'voice')
                        {
                            for(var m of ch.members.array())
                            {
                                if(await m.voice.setChannel(vc))
                                {
                                    moved += 1;
                                }
                            }
                        }
                    }
                }else{
                    return Response.err();
                }

                Embed.send(msg.channel, [
                    `Moved ${moved} members to ${vc.name}`
                ], 'Group successful')

                return Response.ok();
            }),
        ]
    }
}