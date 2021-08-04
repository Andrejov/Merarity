export class Logger
{

    parent?: Logger;
    sub?: string;

    loggingLevel: LogLevel = LogLevel.DEBUG;

    logLevelString = [
        ' ERR',
        'WARN',
        'INFO',
        ' DBG',
        'TRACE'
    ];

    child(name: string)
    {
        const l = new Logger();
        l.parent = this;
        l.sub = name;
        return l;
    }

    setLoggingLevel(level: LogLevel)
    {
        if(this.parent)
        {
            this.parent.setLoggingLevel(level);
        }else{
            this.loggingLevel = level;
        }
    }

    log(message: string, level?: LogLevel)
    {
        if(this.parent)
        {
            this.parent.log(`..${(this.sub ?? '').padEnd(7, '.')}.. ${message}`, level);
        }else{
            level = level ?? 2
            
            if(level > this.loggingLevel) return;

            console.log(` ${this.logLevelString[level]}: ${message}`)
            return message;
        }
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