import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { ISocial } from 'src/app/models/isocial';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.css']
})
export class SocialMediaComponent implements OnInit {

  constructor(private userService: UsersService,
    private imageUploadService: ImageUploadService,
    private toast: HotToastService) { }
  soc?: ISocial
  socID: string = ""
  ngOnInit(): void {
    var society = localStorage.getItem("societyID");
    if (society != null) {
      this.socID = society

      if (society != null)
        this.userService.getSocietyById(society).subscribe(ele => {
          this.soc = ele
          console.log(ele)
        }

        )
    }
  }
  uploadFile(event: any, isProfile: boolean, socialID = this.socID) {
    const form = new FormData();
    form.append("file", event.target.files[0]);
    form.append("api_key", '692369785745284');
    form.append("api_secret", 'gOfP7XJmRMWk31Jn63CnuWc0X1g');
    form.append("upload_preset", "hellohello");
    form.append("cloud_name", "dcadewwme");

    this.imageUploadService
      .uploadImage(form)
      .pipe(
        this.toast.observe({
          loading: 'Uploading profile image...',
          success: 'Image uploaded successfully',
          error: 'There was an error in uploading the image',
        }),
      )
      .subscribe((data1) => {
        console.log(data1);
        var socialProfileImg = "";
        var socialBackImg = "";
        if (isProfile == true) {
          socialProfileImg = data1.url;
          this.userService.updateSociety({
            socialID,
            socialProfileImg
          }).subscribe(() => {
            window.location.reload();
          });
        } else {
          socialBackImg = data1.url
          this.userService.updateSociety({
            socialID,
            socialBackImg
          }).subscribe(() => {
            window.location.reload();
          });
        }


      });
  }

}
