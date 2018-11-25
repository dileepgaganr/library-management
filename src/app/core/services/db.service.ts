import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { Stitch, RemoteMongoClient, AnonymousCredential } from 'mongodb-stitch-browser-sdk';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class DbService {

  private static readonly client = Stitch.initializeDefaultAppClient
    ('library-management-lmnag');;

  private static _instance: DbService = new DbService();
  db: any;

  constructor() {
  }

  public static get Instance(): DbService {
    return this._instance || (this._instance = new this());
  }

  public getDb(): any {
    this.authenticate();
    return DbService.client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('library-management');;
  }

  authenticate() {
    if (!localStorage.getItem('dbConnected')) {
      DbService.client.auth
        .loginWithCredential(new AnonymousCredential())
        .then(user => {
          localStorage.setItem('dbConnected', JSON.stringify(user));
        })
        .catch(console.error);
    }
  }

}