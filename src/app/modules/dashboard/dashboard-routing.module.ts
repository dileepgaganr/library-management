import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddBookComponent } from './add-book/add-book.component';
import { BooksComponent } from './books/books.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ViewAssignedComponent } from './view-assigned/view-assigned.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      { path: '', component: BooksComponent },
      { path: 'Books', component: BooksComponent },
      { path: 'AddUser', component: AddUserComponent },
      { path: 'AddBooks', component: AddBookComponent },
      { path: 'AssignedBooks', component: ViewAssignedComponent },
    ]
  },

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class DashboardRoutingModule { }