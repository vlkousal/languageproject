import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {CookieService} from "ngx-cookie";

@Component({
  selector: 'app-logout',
  template: ""
})

export class LogoutComponent {

  constructor(private router: Router, private cookieService: CookieService) { }

  ngOnInit() {
      this.cookieService.removeAll();
      this.router.navigate(["/"]);
  }
}
