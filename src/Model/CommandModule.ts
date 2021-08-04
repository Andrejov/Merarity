import { PermissionString } from "discord.js";
import { Command } from "./Command";
import { Logger } from "../Util/Logger";

export interface ICommandModule
{
    perms?: PermissionString[];

    commands(): Command[]
    logger?: Logger;
}