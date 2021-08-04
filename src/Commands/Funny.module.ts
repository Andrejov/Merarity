import { DMChannel, User } from "discord.js";
import { Command } from "../Model/Command";
import { ICommandModule } from "../Model/CommandModule";
import { DcUtil } from "../Util/DcUtil";
import { Response } from "../Model/Response";

export class FunnyModule implements ICommandModule
{
    commands() {
        return [
            new Command(['impersonate', 'imp', 'fake', 'fk'],
                ['mention', 'bigtext'], async(msg, bot, args) => {
                    if(msg.channel instanceof DMChannel)
                    {
                        return Response.bad('', 'This command is disabled for this channel type');
                    }

                    const wh = await DcUtil.getWebhook(msg.channel);

                    const user = args.values[0] as User;
                    const member = msg.guild?.member(user);

                    await wh.send(args.values[1].trim(), {
                        username: (member && member.nickname) ? member.nickname : user.username,
                        avatarURL: user.avatarURL() ?? undefined
                    })

                    return Response.delete();
                })
        ]
    }


}