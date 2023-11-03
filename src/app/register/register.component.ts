import { Component } from '@angular/core';
import {FormControl} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private http: HttpClient) { }
  username = new FormControl("") as FormControl<string>;
  password = new FormControl("") as FormControl<string>;
  password_again = new FormControl("") as FormControl<string>;
  isValid = false;
  feedback = "Enter a username.";

  onRegister(){
    if(!this.isValid){
      return;
    }
      const data =
        {"username": this.username.getRawValue(),
          "password": this.password.getRawValue()};

    fetch('http://localhost:8000/r/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(response => {
      if(!response.ok){
        this.feedback = "A user with this username already exists.";
      }
      if(response.ok){
        window.location.href = '/'; // Změňte '/other-page' na vaši cílovou cestu
      }
    })

  }

  Django(){
    let result: any[] = [];
    this.http.get<any>('http://localhost:8000/pes/').subscribe(data => {
      result.push(data.xd);
    });
    return result;
  }

  onInputChange(){
    let username = this.username.getRawValue();
    let password = this.password.getRawValue();
    let password_again = this.password_again.getRawValue();

    this.isValid = false;
    if(username.length == 0){
      this.feedback = "Enter a username.";
      return;
    }
    if(username.length < 2){
      this.feedback = "Your username is too short.";
      return;
    }
    if(username.length > 16){
      this.feedback = "Your username is too long.";
      return;
    }

    if(password.length == 0){
      this.feedback = "Enter a password.";
      return;
    }

    if(password.length < 5){
      this.feedback = "Your password is too short.";
      return;
    }

    if(password.length == 0){
      this.feedback = "Enter your password again.";
      return;
    }

    if(password != password_again){
      this.feedback = "Your passwords don't match.";
      return;
    }
    this.feedback = "Perfect!";
    this.isValid = true;
  }

  protected readonly oninput = oninput;
}
