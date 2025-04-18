import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


import { Observable } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import { authenticatedNavBarUser, NavBarElement, unAuthenticatedNavBar } from '../../models';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isDarkMode$: Observable<boolean>;
  isAuthenticated: boolean = false;

  renderedNavBar: NavBarElement[] | undefined;

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private supabase: SupabaseService
  ) {
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }
  ngOnInit(): void {

    const user = this.supabase.getCurrentUser();
    //console.log("from navbar + " , user)
    //if(user){
      
      //this.isAuthenticated = true;
      //this.renderedNavBar = authenticatedNavBarUser;
    //}else{

      //this.isAuthenticated = false;
      //this.renderedNavBar = unAuthenticatedNavBar;
    //}
    
    
    this.supabase.session$.subscribe((session) => {
      console.log("session", session)
      if(session){

        this.isAuthenticated = true;
        this.renderedNavBar = authenticatedNavBarUser;

      }else{

        this.isAuthenticated = false;
        this.renderedNavBar = unAuthenticatedNavBar;
        this.renderedNavBar[2].callBack = () => {
          console.log("signing out")
//          this.supabase.signOut();
 //         this.router.navigate(['/']);
        }
      }

    })
    


    
    //this.isAuthenticated = this.supabase.hasProfile(user?.id).then((res) => {

      //this.isAuthenticated = true;
      //this.renderedNavBar = authenticatedNavBarUser;

    //}).catch((err) => {
      //console.log(err)
      //this.isAuthenticated = false;
    //})
  }


  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  print(): void {
    
  }
  signOut():void{
    this.supabase.signOut().then(() => {
      this.router.navigate(['/']);
    }).catch((err) => {
      console.log(err)
    })
  }
}
