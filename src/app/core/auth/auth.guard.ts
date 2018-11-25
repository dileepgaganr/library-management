import { Injectable } from '@angular/core';
import {
  CanActivate, ActivatedRouteSnapshot,
  RouterStateSnapshot, Router, CanLoad
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SharedService } from '../../shared/services/shared.service'
@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  userDet:any;
  constructor(private sharedService: SharedService,
    private router: Router) {
      this.sharedService.loggedInUser.subscribe(val=>{
        this.userDet=val;
      })
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.userDet) {
      return true;
    }
    else {
      this.router.navigate(['Login']);
      return false;
    }
  }

  canLoad() {
    if (this.userDet) {
      return true;
    }
    else {
      this.router.navigate(['Login']);
      return false;
    }
  }
}
