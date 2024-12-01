import {Component} from '@angular/core';
import {BACKEND, FLAGS} from "../constants";
import {VocabularySet} from "../../vocabulary-set";


@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css']
})

export class IndexComponent {
    debug: string = "";
    sets: VocabularySet[] = [];

    async ngOnInit() {
        JSON.parse(await this.getSets()).forEach((item: {
            name: string;
            id: number;
            language: string;
        }) => {
            this.sets.push(new VocabularySet(item.name, item.id, "", "",FLAGS[item.language], [], false));
        });
        this.debug = await this.getSets();
    }

    async getSets() {
        const response: Response = await fetch(BACKEND + "api/getvocabsets/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if(response.ok) {
            return await response.text();
        }
        return "failed";
    }
}
