import { Component, OnInit } from '@angular/core';
import { LinkgenService } from '../../services/linkgen.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  link:string;

  constructor(private linkgen: LinkgenService) { }

  ngOnInit(): void {
  }

  generateLink(){
    this.link = "";
    let test_link = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 15; i++){
      test_link += possible.charAt(Math.floor(Math.random() * possible.length - 1));
    }

    this.linkgen.updateLink(test_link).subscribe(data => {
      if(data.success){
        this.link = test_link;
      }
    });

  }

}
