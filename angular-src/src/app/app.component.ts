import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { MqService } from '../app/services/mq.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-src';
  watcher: Subscription;
  deviceSize: Object;
  data: string;
 
  constructor(private mediaObserver: MediaObserver, private mq: MqService){}
  ngOnInit(){
    this.deviceSize = {"xs": false,
                       "sm": false,
                       "md": false,
                       "lg": false,
                       "xl": false};

    this.watcher = this.mediaObserver.asObservable()
        .subscribe((change: MediaChange[]) => {
          Object.keys(this.deviceSize).forEach(key => {
            //console.log(key);
             if(key == change[0].mqAlias){
               if(change[0].mqAlias == "xs"){
                 this.mq.setData('xs');
               }
              this.deviceSize[key] = true;
            }
            else{
              this.deviceSize[key] = false;
            } 
          }); 
          //console.log(change[0].mqAlias);
          console.log(this.deviceSize); 
        });
  }
  ngOnDestroy(){
    this.watcher.unsubscribe();
  }
}
