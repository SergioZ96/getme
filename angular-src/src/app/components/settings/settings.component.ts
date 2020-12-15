import { Component, OnInit } from '@angular/core';
import { LinkgenService } from '../../services/linkgen.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  link:string;
  copy:string;
  isCopied:boolean;

  constructor(private linkgen: LinkgenService) { }

  ngOnInit(): void {
    this.isCopied = false;
    this.linkgen.getLink().subscribe(data => {
      if(data.success){
        this.link = data.link;
      }
    });

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

  copyLink(){
    const selLink = document.createElement('textarea');
    selLink.style.position = 'fixed';
    selLink.style.left = '0';
    selLink.style.top = '0';
    selLink.style.opacity = '0';
    selLink.value = `getmeweb.app/${this.link}`;
    document.body.appendChild(selLink);
    selLink.focus();
    selLink.select();
    document.execCommand('copy');
    document.body.removeChild(selLink);
    this.isCopied = true;
  }

}
