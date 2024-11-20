import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie";
import {BACKEND} from "../constants";

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {

    username: string = "";
    dateJoined: string = "";
    profile_picture: string = "";
    bio: string = "";
    location: string = "";

    constructor(private route: ActivatedRoute, private router: Router, private cookieService: CookieService) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.getUserInfo(params["username"]);
        });
    }

    async getUserInfo(username: string): Promise<void> {
        try {
            const response = await fetch(BACKEND + "api/getuserinfo/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify({
                    username: username
                })
            });

            if(response.ok) {
                const resp = await response.json();
                this.username = resp.username;
                this.dateJoined = resp.date_joined;
                this.profile_picture = resp.profile_picture;
                this.bio = resp.bio;
                this.location = resp.location;
                return;
            } else{
                this.router.navigate(['404']);
            }
        }  catch(error) {
            console.error("Error:", error);
            return;
        }
    }

    protected readonly console = console;
}
