import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {BACKEND} from "../constants";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

    constructor(private router: Router) { }

    username = new FormControl("") as FormControl<string>;
    password = new FormControl("") as FormControl<string>;
    isValid = false;
    feedback = "Enter a username.";

    ngOnInit() {
        if(localStorage.getItem("sessionId") != null) {
            this.router.navigate(["/"]);
        }
    }

    onLogin() {
        if(!this.isValid) {
            return;
        }
        const data =
        {"username": this.username.getRawValue(),
          "password": this.password.getRawValue()};

        fetch(BACKEND + 'api/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        }).then(async response => {
            if (!response.ok) {
                this.feedback = "Wrong credentials.";
            }
            if(response.ok) {
                const sessionId = (await response.text()).replace(/^"(.*)"$/, '$1');
                localStorage.setItem("sessionId", sessionId);
                window.location.href = '/';
            }
        })
    }

    onInputChange() {
        const username = this.username.getRawValue();
        const password = this.password.getRawValue();
        this.isValid = false;

        if(username.length == 0) {
            this.feedback = "Enter a username.";
            return;
        }

        if(password.length == 0) {
            this.feedback = "Enter a password.";
            return;
        }
        this.feedback = "Go for it!";
        this.isValid = true;
    }
}
