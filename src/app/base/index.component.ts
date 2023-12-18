import {Component} from '@angular/core';

class VocabSet{
  name: string;
  url: string;

  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
  }
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent {
  sessionID = localStorage.getItem("sessionId");
  debug: string = "";
  sets: VocabSet[] = [];

  async ngOnInit(){
    let dataString: string = JSON.parse(await this.getSets()).forEach((item: { name: string; url: string; }) => {
      this.sets.push(new VocabSet(item.name, item.url));
    });
    this.debug = await this.getSets();
  }

  async getSets() {
    const response: Response = await fetch("http://localhost:8000/api/getvocabsets/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if(response.ok){
      return await response.text();
    }
    return "failed";
  }
}
