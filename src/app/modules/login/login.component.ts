import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../../core/services/app.service'
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  userList: Array<Model.User>;
  invalidUser = false;
  constructor(private fb: FormBuilder,
    private appService: AppService,
    private sharedService: SharedService, private router: Router) {
    this.sharedService.loggedInUser.next(null);
    this.createLoginForm();
  }

  ngOnInit() {
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  loginUser() {
    this.invalidUser = false;
    if (this.loginForm.valid) {
      let loginVal = this.loginForm.value;
      this.appService.loginUser('users', loginVal).subscribe(res => {
        
        if (res.length>0) {
          this.sharedService.loggedInUser.next(res[0]);
          this.router.navigate(['Dashboard']);
        } else {
          this.invalidUser = true;
        }
      })
    }
  }
}