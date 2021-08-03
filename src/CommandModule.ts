import { Command } from "./Command";
import { Logger } from "./Logger";

export interface ICommandModule
{
    commands(): Command[]
    logger?: Logger;
}