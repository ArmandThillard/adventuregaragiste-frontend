import { Component, QueryList, ViewChildren } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductComponent } from './product/product.component';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import { TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  world: World = new World();
  server: string;
  multiplier = 'x1';
  multiplierValues = ['x1', 'x10', 'x100', 'xMax'];
  username: string;
  showManagers = false;
  badgeManagers = 0;
  badgeUpgrades = 0;
  showUnlocks = false;
  showUpgrades = false;
  showInvestors = false;
  angelsToClaim = 0;
  badgeAngelUpgrades = 0;

  @ViewChildren(ProductComponent)
  productsComponent: QueryList<ProductComponent>;

  @Component({
    selector: 'material-app',
    templateUrl: 'app.component.html',
  })
  title = 'adventuregaragiste-frontend';

  constructor(
    private service: RestserviceService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.server = service.server;
    this.username = localStorage.getItem('username');
    this.service.user = this.username;
    this.playAudio();
    service.getWorld().then((world) => {
      this.world = world;
      this.calcAngels();
      this.calcBadges();
    });
  }

  @ViewChild('secondDialog', { static: true }) secondDialog: TemplateRef<any>;

  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef);
  }
  openDialogWithoutRef() {
    this.dialog.open(this.secondDialog);
  }

  onUsernameChanged() {
    localStorage.setItem('username', this.username);
    this.service.user = this.username;
    this.service.getWorld().then((world) => {
      this.world = world;
      this.calcAngels();
      this.calcBadges();
    });
  }

  onBuy(cost: number) {
    this.world.money -= cost;
    this.calcBadges();
    let minQuantity = this.world.allunlocks.pallier[0].seuil;
    for (let p of this.world.products.product) {
      if (p.quantite < minQuantity) {
        minQuantity = p.quantite;
      }
    }
    for (let unlock of this.world.allunlocks.pallier) {
      if (minQuantity >= unlock.seuil && !unlock.unlocked) {
        unlock.unlocked = true;
        this.productsComponent.forEach((p) => p.callUpgrade(unlock));
        this.popMessage(
          unlock.name + ' ' + unlock.typeratio + ' x' + unlock.ratio
        );
      }
    }
  }

  nextMultiplier() {
    let currentMultiplierIndex = this.multiplierValues.indexOf(this.multiplier);
    let nextMultiplierIndex = currentMultiplierIndex + 1;
    if (this.multiplierValues.length === nextMultiplierIndex) {
      nextMultiplierIndex = 0;
    }
    this.multiplier = this.multiplierValues[nextMultiplierIndex];
  }

  onProductionDone(product: Product) {
    this.world.money +=
      product.quantite *
      product.revenu *
      (1 + (this.world.activeangels * this.world.angelbonus) / 100);
    this.world.score +=
      product.quantite *
      product.revenu *
      (1 + (this.world.activeangels * this.world.angelbonus) / 100);
    this.calcBadges();
    this.calcAngels();
  }

  hireManager(manager: Pallier) {
    this.world.money -= manager.seuil;
    manager.unlocked = true;
    this.world.products.product[manager.idcible - 1].managerUnlocked = true;
    this.popMessage('Félicitations ! ' + manager.name + ' a été embauché !');
    this.calcBadges();
    this.service.putManager(manager);
  }

  buyUpgrade(upgrade: Pallier) {
    this.world.money -= upgrade.seuil;
    this.spreadUpgrade(upgrade);
    this.service.putUpgrade(upgrade);
  }

  buyAngelUpgrade(upgrade: Pallier) {
    this.world.activeangels -= upgrade.seuil;
    this.spreadUpgrade(upgrade);
    this.service.putAngelUpgrade(upgrade);
  }

  spreadUpgrade(upgrade: Pallier) {
    upgrade.unlocked = true;
    let msg = upgrade.name + ' ';
    switch (upgrade.idcible) {
      case -1:
        this.world.angelbonus += upgrade.ratio;
        msg += 'angel investors effectivenes +' + upgrade.ratio + '%';
        break;
      case 0:
        msg += 'all profits x' + upgrade.ratio;
        this.productsComponent.forEach((p) => p.callUpgrade(upgrade));
        break;
      default:
        this.productsComponent.forEach((p) => {
          if (upgrade.idcible === p.product.id) {
            p.callUpgrade(upgrade);
            msg += p.product.name + ' ';
            if (upgrade.typeratio === 'quantite') {
              msg += 'quantity +' + upgrade.ratio;
            } else {
              msg += upgrade.typeratio + ' x' + upgrade.ratio;
            }
          }
        });
        break;
    }
    this.popMessage(msg);
    this.calcBadges();
  }

  popMessage(message: string): void {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  calcBadges() {
    this.badgeManagers = 0;
    this.badgeUpgrades = 0;
    this.badgeAngelUpgrades = 0;
    for (let m of this.world.managers.pallier) {
      if (!m.unlocked && this.world.money >= m.seuil) {
        this.badgeManagers++;
      }
    }
    for (let u of this.world.upgrades.pallier) {
      if (!u.unlocked && this.world.money >= u.seuil) {
        this.badgeUpgrades++;
      }
    }
    for (let au of this.world.angelupgrades.pallier) {
      if (!au.unlocked && this.world.activeangels >= au.seuil) {
        this.badgeAngelUpgrades++;
      }
    }
  }

  calcAngels() {
    this.angelsToClaim =
      150 * Math.sqrt(this.world.score / Math.pow(10, 15)) -
      this.world.totalangels;
  }

  /**
   * @todo appeler l'API Rest pour reset le monde
   * Mettre à jour les propriétés totalangels
   */
  claimAngels() {
    this.service.deleteWorld();
    this.service.getWorld().then((world) => {
      this.world = world;
      this.calcAngels();
      this.calcBadges();
    });
  }

  playAudio() {
    let audio = new Audio();
    audio.src = 'http://localhost:8081/icones/musique4.mp3';
    audio.loop = true;
    audio.load();
    audio.play();
  }
}
