import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie";
import {BACKEND} from "../constants";
import {FormControl} from "@angular/forms";

interface UserProfile {
    username: string,
    date_joined: string,
    profile_picture: string,
    bio: string,
    location: string,
    isOwn: boolean
}

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {

    profile: UserProfile | null = null;
    editMode: boolean = false;

    location: FormControl<string> = new FormControl("") as FormControl<string>;
    bio: FormControl<string> = new FormControl("") as FormControl<string>;

    constructor(private route: ActivatedRoute, private router: Router, private cookieService: CookieService) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.getUserInfo(params["username"]);
        });
    }

    editProfile() {
        if(this.editMode) {
            this.profile!.location = this.location.value;
            this.profile!.bio = this.bio.value;
            this.sendNewUserInfo();
        }
        this.editMode = !this.editMode;
    }

    openImageSelection(): void {
        if(!this.editMode) return;
        const fileInput = document.getElementById("imageSelect");
        if (fileInput) {
            fileInput.click();
        }
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.sendNewProfilePicture(reader.result);
            }
        }
    }

    setDefaultPicture(): void {
        const avatar: HTMLElement | null = document.getElementById("avatar");
        if(avatar == null) return;
        avatar.setAttribute("src", "assets/default_avatar.jpg");
    }

    async sendNewProfilePicture(image64: string | null | ArrayBuffer): Promise<void> {
        try {
            const response = await fetch(BACKEND + "api/updateprofilepicture/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify({
                    token: this.cookieService.get("token"),
                    image: image64
                })
            });

            if (response.ok) {
                const imageURL: string | null = (await response.json()).url;
                this.profile!.profile_picture = imageURL!;
                if(imageURL == null) {
                    this.setDefaultPicture();
                }
            }
        }  catch(error) {
            console.error("Error:", error);
            return;
        }
    }

    async sendNewUserInfo(): Promise<void> {
        try {
            await fetch(BACKEND + "api/updateuserinfo/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify({
                    token: this.cookieService.get("token"),
                    profile: this.profile
                })
            });
        }  catch(error) {
            console.error("Error:", error);
            return;
        }
    }

    async getUserInfo(username: string): Promise<void> {
        try {
            const response = await fetch(BACKEND + "api/getuserinfo/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify({
                    token: this.cookieService.get("token"),
                    username: username
                })
            });

            if(response.ok) {
                const resp = await response.json();
                this.location.setValue(resp.location);
                this.bio.setValue(resp.bio);
                this.profile = resp;
                if(resp.profile_picture == null) {
                    this.setDefaultPicture();
                }
            } else{
                this.router.navigate(["404"]);
            }
        }  catch(error) {
            console.error("Error:", error);
            return;
        }
    }
}
