import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Getme, UserGetme } from '../../interfaces/getme';

@Component({
  selector: 'app-childview',
  templateUrl: './childview.component.html',
  styleUrls: ['./childview.component.css']
})
export class ChildviewComponent implements OnInit {
  @Input() getme: UserGetme;
  // Output and EventEmitter work hand-in-hand
  @Output() delGetmeEvent = new EventEmitter<string>();
  @Output() updateGetmeEvent = new EventEmitter<any>();
  selectedGetme: UserGetme;

  upd_topic: string;
  upd_issue: string;
  upd_view: string;

  needToUpdate = false;

  update_button() {
    this.needToUpdate = true;
    // Allows us to prefill values from selected getme upon pressing update button
    // and modeling our upd values to the update form
    this.upd_topic = this.getme.topic;
    this.upd_issue = this.getme.issue;
    this.upd_view = this.getme.view;
  }

  save_button(){
    // Using the current getme, and assigning changes in following fields 
    // to that getme and emitting the updated getme to the parent component
    this.getme.topic = this.upd_topic;
    this.getme.issue = this.upd_issue;
    this.getme.view = this.upd_view;
    this.updateGetmeEvent.emit(this.getme);
    // Hiding update form after pressing save button
    this.needToUpdate = false;
  }

  deleteGetme(value: string) {
    this.delGetmeEvent.emit(value);
    // used to erase deleted getme values from UI
    this.getme.topic = "";
    this.getme.issue = "";
    this.getme.view = "";
  }
  
  constructor() { }

  ngOnInit(): void {
    /* if(this.getme){
      this.getme_view.topic = this.getme.topic;
      this.getme_view.issue = this.getme.issue;
      this.getme_view.view = this.getme.view;
    }  */

  }

}
