import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';

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

  title = 'adventuregaragiste-frontend';

  constructor(
    private service: RestserviceService,
    private snackBar: MatSnackBar
  ) {
    this.server = service.server;
    service.getWorld().then((world) => {
      this.world = world;
    });
    this.username = localStorage.getItem('username');
  }

  onUsernameChanged() {
    localStorage.setItem('username', this.username);
    this.service.user = this.username;
    this.service.getWorld();
  }

  onBuy(cost: number) {
    this.world.money -= cost;
    this.calcManagersCanBuy();
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
    this.world.money += product.revenu;
    this.world.score += product.revenu;
    this.service.putProduct(product);
    this.calcManagersCanBuy();
  }

  hireManager(manager: Pallier) {
    this.world.money -= manager.seuil;
    manager.unlocked = true;
    this.world.products.product[manager.idcible - 1].managerUnlocked = true;
    this.popMessage('Félicitations ! ' + manager.name + ' a été embauché !');
    this.calcManagersCanBuy();
  }

  popMessage(message: string): void {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  calcManagersCanBuy() {
    this.badgeManagers = 0;
    for (let m of this.world.managers.pallier) {
      if (!m.unlocked && this.world.money >= m.seuil) {
        this.badgeManagers++;
      }
    }
  }
}
