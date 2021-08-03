export class Response
{
    status: ResponseStatus;
    message?: string;

    param?: string;

    constructor(status: ResponseStatus, msg?: string, param?: string)
    {
        this.status = status;
        this.message = msg;
        this.param = param;
    }

    static ok()
    {
        return new Response(ResponseStatus.OK);
    }

    static bad(param?: string)
    {
        return new Response(ResponseStatus.BAD_PARAMS, '', param);
    }

    static err(msg?: string)
    {
        return new Response(ResponseStatus.ERROR, msg);
    }

    static empty()
    {
        return new Response(ResponseStatus.EMPTY);
    }
}

export enum ResponseStatus
{
    EMPTY = -1,
    OK = 0,
    BAD_PARAMS = 1,
    ERROR = 2,
}