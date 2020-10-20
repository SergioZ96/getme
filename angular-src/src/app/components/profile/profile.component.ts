import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FileService } from '../../services/file.service';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  fileToUpload: File;

  constructor(
    private authService: AuthService,
    private router: Router,
    public fileService: FileService
  ) { }

  ngOnInit(): void {
  } 

  fileUpload(files: FileList){
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload.name);
  }

  submitFile(){
    this.fileService.postFile(this.fileToUpload).subscribe(data => {
      if(data.success){
        console.log( "The file was received on the backend!");
      }
    });
    this.fileToUpload = null;
  }
}
