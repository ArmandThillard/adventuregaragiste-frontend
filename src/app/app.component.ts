import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'adventuregaragiste-frontend'
  server= "http://localhost:8081/"
  user= ""
}
