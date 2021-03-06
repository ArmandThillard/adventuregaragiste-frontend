import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
      .get(this._server + 'adventuregaragiste/generic/world', {
        headers: this.setHeaders(this._user),
      })
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  private setHeaders(user: string): HttpHeaders {
    var headers = new HttpHeaders({ 'X-User': user });
    return headers;
  }

  public putProduct(product: Product): Promise<Response> {
    return this._http
      .put(this._server + 'adventuregaragiste/generic/product', product, {
        headers: this.setHeaders(this._user),
      })
      .toPromise()
      .catch(this.handleError);
  }

  public putManager(manager: Pallier): Promise<Response> {
    return this._http
      .put(this._server + 'adventuregaragiste/generic/manager', manager, {
        headers: this.setHeaders(this._user),
      })
      .toPromise()
      .catch(this.handleError);
  }

  public putAngelUpgrade(angelUpgrade: Pallier): Promise<Response> {
    return this._http
      .put(
        this._server + 'adventuregaragiste/generic/angelupgrade',
        angelUpgrade,
        {
          headers: this.setHeaders(this._user),
        }
      )
      .toPromise()
      .catch(this.handleError);
  }

  public putUpgrade(upgrade: Pallier): Promise<Response> {
    return this._http
      .put(this._server + 'adventuregaragiste/generic/upgrade', upgrade, {
        headers: this.setHeaders(this._user),
      })
      .toPromise()
      .catch(this.handleError);
  }

  public deleteWorld(): Promise<Response> {
    return this._http
      .delete(this._server + 'adventuregaragiste/generic/world', {
        headers: this.setHeaders(this._user),
      })
      .toPromise()
      .catch(this.handleError);
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
