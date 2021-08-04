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

    static bad(param?: string, msg?: string)
    {
        return new Response(ResponseStatus.BAD_PARAMS, msg ?? '', param);
    }

    static err(msg?: string)
    {
        return new Response(ResponseStatus.ERROR, msg);
    }

    static empty()
    {
        return new Response(ResponseStatus.EMPTY);
    }

    static perms(perm?: string)
    {
        return new Response(ResponseStatus.INSUFFICIENT_PERMS, '', perm);
    }

    static delete()
    {
        return new Response(ResponseStatus.DELETE);
    }
}

export enum ResponseStatus
{
    EMPTY = -1,
    OK = 0,
    BAD_PARAMS = 1,
    ERROR = 2,
    INSUFFICIENT_PERMS = 3,
    DELETE = 4,
}