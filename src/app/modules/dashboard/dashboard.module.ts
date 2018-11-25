import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AddBookComponent } from './add-book/add-book.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BooksComponent } from './books/books.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ViewAssignedComponent } from './view-assigned/view-assigned.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    AddBookComponent,
    BooksComponent,
    AddUserComponent,
    ViewAssignedComponent]
})
export class DashboardModule { }