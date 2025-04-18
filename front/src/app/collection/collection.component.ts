import { Component } from '@angular/core';
import { Router } from "@angular/router";
import {BACKEND} from "../constants";
import {VocabularySet} from "../../VocabularySet";
import {CookieService} from "ngx-cookie";

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})

export class CollectionComponent {

    token: string | undefined = "";
    sets: VocabularySet[] = [];
    filteredSets: VocabularySet[] = [];
    setToDelete: VocabularySet | null = null;
    deleteClickCount: number = 0;

    constructor(private router: Router, private cookieService: CookieService) {}

    async ngOnInit() {
        this.token = this.cookieService.get("token");
        if (this.token == null) await this.router.navigate(["/"]);
        await this.getOwnSets();
        VocabularySet.sortByName(this.sets);
        this.filteredSets = this.sets;
    }

    onFilterChange(event: Event): void {
        const newFilter: VocabularySet[] = [];
        const filter: string = (event.target as HTMLInputElement).value;
        for(let i = 0; i < this.sets.length; i++) {
            const set = this.sets[i];
            if(set.name.toLowerCase().includes(filter.toLowerCase())) {
                newFilter.push(set);
            }
        }
        this.filteredSets = [...newFilter];
    }

    async getOwnSets(): Promise<void> {
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
                    id: number,
                    language: string,
                    is_own: boolean
                }) => {
                    this.sets.push(new VocabularySet(item.name, item.id, "", "",
                        item.language, [], item.is_own));
                })
            }
            return [];
        })
    }

    async onYesButtonClick(): Promise<void> {
        this.deleteClickCount++;
        if(this.deleteClickCount == 3) {
            await this.deleteSet();
        }
    }

    onNoButtonClick(): void {
        this.deleteClickCount = 0;
        this.setToDelete = null;
    }

    async onEditButtonClick(set: VocabularySet): Promise<void> {
        await this.router.navigate(["/edit/" + set.id]);
    }

    async deleteSet(): Promise<void> {
        const data = { token: this.token, id: this.setToDelete!.id };

        fetch(BACKEND + "api/deleteset/", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(async response => {
            if(response.ok){
                this.sets.splice(this.sets.indexOf(this.setToDelete!), 1);
                this.onNoButtonClick()
                return;
            }
            console.error("Couldn't delete the set!");
        })
    }
}
