import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  google_auth(){
    this.authService.auth_GoogleUser().subscribe(data => {
      if(data.success) {
        this.router.navigate(['profile']);
      }
      else{
        this.router.navigate(['']);
      }
    });
  }


  fb_auth(){
    this.authService.auth_FacebookUser().subscribe(data =>  {  
      if(data.success){
        this.router.navigate(['profile']);
      }
      else{
        this.router.navigate(['']);
      }
    });
  }

  
}
