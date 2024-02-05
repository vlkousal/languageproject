import { Component } from '@angular/core';
import { Router } from "@angular/router";
import {VocabularySet} from "../constants";
import { HttpClient } from '@angular/common/http';

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

    constructor(private router: Router, private http: HttpClient) {}

    async ngOnInit() {
        if (localStorage.getItem("sessionId") == null) {
            this.router.navigate(["/"]);
        }
        (await this.getOwnSets());
        for(let i = 0; i < this.sets.length; i++){
            console.log(this.sets[i].name);
        }
        console.log("Length: " + this.sets.length);
    }

    async getOwnSets() {
        const data = { "token": this.token };
        fetch("http://localhost:8000/api/getownsets/", {
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
                    first_flag: string,
                    second_flag: string
                }) => {
                    this.sets.push(new VocabularySet(item.name, item.url, item.first_flag, item.second_flag));
                })
            }
            return [];
        })
    }

    onYesButtonClick() {
        this.deleteClickCount++;
        console.log(this.deleteClickCount);
        if(this.deleteClickCount == 3){
            console.log(this.deleteClickCount);
            this.deleteSet(this.urlToDelete);
            this.deleteClickCount = 0;
            this.urlToDelete = "";
        }
    }

    onDeleteButtonClick(url: string) {
        this.urlToDelete = url;
    }

    deleteSet(urlToDelete: string) {
        const data = { "token": this.token, "url_to_delete": urlToDelete };

        fetch("http://localhost:8000/api/deleteset/", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(async response => {
            if(response.ok){
                window.location.reload();
            }
            console.error("Couldn't delete the set!");
        })
    }
}
