import { Component } from '@angular/core';
import {FormControl} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {map, Observable, Subscription} from "rxjs";
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private http: HttpClient) { }

  test: string = "xdd";
  username: FormControl<string | null> = new FormControl("");
  password: FormControl<string | null> = new FormControl("");
  xd:any;
  // @ts-ignore
  d =  this.Django();

  onRegister(){
    const data =
      {"username": this.username.getRawValue(),
      "password": this.password.getRawValue()};

    fetch('http://localhost:8000/r/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
  }

  Django(){
    let result: any[] = [];
    this.http.get<any>('http://localhost:8000/pes/').subscribe(data => {
      result.push(data.xd);
    });
    return result;
  }
}
