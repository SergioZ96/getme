import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GService } from '../../services/g.service';
import { Getme, UserGetme } from '../../interfaces/getme';

@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.css'],
  
})
export class ViewsComponent implements OnInit {
  getme_list: UserGetme[] = [];
  getme: Getme;
  usergetme: UserGetme;
  _id: string;
  topic: string;
  issue: string;
  view: string; 

  constructor(private router: Router, public gService: GService) { }

  ngOnInit(): void {
    // Here is where we will use authService to retrieve the user's getme's from the database
    // by subscribing to an Observable
    this.gService.loadGetme().subscribe(data => {
      if(data.success){
      
        for(var item of data.getme_views.getme_views){
          
          this.usergetme = {
            _id: item._id,
            topic: item.topic,
            issue: item.issue,
            view: item.view
          };
          this.getme_list.push(this.usergetme); 
        }
      }
      
    });
  }

  onGetmeSubmit(){
    this.getme = {
      topic: this.topic,
      issue: this.issue,
      view: this.view
    };

    //this.getme_list.push(this.getme);

    // The new getme id is returned and pushed on to the usergetme list
    this.gService.addGetme(this.getme).subscribe(data => {
      if(data.success){
        console.log("Added your Getme!");
        // creating usergetme with _id response that we received from backend
        this.usergetme = {
          _id: data.new_id,
          topic: this.topic,
          issue: this.issue,
          view: this.view
        };

        this.getme_list.push(this.usergetme);
      }
    });

  }
  

  delGetme(_id: string) {
    // filtering out the the topic of the getme that we want to delete and returns a new getme list
    this.getme_list = this.getme_list.filter(getme => getme._id !== _id);

    // put topic in JSON because Express by default accepts requests with content-types: 'application/json', 'application/x-www-form-urlencoded', 'multipart/form-data'
    this.gService.deleteGetme({_id: _id}).subscribe(data => {
      if(data.success) {
        console.log("Deleted Getme");
        
      }
    });
  }
}
