import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LinkgenService } from '../../services/linkgen.service';
import { Getme, UserGetme } from '../../interfaces/getme';

@Component({
  selector: 'app-pub-prof',
  templateUrl: './pub-prof.component.html',
  styleUrls: ['./pub-prof.component.css']
})
export class PubProfComponent implements OnInit {

  getme_list:UserGetme[] = [];
  link:string;
  name:string;
  getme:Getme;
  usergetme:UserGetme;
  selectedGetme: UserGetme;
  getmes = [];
  bio:string;
  image_id:string;
  imgReady:Boolean;

  constructor(private route: ActivatedRoute, private linkgen: LinkgenService) { }

  ngOnInit(): void {
    this.imgReady = false;
    this.link = this.route.snapshot.paramMap.get('link');
    this.linkgen.getProfile_from_link(this.link).subscribe(data => {
      if(data.success){
        //console.log(data.profile);
        this.name = `${data.profile.firstname} ${data.profile.lastname}`;
        //this.getmes = data.profile.getme_views;
        for(var item of data.profile.getme_views){
        
          this.usergetme = {
            _id: item._id,
            topic: item.topic,
            issue: item.issue,
            view: item.view
          };
          this.getme_list.push(this.usergetme); 
        }
        //console.log(this.getme_list);
        this.bio = data.profile.bio;
        
        for(let i = 0; i < data.profile.prof_photo_ids.length; i++){
          if(data.profile.prof_photo_ids[i].current){
            this.image_id = data.profile.prof_photo_ids[i].image_id;
            
          }
        } 
        //this.image_id = data.profile.prof_photo_ids[0].image_id;
        this.imgReady = true;
      }
    });
  }

  showFullGetme(getme: UserGetme){
    this.selectedGetme = getme;
  }

}
