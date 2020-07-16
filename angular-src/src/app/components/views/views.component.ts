import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Getme } from '../../interfaces/getme';

@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.css'],
  
})
export class ViewsComponent implements OnInit {
  getme_list: Getme[] = [];
  getme: Getme;
  topic: string;
  issue: string;
  view: string; 

  constructor(private router: Router, public authService: AuthService) { }

  ngOnInit(): void {
    // Here is where we will use authService to retrieve the user's getme's from the database
    // by subscribing to an Observable
    this.authService.loadGetme().subscribe(data => {
      if(data.success){
      
        for(var item of data.getme_views.getme_views){
          
          this.getme = {
            topic: item.topic,
            issue: item.issue,
            view: item.view
          };
          this.getme_list.push(this.getme); 
        }
        //console.log(this.getme_list);
      }
      
    });
  }

  onGetmeSubmit(){
    this.getme = {
      topic: this.topic,
      issue: this.issue,
      view: this.view
    };

    this.getme_list.push(this.getme);

    this.authService.addGetme(this.getme).subscribe(data => {
      if(data.success){
        console.log("Added your Getme!");
      }
    });

  }

}
