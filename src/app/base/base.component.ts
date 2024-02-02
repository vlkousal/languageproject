import {Component} from '@angular/core';

@Component({
    selector: 'app-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.css']
})

export class BaseComponent {

    sessionID = localStorage.getItem("sessionId");
    username: string | null = null;

    async ngOnInit() {
        this.username = await this.sendTokenToCheck();
        console.log(await this.sendTokenToCheck());
    }

    async sendTokenToCheck(): Promise<string | null> {
        const data = {"token": localStorage.getItem("sessionId")};
        fetch("http://localhost:8000/api/checktoken/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(async response => {
            if(response.ok) {
                this.username = (await response.text()).replace(/^"(.*)"$/, '$1');
                return response.text();
            }
            return null;
        })
        return null;
    }
}
