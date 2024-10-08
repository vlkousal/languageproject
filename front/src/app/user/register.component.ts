import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { Router } from '@angular/router';
import {BACKEND, PASSWORD_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH} from "../constants";
import {CookieService} from "ngx-cookie";
import {Utils} from "../utils";

@Component({
  selector: 'app-user',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {

    registerForm: FormGroup = new FormGroup({
        username: new FormControl("", [
            Validators.required,
            Validators.pattern("^[a-zA-Z0-9&-._]+$")
        ]),
        email: new FormControl("", [
            Validators.required,
            Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
        ]),
        password: new FormControl(""),
        password_again: new FormControl("")

    })
    isValid = false;
    feedback = "Enter a username.";

    constructor(private router: Router, private cookieService: CookieService) { }

    async ngOnInit(): Promise<void> {
        if(this.cookieService.get("token") != null ) await this.router.navigate(["/"]);
    }

    onRegister(): void {
        if(!this.isValid) return;

        const data = {
            username: this.registerForm.controls["username"].value,
            email: this.registerForm.controls["email"].value,
            password: this.registerForm.controls["password"].value
        };

        fetch(BACKEND + 'api/register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        }).then(async response => {
            if (!response.ok) {
                const text: string = await response.text();
                this.feedback = text.slice(1, text.length - 1);
            }
            if(response.ok) {
                const token: string = JSON.parse(await response.text()).token;
                this.cookieService.put("token", token, {expires: Utils.getThirtyDaysFromNow(), sameSite: "lax"});
                await this.router.navigate(["/"]);
            }
        })
    }

    onInputChange(): void {
        const username = this.registerForm.controls["username"].value;
        const password = this.registerForm.controls["password"].value;
        const password_again = this.registerForm.controls["password_again"].value;

        this.isValid = false;
        if(username.length == 0) {
            this.feedback = "Enter a username.";
            return;
        }

        if(!/^[a-zA-Z0-9-._]+$/.test(username)) {
            this.feedback = "Your username is illegal.";
            return;
        }

        if(username.length < USERNAME_MIN_LENGTH) {
            this.feedback = "Your username is too short.";
            return;
        }

        if(username.length > USERNAME_MAX_LENGTH) {
            this.feedback = "Your username is too long.";
            return;
        }

        if(!this.registerForm.controls["email"].valid) {
            this.feedback = "The given e-mail is not valid.";
            return;
        }

        if(password.length < PASSWORD_MIN_LENGTH) {
            this.feedback = "Your password is too short.";
            return;
        }

        if(password != password_again) {
            this.feedback = "Your passwords don't match.";
            return;
        }
        this.feedback = "Perfect!";
        this.isValid = true;
    }
}
