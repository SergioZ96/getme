import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GService} from '../../services/g.service';
//import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wholeview',
  templateUrl: './wholeview.component.html',
  styleUrls: ['./wholeview.component.css']
})
export class WholeviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // provides access to information about a route associated with a component that is loaded in an outlet
    /* this.activatedRoute.paramMap.subscribe(()=> { // subscribe to paramMap property that contains a map of the req. and optional parameters specific to the route
      // topic, issue, and view are passed from childview
      this._id = window.history.state._id;
      this.topic = window.history.state.topic; 
      this.issue = window.history.state.issue;
      this.view = window.history.state.view;
    }); */


    
  }

  

}
