import { Component } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product } from './world';

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

  title = 'adventuregaragiste-frontend';

  constructor(private service: RestserviceService) {
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
  }
}
