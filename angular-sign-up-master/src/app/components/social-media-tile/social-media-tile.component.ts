import { Component, Input, OnInit } from '@angular/core';
import { ISocial } from 'src/app/models/isocial';

@Component({
  selector: 'app-social-media-tile[social]',
  templateUrl: './social-media-tile.component.html',
  styleUrls: ['./social-media-tile.component.css']
})
export class SocialMediaTileComponent implements OnInit {
 @Input()  social!: ISocial;
  constructor() { }

  ngOnInit(): void {
  }

}
