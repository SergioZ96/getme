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
  isImage = false;
  changePic = false;
  photoArray: Array<any>;
  imageSrc = "../../../assets/img/default-profile.png";


  constructor(
    private authService: AuthService,
    private router: Router,
    public fileService: FileService
  ) { }

  ngOnInit(): void {
    this.fileService.getProfile().subscribe(data => {
      console.log("we are here");
      this.photoArray = data.profile.prof_photo_ids;
      for(let i = 0; i < this.photoArray.length; i++){
        console.log(this.photoArray[i].current)
        if(this.photoArray[i].current){
          //create an image element with the image id as req param 
          //or modify the path for the one that we already have
          this.imageSrc = `http://localhost:3000/profile_images/${this.photoArray[i].image_id}`;
          
        }
      }
    });
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
