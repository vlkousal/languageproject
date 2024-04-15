import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  template: ""
})

export class LogoutComponent {
  constructor(private http: HttpClient, private router: Router) { }
  ngOnInit(){
    localStorage.clear();
    this.router.navigate(["/"]);
  }
}
