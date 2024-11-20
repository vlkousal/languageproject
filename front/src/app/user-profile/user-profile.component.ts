import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie";
import {BACKEND} from "../constants";

interface UserProfile {
    username: string,
    dateJoined: string,
    profile_picture: string,
    bio: string,
    location: string
}

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {

    profile: UserProfile | null = null;

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
                this.profile = resp;
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
