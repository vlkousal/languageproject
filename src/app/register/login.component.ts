import { Component } from '@angular/core';
import {FormControl} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private http: HttpClient, private router: Router) { }
  username = new FormControl("") as FormControl<string>;
  password = new FormControl("") as FormControl<string>;
  password_again = new FormControl("") as FormControl<string>;
  isValid = false;
  feedback = "Enter a username.";

  ngOnInit(){
    if(sessionStorage.getItem("sessionId") != null){
      this.router.navigate(["/"]);
    }
  }

  onLogin(){
    if(!this.isValid){
      return;
    }
    sessionStorage
      const data =
        {"username": this.username.getRawValue(),
          "password": this.password.getRawValue()};

    fetch('http://localhost:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(async response => {
      if (!response.ok) {
        this.feedback = "Wrong credentials.";
      }
      if(response.ok){
        sessionStorage.setItem("sessionId", await response.text());
        window.location.href = '/';
      }
    })

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

    if(password.length == 0){
      this.feedback = "Enter a password.";
      return;
    }
    this.feedback = "Go for it!";
    this.isValid = true;
  }

  protected readonly oninput = oninput;
}
