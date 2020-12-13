import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MqService {
  private data = new BehaviorSubject('default data');
  data$ = this.data.asObservable();

  constructor() { }

  setData(data: string){
    this.data.next(data);
  }
}
