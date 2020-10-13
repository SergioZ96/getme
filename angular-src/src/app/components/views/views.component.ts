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
  isShow = true;
  selectedGetme: UserGetme;

  constructor(private router: Router, public gService: GService) { }

  loadList(){
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

  ngOnInit(): void {
    // Here is where we will use gService to retrieve the user's getme's from the database
    // by subscribing to an Observable
    if(this.getme_list.length == 0) this.loadList();
  }

  showGetmeForm(){
    this.isShow = !this.isShow;
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

    //refreshes page after getme is added, in order for a getme to be deleted later
    window.location.reload();
    //this.router.navigate(['/views']);

  }

  // receives an input from childview to update and use editGetme to save new getme to backend
  editGetme(upd_getme){
    this.gService.editGetme(upd_getme).subscribe(data => {
      if(data.success) {
        console.log("Updated Getme");
      }
    });
  }
  

  delGetme(_id: string) {
    /* window.location.reload();
    this.router.navigate(['/views']); */
    // put topic in JSON because Express by default accepts requests with content-types: 'application/json', 'application/x-www-form-urlencoded', 'multipart/form-data'
    this.gService.deleteGetme(_id).subscribe(data => {
      if(data.success) {
        console.log("Deleted Getme");
        
        // filtering out the the topic of the getme that we want to delete and returns a new getme list
        this.getme_list = this.getme_list.filter(getme => getme._id !== data._id);

        
        //this.getme_list = []; //emptying getme_list
        //this.loadList();      //reloading new list
      }
    });

  }

  showFullGetme(getme: UserGetme){
    this.selectedGetme = getme;
  }
}
