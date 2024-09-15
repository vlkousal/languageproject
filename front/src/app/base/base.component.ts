import {Component} from '@angular/core';
import {BACKEND} from "../constants";
import {CookieService} from "ngx-cookie";

@Component({
    selector: 'app-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.css']
})

export class BaseComponent {

    username: string | null = localStorage.getItem("username");

    constructor(private cookieService: CookieService) {}

    async ngOnInit(): Promise<void> {
        await this.sendTokenToCheck();
    }

    async sendTokenToCheck(): Promise<void> {
        fetch(BACKEND + "api/checktoken/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({token: this.cookieService.get("token")})
        }).then(async response => {
            if(response.ok) {
                const username: string = JSON.parse(await response.text()).username;
                localStorage.setItem("username", username);
                this.username = username;
                return;
            }
            localStorage.clear();
        })
    }

    protected readonly console = console;
}
