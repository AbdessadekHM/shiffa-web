import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { AboutUsComponent } from "../../components/about-us/about-us.component";
import { ContactUsComponent } from "../../components/contact-us/contact-us.component";



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, AboutUsComponent, ContactUsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
