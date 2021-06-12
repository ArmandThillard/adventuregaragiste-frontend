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
    // if (this._multiplier && this.product) this.calcMaxCanBuy();
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
