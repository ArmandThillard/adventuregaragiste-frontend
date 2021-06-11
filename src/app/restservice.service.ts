import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { World, Pallier, Product } from './world';

@Injectable({
  providedIn: 'root',
})
export class RestserviceService {
  private _server = 'http://localhost:8081/';
  private _user = '';
  private _http: HttpClient;

  constructor(privatehttp: HttpClient) {
    this._http = privatehttp;
  }

  public getWorld(): Promise<World> {
    return this._http
      .get(this._server + 'adventuregaragiste/generic/world')
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  public get user(): string {
    return this._user;
  }

  public set user(user: string) {
    this._user = user;
  }

  public get server(): string {
    return this._server;
  }
}
