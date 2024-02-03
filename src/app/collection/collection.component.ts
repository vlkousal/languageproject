import { Component } from '@angular/core';
import { Router } from "@angular/router";
import {VocabularySet} from "../constants";
@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})

export class CollectionComponent {

    token: string|null = localStorage.getItem("sessionId");
    sets: VocabularySet[] = [];

    constructor(private router: Router) {}

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
}
