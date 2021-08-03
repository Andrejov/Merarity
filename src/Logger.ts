export class Logger
{

    logLevelString = [
        ' ERR',
        'WARN',
        'INFO',
        ' DBG',
        'TRACE'
    ];

    log(message: string, level?: LogLevel)
    {
        level = level ?? 2
        console.log(` ${this.logLevelString[level]}: ${message}`)
        return message;
    }

    trace(msg: string)
    {
        return this.log(msg, LogLevel.TRACE);
    }

    debug(msg: string)
    {
        return this.log(msg, LogLevel.DEBUG);
    }

    info(msg: string)
    {
        return this.log(msg, LogLevel.INFO);
    }

    warn(msg: string)
    {
        return this.log(msg, LogLevel.WARN);
    }

    error(msg: string)
    {
        return this.log(msg, LogLevel.ERROR);
    }
}

export enum LogLevel
{
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3,
    TRACE = 4
}