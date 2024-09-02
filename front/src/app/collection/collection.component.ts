import { Component } from '@angular/core';
import { Router } from "@angular/router";
import {BACKEND, FLAGS} from "../constants";
import {VocabularySet} from "../../vocabulary-set";

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})

export class CollectionComponent {

    token: string|null = localStorage.getItem("sessionId");
    sets: VocabularySet[] = [];
    urlToDelete: string = "";
    deleteClickCount: number = 0;

    constructor(private router: Router) {}

    async ngOnInit() {
        if (localStorage.getItem("sessionId") == null) {
            this.router.navigate(["/"]);
        }
        await this.getOwnSets();
    }

    async getOwnSets() {
        const data = { "token": this.token };
        fetch(BACKEND + "api/getownsets/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(async response => {
            if(response.ok) {
                const json = await response.json();
                (json.sets).forEach((item: {
                    name: string,
                    url: string,
                    first_language: string,
                    second_language: string
                }) => {
                    this.sets.push(new VocabularySet(item.name, item.url,
                        FLAGS[item.first_language],
                        FLAGS[item.second_language]));
                })
            }
            return [];
        })
    }

    onYesButtonClick() {
        this.deleteClickCount++;
        if(this.deleteClickCount == 3) {
            this.deleteSet(this.urlToDelete);
            this.onNoButtonClick();
        }
    }

    onNoButtonClick() {
        this.deleteClickCount = 0;
        this.urlToDelete = "";
    }

    onDeleteButtonClick(url: string) {
        this.urlToDelete = url;
    }

    onEditButtonClick(url: string) {
        this.router.navigate(["/edit/" + url]);
    }

    deleteSet(urlToDelete: string) {
        const data = { "token": this.token, "url_to_delete": urlToDelete };

        fetch(BACKEND + "api/deleteset/", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(async response => {
            if(response.ok) {
                window.location.reload();
            }
            console.error("Couldn't delete the set!");
        })
    }
}
