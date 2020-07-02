import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.css']
})
export class ViewsComponent implements OnInit {

  topic: String;
  issue: String;
  view: String;

  constructor(private router: Router, public authService: AuthService) { }

  ngOnInit(): void {
  }

  onGetmeSubmit(){
    const getme = {
      topic: this.topic,
      issue: this.issue,
      view: this.view
    };

    this.authService.addGetme(getme).subscribe(data => {
      if(data.success){
        console.log("Added your Getme!");
      }
    });

  }

}
