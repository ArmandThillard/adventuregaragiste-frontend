import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from 'src/app/world';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  private _product: Product;
  private _server: string;
  private _multiplier: string;
  progressBarValue: number;
  lastUpdate: number;
  private _money: number;
  neededMoney: number;
  nbCanBuy: number;

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

  @Input()
  set multiplier(value: string) {
    this._multiplier = value;
    if (this._multiplier && this.product) this.calcMaxCanBuy();
  }

  @Input()
  set money(value: number) {
    this._money = value;
  }

  @Output() notifyProduction: EventEmitter<Product> =
    new EventEmitter<Product>();

  calcScore() {
    if (this._product.timeleft !== 0) {
      this._product.timeleft -= Date.now() - this.lastUpdate;
      if (this._product.timeleft <= 0) {
        // On prévient le composant parent que ce produit a généré son revenu
        this.notifyProduction.emit(this._product);
        // Réinitialiser les variables
        this._product.timeleft = 0;
        this.progressBarValue = 0;
      } else {
        this.progressBarValue =
          ((this._product.vitesse - this._product.timeleft) /
            this._product.vitesse) *
          100;
      }
    }
  }

  calcMaxCanBuy() {
    this.neededMoney = 0;
    switch (this._multiplier) {
      case 'x1':
        this.nbCanBuy = 1;
        this.neededMoney = this._product.cout;
        break;
      case 'x10':
        this.nbCanBuy = 10;
        this.neededMoney =
          (this._product.cout * (1 - Math.pow(this._product.croissance, 10))) /
          (1 - this._product.croissance);
        break;
      case 'x100':
        this.nbCanBuy = 100;
        this.neededMoney =
          (this._product.cout * (1 - Math.pow(this._product.croissance, 100))) /
          (1 - this._product.croissance);
        break;
      case 'xMax':
        this.nbCanBuy = Math.trunc(
          Math.log(
            1 -
              (this._money * (1 - this._product.croissance)) /
                this._product.cout
          ) / Math.log(this._product.croissance)
        );
        this.neededMoney =
          (this._product.cout *
            (1 - Math.pow(this._product.croissance, this.nbCanBuy))) /
          (1 - this._product.croissance);
        break;
      default:
        break;
    }
  }

  buy() {}

  startFabrication() {
    this._product.timeleft = this._product.vitesse;
    this.lastUpdate = Date.now();
  }

  ngOnInit(): void {
    setInterval(() => {
      this.calcScore();
    }, 100);
  }
}
