import { Command } from "./Command";

export interface ICommandModule
{
    commands(): Command[]
}