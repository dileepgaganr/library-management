import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppService } from '../../../core/services/app.service';
import { SharedService } from '../../../shared/services/shared.service';
import { MatSnackBar, MatDialog } from '@angular/material';

@Component({
  selector: 'app-view-assigned',
  templateUrl: './view-assigned.component.html',
  styleUrls: ['./view-assigned.component.css']
})
export class ViewAssignedComponent implements OnInit {
  myControl = new FormControl();
  books: Partial<Model.BookDetail>[];
  users: Partial<Model.User>[];
  filteredUsers: Observable<any[]>;
  assignedBookId = [];
  filteredBooks: Partial<Model.BookDetail>[];
  userBooks = [];
  isAdmin = this.sharedService.loggedInUser.value.isAdmin;
  @ViewChild('feedBack') private feedBack: TemplateRef<any>;
  comments: any;
  rate: any;
  feedbackObj: any;
  selectedUser: any;
  constructor(private appService: AppService,
    private sharedService: SharedService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) {
    this.getUsers();
    this.getBooks();
  }
  ngOnInit() {
  }
  private _filter(value: any): any[] {

    const filterValue = value ? value.userName ? value.userName.toLowerCase() : value.toLowerCase() : '';
    return this.users.filter(val => val.userName.toLowerCase().includes(filterValue));
  }
  getUsers() {
    this.appService.getResults('users').subscribe(result => {
      this.users = result;
      this.filteredUsers = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    });
  }
  getBooks() {
    this.appService.getResults('book-information').subscribe(result => {
      this.books = result;
      if (result) {
        this.getUserBooks(this.selectedUser);
      }
    });
  }
  getUserBooks(user?) {
    this.selectedUser = this.isAdmin ? user : this.sharedService.loggedInUser.value;
    let criteria = this.selectedUser ?
      { userId: this.selectedUser._id.toString() } : undefined;
    if (criteria) {
      this.appService.getResultsbyCriteria('user-book-mapping', criteria).subscribe(result => {
        if (result) {
          this.userBooks = result;
          this.assignedBookId = [];
          this.assignedBookId = result.map(val => { return val.bookId });
          this.filteredBooks = this.books.filter(val => {
            if (this.assignedBookId.indexOf(val._id.toString()) !== -1) {
              return val;
            }
          });
        }
      });
    }
  }
  unAssignBook(detail) {
    let assigned = this.userBooks.filter(val => { return val.bookId === detail._id.toString() });
    let bookUnassign = [];

    if (assigned.length > 0) {
      bookUnassign.push(detail._id.toString());
      bookUnassign.push({ stock: detail.stock + 1 });
      this.appService.deleteResults('user-book-mapping', assigned[0]['_id'].toString()).subscribe(result => {
        // this.getUserBooks(this.selectedUser);
        this.getBooks();
        this.updateStock(bookUnassign);
        this.showMessage('Book unassigned successfully!');
        if (!this.isAdmin) {
          this.openFeedbackDialog(detail);
        }
      })
    }
  }
  updateStock(bookUnassign) {
    this.appService.updateResult('book-information', bookUnassign).subscribe(result => {
    });
  }
  openFeedbackDialog(detail) {
    this.feedbackObj = undefined;
    this.feedbackObj = detail;
    this.dialog.open(this.feedBack, {
      disableClose: true,
      height: 'auto',
      width: '50%'
    })
  }
  submitFeedBack() {
    if (this.comments && this.rate) {
      let bookDet = {
        bookId: this.feedbackObj._id.toString(),
        userId: this.sharedService.loggedInUser.value.userName,
        comments: this.comments,
        rating: this.rate
      }
      this.appService.addValues('book-reviews', bookDet).subscribe(res => {
        this.dialog.closeAll();
        this.showMessage('Thank you for reviewing!!')
      })
    }
  }
  showMessage(message) {
    this.snackBar.open(message);
  }
  displayFn(user) {
    return user ? user.userName : '';
  }
}
