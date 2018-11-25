import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppService } from '../../../core/services/app.service';
import { SharedService } from '../../../shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  categories = [{ name: 'Comics', value: 10 },
  { name: 'Romance', value: 20 },
  { name: 'Biography', value: 30 },
  { name: 'Horror', value: 40 },
  { name: 'Fiction', value: 50 },
  { name: 'Other', value: 60 }
  ]
  
  books: Partial<Model.BookDetail>[];
  bookDetail: Partial<Model.BookDetail>;
  assignedBooks: Partial<Model.UserBook>[];
  assignedBookId = [];
  comments: any;
  rate: any;
  feedbackObj: any;
  bookReviews = [];
  searchBy:any;
  filterBy:any;


  @ViewChild('viewDetails') private viewDet: TemplateRef<any>;
  @ViewChild('feedBack') private feedBack: TemplateRef<any>;

  constructor(private appService: AppService,
    private sharedService: SharedService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.filterBy='author';
    this.getBooks();
    this.getUserBooks();
  }
  getBooks() {
    this.appService.getResults('book-information').subscribe(result => {
      this.books = result;
    });
  }
  viewBookDetails(detail) {
    this.bookDetail = detail;
    let criteria = {
      bookId: detail._id.toString()
    };
    this.appService.getResultsbyCriteria('book-reviews', criteria).subscribe(res => {
      this.bookReviews = res;
      this.bookDetail.rating = this.bookReviews.length > 0 ? Math.floor(this.bookReviews.reduce((i, j) => {
        return i + j.rating;
      }, 0) / this.bookReviews.length) : 0;
    })
    this.dialog.open(this.viewDet,
      {
        height: 'auto',
        width: '50%',
      });

  }
  assignBook(detail) {
    let bookAvailable = detail.stock === 0 ? false : true;
    let newBook: any;
    let bookStock = [];

    newBook = {
      userId: this.sharedService.loggedInUser.value._id.toString(),
      bookId: detail._id.toString(),
      assignedDate: Date.now
    }
    if (bookAvailable) {
      this.appService.addValues('user-book-mapping', newBook).subscribe(result => {
        bookStock.push(detail._id.toString());
        bookStock.push({ stock: detail.stock - 1 });
        this.getUserBooks();
        this.updateStock(bookStock);
        Object.values(this.books).forEach(v => {
          if (v._id.toString() === detail._id.toString()) {
            v.stock = v.stock - 1;
          }
        });
        this.showMessage('Book assigned successfully!');
      })
    } else {
      this.showMessage('Book is out of Stock!!')
    }

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
  unAssignBook(detail) {
    let assigned = this.assignedBooks.filter(val => { return val.bookId === detail._id.toString() });
    let bookUnassign = [];

    if (assigned.length > 0) {
      bookUnassign.push(detail._id.toString());
      bookUnassign.push({ stock: detail.stock + 1 });
      this.appService.deleteResults('user-book-mapping', assigned[0]['_id'].toString()).subscribe(result => {
        this.getUserBooks();
        this.updateStock(bookUnassign);
        this.showMessage('Book unassigned successfully!');
        this.getBooks();
        this.openFeedbackDialog(detail);
      })
    }
  }
  updateStock(bookUnassign) {
    this.appService.updateResult('book-information', bookUnassign).subscribe(result => {
    });
  }
  getUserBooks() {
    let criteria = { userId: this.sharedService.loggedInUser.value._id.toString() };
    this.appService.getResultsbyCriteria('user-book-mapping', criteria).subscribe(result => {
      this.assignedBooks = result;
      // this.assignedBookId=[];
      this.assignedBookId = this.assignedBooks.map(val => { return val.bookId });
      // this.assignedBooks.filter(val => this.assignedBookId.push(val.bookId));
    });
  }
  showMessage(message) {
    this.snackBar.open(message);
  }
}