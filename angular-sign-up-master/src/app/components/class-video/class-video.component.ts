import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-class-video',
  templateUrl: './class-video.component.html',
  styleUrls: ['./class-video.component.css']
})
export class ClassVideoComponent implements OnInit {
videoURL?:string
  constructor() {
    var videoURL = localStorage.getItem("videoURL");
    if(videoURL != undefined){
      this.videoURL = videoURL;
    }
   }

  ngOnInit(): void {
  }

}
