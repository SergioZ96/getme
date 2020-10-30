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
  showBioform = false;
  photoArray: Array<any>;
  bio: string;
  imageSrc = "../../../assets/img/default-profile.png";


  constructor(
    private authService: AuthService,
    private router: Router,
    public fileService: FileService
  ) { }

  ngOnInit(): void {
    this.fileService.getProfile().subscribe(data => {
      console.log("we are here");
      this.bio = data.profile.bio;
      this.photoArray = data.profile.prof_photo_ids;
      // we will loop through this photo_array in the front end 
      
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

  chooseCurrent(photoId){
    let status = this.photoArray.find(photo => photo.image_id === photoId);
    if(status.current){
      return;
    }
    this.fileService.currentImage(photoId).subscribe(data => {
      if(data.success){
        window.location.reload();
        console.log('Updated Profile Picture');
        
      }
      
    });
  }

  deletePhoto(photoId){
    this.fileService.deleteImage(photoId).subscribe(data => {
      if(data.success){
        window.location.reload();
        console.log('Deleted the image');
      }
    });
  }

  setBio(){
    this.fileService.postBio(this.bio).subscribe(data => {
      if(data.success){
        console.log("We have the bio");
      }
    });
  }
}
