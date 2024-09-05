import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {BACKEND} from "../constants";
import {CookieService} from "ngx-cookie";
import {Utils} from "../utils";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

    constructor(private router: Router, private cookieService: CookieService) { }

    username = new FormControl("") as FormControl<string>;
    password = new FormControl("") as FormControl<string>;
    isValid = false;

    async ngOnInit(): Promise<void> {
        if(this.cookieService.get("token") != null) await this.router.navigate(["/"]);
    }

    onLogin(): void {
        if(!this.isValid) return;

        const data = {
            username: this.username.getRawValue(),
            password: this.password.getRawValue()
        };

        fetch(BACKEND + 'api/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        }).then(async response => {
            if(response.ok) {
                const token: string = JSON.parse(await response.text()).token;
                this.cookieService.put("token", token, {expires: Utils.getThirtyDaysFromNow(), sameSite: "lax"});
                await this.router.navigate(["/"]);
            }
        })
    }

    onInputChange(): void {
        const username = this.username.getRawValue();
        const password = this.password.getRawValue();

        this.isValid = /^[a-zA-Z0-9&-._]+$/.test(username) && username.length >= 4
            && username.length <= 16 && password.length >= 5;
    }
}
