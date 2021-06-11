import { Component } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Pallier, Product } from './world';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  world: World = new World();
  server: string;

  title = 'adventuregaragiste-frontend';

  constructor(private service: RestserviceService) {
    this.server = service.server;
    service.getWorld().then((world) => {
      this.world = world;
    });
  }
}
