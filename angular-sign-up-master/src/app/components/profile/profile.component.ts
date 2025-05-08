import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap, tap } from 'rxjs';
import { ProfileUser } from 'src/app/models/user';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { UserCatService } from 'src/app/services/user-cat.service';
import { UsersService } from 'src/app/services/users.service';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user$ = this.usersService.currentUserProfile$;
  userCat?:string
  profileForm = this.fb.group({
    uid: [''],
    displayName: [''],
    firstName: [''],
    lastName: [''],
    phone: [''],
    address: [''],
  });

  constructor(
    private imageUploadService: ImageUploadService,
    private toast: HotToastService,
    private usersService: UsersService,
    private fb: NonNullableFormBuilder,
    private usCatService:UserCatService
  ) {}

  ngOnInit(): void {
    this.usersService.currentUserProfile$
      .pipe(untilDestroyed(this), tap(console.log))
      .subscribe((user) => {
        this.userCat = this.usCatService.getUserCat(user?.userCategory as number);
      });
  }

  uploadFile(event: any, { uid }: ProfileUser) {
    const form = new FormData();
    form.append("file",event.target.files[0]);
    form.append("api_key", '692369785745284');
    form.append("api_secret", 'gOfP7XJmRMWk31Jn63CnuWc0X1g');
    form.append("upload_preset","hellohello");
    form.append("cloud_name","dcadewwme");

    this.imageUploadService
      .uploadImage(form)
      .pipe(
        this.toast.observe({
          loading: 'Uploading profile image...',
          success: 'Image uploaded successfully',
          error: 'There was an error in uploading the image',
        }),
        // switchMap((photo) =>{
        //  const photoURL = photo.data.url;
        //   this.usersService.updateUser({
        //     uid,
        //     photoURL,
        //   })}
        //)
      )
      .subscribe((data1)=>{
        console.log(data1);
        var photoURL = data1.url;
        this.usersService.updateUser({
              uid,
              photoURL,
             })

      });
  }

  saveProfile() {
    const { uid, ...data } = this.profileForm.value;

    if (!uid) {
      return;
    }

    this.usersService
      .updateUser({ uid, ...data })
      .pipe(
        this.toast.observe({
          loading: 'Saving profile data...',
          success: 'Profile updated successfully',
          error: 'There was an error in updating the profile',
        })
      )
      .subscribe();
  }
}
