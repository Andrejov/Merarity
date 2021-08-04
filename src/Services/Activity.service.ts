import { Service } from "../Model/Service";

export class ActivityService extends Service
{
    status = {
        text: "Work in progress...",
        link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    };

    private lastStatus = {
        text: "",
        link: "",
    };

    async register()
    {
        this.timer = 500;
    }

    async tick()
    {
        const changed = (JSON.stringify(this.status) != JSON.stringify(this.lastStatus));

        if(changed)
        {
            this.logger.info('Updating activity status');

            this.lastStatus = JSON.parse(JSON.stringify(this.status));
            
            await this.bot.client.user?.setActivity({
                type: 'STREAMING',
                name: this.status.text,
                url: this.status.link
            })
        }
    }

    setText(text: string)
    {
        this.status.text = text;
    }
    setLink(link: string)
    {
        this.status.link = link;
    }
}