import { Component, OnInit } from '@angular/core';
import { LinkgenService } from '../../services/linkgen.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private linkgen: LinkgenService) { }

  ngOnInit(): void {
  }

  generateLink(){
    
  }

}
