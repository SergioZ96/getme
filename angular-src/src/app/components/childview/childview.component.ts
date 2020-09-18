import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Getme } from '../../interfaces/getme';

@Component({
  selector: 'app-childview',
  templateUrl: './childview.component.html',
  styleUrls: ['./childview.component.css']
})
export class ChildviewComponent implements OnInit {
  @Input() getme_list: Getme[];
  // Output and EventEmitter work hand-in-hand
  @Output() delGetmeEvent = new EventEmitter<string>();

  deleteGetme(value: string) {
    this.delGetmeEvent.emit(value);
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
