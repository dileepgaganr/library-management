import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { AppService } from '../../../core/services/app.service';


@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  displayedColumns = [{ name: 'title', title: 'Title' },
  { name: 'author', title: 'Author Name' },
  { name: 'category', title: 'Category' },
  { name: 'stock', title: 'Available Stock' },
  { name: 'isbn', title: 'ISBN' },
  { name: 'Action', title: 'Edit', type: 'edit' },
  { name: 'Delete', title: 'Delete', type: 'delete' }
  ]

  categories = [{ name: 'Comics', value: 10 },
  { name: 'Romance', value: 20 },
  { name: 'Biography', value: 30 },
  { name: 'Horror', value: 40 },
  { name: 'Fiction', value: 50 },
  { name: 'Other', value: 60 }
  ]

  bookDetails: any;
  bookForm: FormGroup;
  message = '';
  books: Partial<Model.BookDetail>[];
  columnsList: any = [];
  dataSource: MatTableDataSource<any>;
  editId: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('form') form;
  constructor(private appService: AppService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) {
    this.createForm();
  }

  ngOnInit() {
    this.getBooks();
    this.generateColumn();
  }
  createForm() {
    this.bookForm = this.fb.group({
      title: new FormControl('', Validators.required),
      isbn: new FormControl('', Validators.required),
      desciption: new FormControl('', Validators.required),
      stock: new FormControl('', Validators.required),
      author: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      image: new FormControl('')
    });
  }
  getBookResult(isbnNum) {
    if (isbnNum) {
      let bookDet = this.books.filter(val => {
        return val.isbn === isbnNum
      });
      if (!(bookDet.length > 0)) {
        this.appService.searchIsbn(isbnNum).subscribe(result => {
          if (result.totalItems > 0) {
            this.message = '';
            this.bookDetails = result.items[0].volumeInfo;
            this.fillForm(this.bookDetails);
          } else {
            this.message = 'Book not found!!!';
          }
        },
          error => {
            console.error(error.error);
          });
      } else {
        this.message = 'Book already exist in library!!!';
      }
    }
  }
  fillForm(det) {
    if (det) {
      this.bookForm.patchValue({
        title: det.title,
        desciption: det.description,
        author: det.authors[0],
        image: det.imageLinks.thumbnail
      });
    }
  }
  saveBook() {
    if (!this.editId) {
      this.appService.addValues('book-information', this.bookForm.value).subscribe(result => {
        this.getBooks();
        this.resetForm();
        this.showMessage('Book added Successfully!')
      }, error => {
        console.error(error.error);
      });
    } else {
      if (this.editId) {
        let editVal = [];
        editVal.push(this.editId);
        editVal.push(this.bookForm.value);
        this.appService.updateResult('book-information', editVal).subscribe(result => {
          this.getBooks();
          this.resetForm();
          this.showMessage('Book updated Successfully!')
          this.editId = undefined;
        }, error => {
          this.editId = undefined;
          console.error(error.error);
        });
      }
    }
  }
  getBooks() {
    this.appService.getResults('book-information').subscribe(result => {
      this.books = result;
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
    this.dataSource = new MatTableDataSource<any>(this.books);
    this.dataSource.paginator = this.paginator;
  }
  showMessage(message) {
    this.snackBar.open(message);
  }
  editRow(val) {
    this.editId = val._id.toString();
    this.bookForm.patchValue({
      title: val.title,
      isbn: val.isbn,
      desciption: val.desciption,
      stock: val.stock,
      author: val.author,
      category: val.category,
      image: val.image
    });
  }
  deleteBook(val) {
    let deleteVal = val._id.toString();
    this.appService.deleteResults('book-information', deleteVal).subscribe(res => {
      this.getBooks();
      this.showMessage('Book deleted Successfully!')
    }, error => {
      console.error(error.error);
    })
  }
  resetForm() {
    this.bookForm.markAsPristine();
    this.bookForm.markAsUntouched();
    this.form.reset();
    this.message = '';
    this.createForm();
  }
}