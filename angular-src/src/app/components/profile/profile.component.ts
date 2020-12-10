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
  editBool = false;
  /* changePic = false;
  showBioform = false; */
  photoArray: Array<any>;
  bio: string;
  currentBio: string;
  imageSrc = "../../../assets/img/default-profile.png";
  changeImage = false;


  constructor(
    private authService: AuthService,
    private router: Router,
    public fileService: FileService
  ) { }

  ngOnInit(): void {
    this.fileService.getProfile().subscribe(data => {
      this.currentBio = data.profile.bio;
      this.photoArray = data.profile.prof_photo_ids;
      // we will loop through this photo_array in the front end 
      
    });
  } 

  fileUpload(files: FileList){
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload.name);
  }

  submitFile(){
    if(this.fileToUpload != undefined && this.bio != this.currentBio){
      this.fileService.postFile(this.fileToUpload).subscribe(data => {
        if(data.success){
          this.fileToUpload = null;
        }
      });
      
      this.fileService.editBio(this.bio).subscribe(data => {
        if(data.success){
          this.currentBio = this.bio;
        }
      });

      window.location.reload();
    }

    else if(this.fileToUpload != undefined && this.bio == this.currentBio){
      this.fileService.postFile(this.fileToUpload).subscribe(data => {
        if(data.success){
          this.fileToUpload = null;
        }
      });
    
      window.location.reload();
    }

    else if((this.changeImage && this.bio != undefined ) || ( !this.changeImage && this.bio != undefined )){
      this.fileService.editBio(this.bio).subscribe(data => {
        if(data.success){
          this.currentBio = this.bio;
          this.changeImage = false;
        }
      });

      window.location.reload();
    }

    else if((this.changeImage && this.bio == undefined) || ( !this.changeImage && this.bio == undefined )){
      this.changeImage = false;
      window.location.reload();
    }

    else{
      this.fileService.editBio(this.bio).subscribe(data => {
        if(data.success){
          this.currentBio = this.bio;
          //window.location.reload();
        }
      }); 
    }
    
  }

  chooseCurrent(photoId){
    let status = this.photoArray.find(photo => photo.image_id === photoId);
    if(status.current){
      return;
    }
    this.fileService.currentImage(photoId).subscribe(data => {
      if(data.success){
        this.changeImage = true;
        //window.location.reload();
        //console.log('Updated Profile Picture');
        
      }
      
    });
  }

  deletePhoto(photoId){
    this.fileService.deleteImage(photoId).subscribe(data => {
      if(data.success){
        window.location.reload();
        //console.log('Deleted the image');
      }
    });
  }


}
