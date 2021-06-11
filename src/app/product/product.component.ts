import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/world';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  private _product: Product;
  private _server: string;
  progressBarValue: number;

  constructor() {}

  @Input()
  set prod(value: Product) {
    this._product = value;
  }

  get product() {
    return this._product;
  }

  @Input()
  set server(server: string) {
    this._server = server;
  }

  get server() {
    return this._server;
  }

  startFabrication() {
    console.log('clicked');
  }

  ngOnInit(): void {}
}
