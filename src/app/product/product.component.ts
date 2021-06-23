import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Pallier, Product } from 'src/app/world';
import { RestserviceService } from '../restservice.service';

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
  lastUpdate = 0;
  private _money: number;
  neededMoney: number;
  nbCanBuy: number;
  isDisabled: boolean;

  constructor(
    private service: RestserviceService,
    private snackBar: MatSnackBar
  ) {}

  @Input()
  set prod(value: Product) {
    this._product = value;
    if (this.product && this.product.timeleft > 0) {
      this.lastUpdate = Date.now();
      this.progressBarValue =
        (this.product.vitesse - this.product.timeleft) / this.product.vitesse;
    }
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

  @Output() notifyBuy: EventEmitter<number> = new EventEmitter<number>();

  calcScore() {
    if (
      this._product.timeleft !== 0 ||
      (this._product.managerUnlocked && this._product.quantite > 0)
    ) {
      let currentDate = Date.now();
      this._product.timeleft -= currentDate - this.lastUpdate;
      this.lastUpdate = currentDate;
      if (this._product.timeleft <= 0) {
        // On prévient le composant parent que ce produit a généré son revenu
        this.notifyProduction.emit(this._product);
        // Réinitialiser les variables
        this._product.timeleft = this._product.managerUnlocked
          ? this._product.vitesse
          : 0;
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
        this.neededMoney =
          (this._product.cout *
            (1 - Math.pow(this._product.croissance, this.nbCanBuy))) /
          (1 - this._product.croissance);
        break;
      case 'x10':
        this.nbCanBuy = 10;
        this.neededMoney =
          (this._product.cout *
            (1 - Math.pow(this._product.croissance, this.nbCanBuy))) /
          (1 - this._product.croissance);
        break;
      case 'x100':
        this.nbCanBuy = 100;
        this.neededMoney =
          (this._product.cout *
            (1 - Math.pow(this._product.croissance, this.nbCanBuy))) /
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
    this.isDisabled = this._money <= this.neededMoney ? true : false;
  }

  buy() {
    this._product.quantite += this.nbCanBuy;
    this._product.cout =
      this._product.cout * Math.pow(this._product.croissance, this.nbCanBuy);
    for (let unlock of this._product.palliers.pallier) {
      if (this._product.quantite >= unlock.seuil && !unlock.unlocked) {
        unlock.unlocked = true;
        this.popMessage(
          unlock.name +
            ' ' +
            this._product.name +
            ' ' +
            unlock.typeratio +
            ' x' +
            unlock.ratio
        );
        switch (unlock.typeratio) {
          case 'vitesse':
            this._product.vitesse = this._product.vitesse / unlock.ratio;
            this._product.timeleft = this._product.timeleft / unlock.ratio;
            break;
          case 'revenu':
            this._product.revenu = this._product.revenu * unlock.ratio;
            break;
          default:
            break;
        }
      }
    }
    this.service.putProduct(this._product);
    this.notifyBuy.emit(this.neededMoney);
  }

  startFabrication() {
    if (this._product.timeleft === 0 && this._product.quantite > 0) {
      this._product.timeleft = this._product.vitesse;
      this.lastUpdate = Date.now();
      if (!this._product.managerUnlocked) {
        this.service.putProduct(this._product);
      }
    }
  }

  callUpgrade(pallier: Pallier) {
    switch (pallier.typeratio) {
      case 'vitesse':
        this._product.vitesse = this._product.vitesse / pallier.ratio;
        this._product.timeleft = this._product.timeleft / pallier.ratio;
        break;
      case 'gain':
        this._product.revenu = this._product.revenu * pallier.ratio;
        break;
      case 'quantite':
        this._product.quantite += pallier.ratio;
        break;
      default:
        break;
    }
  }

  popMessage(message: string): void {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  ngOnInit(): void {
    setInterval(() => {
      this.calcScore();
      this.calcMaxCanBuy();
    }, 100);
  }
}
