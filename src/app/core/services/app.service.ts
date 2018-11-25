import { Injectable } from '@angular/core';
import { Stitch, RemoteMongoClient, AnonymousCredential } from 'mongodb-stitch-browser-sdk';
import { Observable } from 'rxjs/Observable';
import { DbService } from './db.service';
import { from } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { HttpClient } from '@angular/common/http';
const ins = DbService.Instance;
const db = ins.getDb();

@Injectable({
  providedIn: 'root'
})
export class AppService {

  // client = Stitch.initializeDefaultAppClient
  //   ('library-management-lmnag');
  // db = this.client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('library-management'); 


  constructor(private http: HttpClient) {
  }

  loginUser(collectionName: any, loginDetail: any): Observable<any> {
    var observableFromPromise = from(db.collection(collectionName)
      .find(
        JSON.parse(JSON.stringify(loginDetail))
      ).asArray()
      .then(docs => {
        return docs;
      }));

    return observableFromPromise;
  }

  getResults(collectionName: any): Observable<any> {

    var observableFromPromise = from(db.collection(collectionName)
      .find({}, { limit: 1000 })
      .asArray()
      .then(docs => {
        return docs;
      }));

    return observableFromPromise;
  }

  getResultsbyCriteria(collectionName: any, criteria: any): Observable<any> {

    var observableFromPromise = from(db.collection(collectionName)
      .find( criteria , { limit: 1000 })
      .asArray()
      .then(docs => {
        return docs;
      }));

    return observableFromPromise;
  }

  deleteResults(collectionName: any, data: any): Observable<any> {
    var observableFromPromise = from(
      db.collection(collectionName)
        .deleteOne({
          '_id': {
            '$oid': data
          }
        })
        .then(result => {
          return result;
        })
    );
    return observableFromPromise;
  }

  updateResult(collectionName: any, data: any): Observable<any> {
    var observableFromPromise = from(
      db.collection(collectionName)
        .updateOne({
          '_id': {
            '$oid': data[0]
          }
        }, { '$set': data[1] })
        .then(result => {
          console.log(result);
          return result;
        })
    );
    return observableFromPromise;
  }

  addValues(collectionName: any, data: any): Observable<any> {
    console.log(data);
    
    var observableFromPromise = from(
      db.collection(collectionName)
        .insertOne(data)
    );
    return observableFromPromise;
  }

  searchIsbn(isbn:string): Observable<any> {
    return this.http.get('https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn);
  }
}