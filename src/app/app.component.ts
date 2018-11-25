import { Component } from '@angular/core';
import { SharedService } from './shared/services/shared.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userDet: any;
  start = true;
  constructor(private sharedService: SharedService, private router: Router) {
    this.sharedService.loggedInUser.subscribe(res => {
      this.userDet = res;
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.start = true;
      } else if (event instanceof NavigationEnd) {
        this.start = false;
      } else {
        this.start = false;
      }
    })
  }
}
