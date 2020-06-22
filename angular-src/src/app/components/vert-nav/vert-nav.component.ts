import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-vert-nav',
  templateUrl: './vert-nav.component.html',
  styleUrls: ['./vert-nav.component.css']
})
export class VertNavComponent implements OnInit {

  constructor(private router: Router, public authService: AuthService ) { }

  ngOnInit(): void {
  }

  

}
