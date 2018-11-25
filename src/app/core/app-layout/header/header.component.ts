import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../shared/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userDet: any;

  constructor(private sharedService: SharedService, private router: Router) {
    this.sharedService.loggedInUser.subscribe(res => {
      this.userDet = res;
    });
  }

  ngOnInit() {
  }

  logOut() {
    this.router.navigate(['./Login']);
  }

}