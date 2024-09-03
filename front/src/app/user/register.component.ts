import { Component } from '@angular/core';
import {FormControl} from "@angular/forms";
import { Router } from '@angular/router';
import {BACKEND} from "../constants";
@Component({
  selector: 'app-user',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {

    constructor(private router: Router) { }
    username = new FormControl("") as FormControl<string>;
    email = new FormControl("") as FormControl<string>;
    password = new FormControl("") as FormControl<string>;
    password_again = new FormControl("") as FormControl<string>;
    isValid = false;
    feedback = "Enter a username.";

    ngOnInit() {
        if(localStorage.getItem("sessionId") != null) {
            this.router.navigate(["/"]);
        }
    }

    onRegister() {
        if(!this.isValid) {
            return;
        }
        const data = {
            "username": this.username.getRawValue(),
            "email": this.username.getRawValue(),
            "password": this.password.getRawValue()
        };

        fetch(BACKEND + 'api/register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        }).then(async response => {
            if (!response.ok) {
                this.feedback = "A user with this username already exists.";
            }
            if(response.ok) {
                const sessionId = (await response.text()).replace(/^"(.*)"$/, '$1');
                localStorage.setItem("sessionId", sessionId);
                this.router.navigate(["/"]);
            }
        })
    }

    onInputChange() {
        const username = this.username.getRawValue();
        const email = this.email.getRawValue();
        const password = this.password.getRawValue();
        const password_again = this.password_again.getRawValue();

        this.isValid = false;
        if(username.length == 0) {
            this.feedback = "Enter a username.";
            return;
        }

        if(!/^[a-zA-Z0-9&-._]+$/.test(username)) {
            this.feedback = "Your username is illegal.";
            return;
        }

        if(username.length < 4) {
            this.feedback = "Your username is too short.";
            return;
        }

        if(username.length > 16) {
            this.feedback = "Your username is too long.";
            return;
        }

        if(email.length == 0) {
            this.feedback = "Enter an e-mail.";
            return;
        }

        if(password.length == 0) {
            this.feedback = "Enter a password.";
            return;
        }

        if(password.length < 5) {
            this.feedback = "Your password is too short.";
            return;
        }

        if(password.length == 0) {
            this.feedback = "Enter your password again.";
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
