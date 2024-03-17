import {Component} from '@angular/core';
import {BACKEND} from "../constants";

@Component({
    selector: 'app-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.css']
})

export class BaseComponent {

    username: string | null = null;

    async ngOnInit() {
        await this.sendTokenToCheck();
    }

    async sendTokenToCheck() {
        const data = {"token": localStorage.getItem("sessionId")};
        fetch(BACKEND + "api/checktoken/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(async response => {
            if(response.ok) {
                this.username = (await response.text()).replace(/^"(.*)"$/, '$1');
            } else{
                localStorage.clear();
            }
        })
    }
}
