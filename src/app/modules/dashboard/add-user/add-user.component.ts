import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { AppService } from '../../../core/services/app.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  displayedColumns = [{ name: 'userName', title: 'User Name' },
  { name: 'bookLimit', title: 'Book Limit' },
  { name: 'admin', title: 'Is Admin' }
  ]
  users: Partial<Model.User>[];
  userForm: FormGroup;
  columnsList: any = [];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('form') form;
  constructor(private appService: AppService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) {
    this.createForm();
  }

  ngOnInit() {
    this.getUsers();
    this.generateColumn();
  }
  createForm() {
    this.userForm = this.fb.group({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      bookLimit: new FormControl('', Validators.required),
      isAdmin: new FormControl(false),
    });
  }
  saveUser() {
    this.appService.addValues('users', this.userForm.value).subscribe(result => {
      this.getUsers();
      this.resetForm();
      this.showMessage('User added Successfully!')
    }, error => {
      console.error(error.error);
    });
  }
  getUsers() {
    this.appService.getResults('users').subscribe(result => {
      this.users = result;
      Object.values(this.users).forEach(val => {

        val.admin = val.isAdmin ? 'Yes' : 'No'
      });
      this.generateDataSource();
    });
  }
  generateColumn() {
    this.columnsList = [];
    this.displayedColumns.forEach(element => {
      this.columnsList.push(element.name);
    });
  }
  generateDataSource() {
    this.dataSource = new MatTableDataSource<any>(this.users);
    this.dataSource.paginator = this.paginator;
  }
  showMessage(message) {
    this.snackBar.open(message);
  }
  resetForm() {
    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();
    this.form.reset();
    this.createForm();
  }

}