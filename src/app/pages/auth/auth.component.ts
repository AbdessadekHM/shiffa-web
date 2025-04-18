import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  constructor(
    private subapabaseService: SupabaseService,
    private router: Router,
  ) {
    
  }

  ngOnInit(): void {
    this.subapabaseService.AuthenticationRedirect()
    
    this.subapabaseService.session$.subscribe((session) => {
      
      if(session){
        this.subapabaseService.hasProfile(session.user.id).then((hasProfile) => {
          if(hasProfile){
            this.router.navigate(['/dashboard']);
          }else{
            this.router.navigate(['/register']);
          }
        }
      )
        
      }
    }
  )
  }

}
