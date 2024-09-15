import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {CookieService} from "ngx-cookie";
import {BACKEND} from "../constants";
import {Utils} from "../utils";

@Component({
  selector: 'app-logout',
  template: ""
})

export class LogoutComponent {

    constructor(private router: Router, private cookieService: CookieService) { }

    ngOnInit() {
        fetch(BACKEND + 'api/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.cookieService.get("token")),
        })
        this.cookieService.removeAll();
        this.router.navigate(["/"]);
    }


}
