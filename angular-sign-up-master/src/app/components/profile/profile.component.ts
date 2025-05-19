import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Chart } from 'chart.js';
import { Observable, forkJoin, map, of, startWith, switchMap, take, tap } from 'rxjs';
import { ProfileUser } from 'src/app/models/user';
import { UserPackage } from 'src/app/models/user-package';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { PackageService } from 'src/app/services/package.service';
import { UserCatService } from 'src/app/services/user-cat.service';
import { UsersService } from 'src/app/services/users.service';
import { registerables } from 'chart.js';
import { IMeetings } from 'src/app/models/imeetings';

interface ScheduleFormControls {
  selectedUsers: FormControl<ProfileUser[]>;
  MeetingName: FormControl<string>;
  MeetingLink: FormControl<string>;
  MeetingDate: FormControl<string>;
  MeetingTime: FormControl<string>;
}

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef;

  userDataLoaded = false
  teacherID:string=''
  user$ = this.usersService.currentUserProfile$;
  userCat?:string
  packages?:UserPackage;
  meetingLinks:IMeetings[]=[]
  teacherName:any
    chartData: number[] = [55, 49, 25]; // البيانات الفعلية للرسم البياني
  chartLabels:any;
socials?:any[]
  profileForm = this.fb.group({
    uid: [''],
    displayName: [''],
    firstName: [''],
    lastName: [''],
    phone: [''],
    address: [''],
  });
  scheduleForm = new FormGroup<ScheduleFormControls>({
    selectedUsers: new FormControl<ProfileUser[]>([], { nonNullable: true, validators: [Validators.required] }),
    MeetingName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    MeetingLink: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    MeetingDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    MeetingTime: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });
    
  userCtrl = new FormControl('');
  allUsers: ProfileUser[] = []; // لازم تجيبيهم من Firestore
  filteredUsers$: Observable<ProfileUser[]>;
  selectedUsers: ProfileUser[] = [];
  searchCtrl = new FormControl('');

  constructor(
    private imageUploadService: ImageUploadService,
    private toast: HotToastService,
    private usersService: UsersService,
    private fb: NonNullableFormBuilder,
    private usCatService:UserCatService,
    private packageService:PackageService
  ) {
    Chart.register(...registerables);

    // Initialize filtered users
    this.filteredUsers$ = this.searchCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: string): ProfileUser[] {
    const filterValue = value.toLowerCase();
    console.log('Filtering with value:', filterValue);
    const filteredUsers = this.allUsers.filter(user => 
      (user.displayName?.toLowerCase().includes(filterValue)) ||
      (user.uid?.toLowerCase().includes(filterValue))
    );
    console.log('Filtered Users:', filteredUsers);
    return filteredUsers;
  }

  get userID() {
    return this.scheduleForm.get('userID');
  }
  get MeetingName() {
    return this.scheduleForm.get('MeetingName');
  }
  get MeetingLink() {
    return this.scheduleForm.get('MeetingLink');
  }
  get MeetingDate() {
    return this.scheduleForm.get('MeetingDate');
  }
   

  
  ngOnInit(): void {
    this.usersService.currentUserProfile$
      .pipe(untilDestroyed(this))
      .subscribe((user) => {
        if (!user) return;

        // Get all users first
        this.usersService.getAllUsers().subscribe(users => {
          // Filter out the current user
          this.allUsers = users.filter(user1 => user1.uid !== user.uid);
          console.log('Available Users:', this.allUsers);
          
          // Initialize filteredUsers$ with all users initially
          this.searchCtrl.setValue('');  // This will trigger the valueChanges and show all users
        });

        // Set up the filteredUsers$ observable
        this.filteredUsers$ = this.searchCtrl.valueChanges.pipe(
          startWith(''),
          map(value => {
            console.log('Search Value:', value);
            if (typeof value === 'string') {
              return this._filter(value);
            }
            // If no search value, return all users
            return this.allUsers;
          })
        );

        if(user.userCategory === '4'){
          this.chartLabels = ["إتمام الواجبات", "مشاهدة الحصص", "التفاعل مع المجتمع"];
        } else {
          this.chartLabels = ["عمل مجتمعات", "عمل اجتماعات", "التفاعل مع المجتمع"];
        }

        this.usersService.getSocietiesByUserId(user.uid).subscribe(e => {
          this.socials = e;
          console.log(e);
        });

        this.userDataLoaded = true;
        const userCategory = user.userCategory ? parseInt(user.userCategory) : 0;
        this.userCat = this.usCatService.getUserCat(userCategory);
        this.packages = this.packageService.getPackageByID(user.packageID || 0);
        this.teacherName = user.displayName;
        this.teacherID = user.uid;

        if(user.userCategory === '3'){
          this.usersService.getmeetingDataTeacher(user.uid).subscribe(ele => {
            console.log(ele);
            this.meetingLinks = ele;
             this.meetingLinks = this.meetingLinks.filter(
   (meeting, index, self) =>
    !!meeting.MeetingLink &&
    index === self.findIndex(m => m.MeetingLink === meeting.MeetingLink)
);
          });
        } else {
          this.usersService.getmeetingData(user.uid).subscribe(ele => {
            console.log(ele);
            this.meetingLinks = ele;
          });
        }
      });
  }
goToLink(url: string){
    window.open(url, "_blank");
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
  submit() {
    if (!this.scheduleForm.valid) return;

    const formValue = this.scheduleForm.value;
    const selectedUsersControl = this.scheduleForm.get('selectedUsers');
    
    if (!selectedUsersControl || !formValue.MeetingName || !formValue.MeetingLink || 
        !formValue.MeetingDate || !formValue.MeetingTime) {
      return;
    }

    const selectedUsers = selectedUsersControl.value as ProfileUser[];
    
    if (!selectedUsers.length) {
      return;
    }

    // Combine date and time
    const meetingDate = new Date(formValue.MeetingDate);
    const [hours, minutes] = (formValue.MeetingTime || '').split(':');
    meetingDate.setHours(parseInt(hours || '0'), parseInt(minutes || '0'));

    // Format the date as a string
    const formattedDate = meetingDate.toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Create an array of observables for each user
    const meetingObservables = selectedUsers.map((user: ProfileUser) => 
      this.usersService.addMeeting({
        userID: user.uid,
        MeetingName: formValue.MeetingName || '',
        MeetingLink: formValue.MeetingLink || '',
        MeetingDate: formattedDate,
        TeacherID: this.teacherID,
        TeacherName: this.teacherName,
        participants: selectedUsers.map(u => ({
          uid: u.uid,
          displayName: u.displayName || '',
          photoURL: u.photoURL || ''
        }))
      })
    );

    // Use forkJoin to wait for all meetings to be added
    forkJoin(meetingObservables)
      .pipe(
        this.toast.observe({
          success: 'تم إضافة الاجتماعات بنجاح',
          loading: 'جاري إضافة الاجتماعات...',
          error: 'حدث خطأ في إضافة الاجتماعات'
        })
      )
      .subscribe(() => {
        // Close the modal
        this.closeModal.nativeElement.click();
        // Reset form and selected users
        this.scheduleForm.reset();
        this.selectedUsers = [];
      });
  }
  deleteMeeting(link?:string){
    if(link!=null)
this.usersService.deleteMeetingById(link).pipe(
       this.toast.observe({
          success: 'تم حذف الاجتماع بنجاح',
          loading: 'يتم حذف ..... ',
          error:'لم يتم الحذف ',
        })
).subscribe()
  }
 
  selectUser(user: ProfileUser) {
    const index = this.selectedUsers.findIndex(u => u.uid === user.uid);
    if (index === -1) {
      this.selectedUsers.push(user);
    }
    this.searchCtrl.setValue('');
    this.scheduleForm.patchValue({ selectedUsers: this.selectedUsers });
  }

  removeUser(user: ProfileUser) {
    const index = this.selectedUsers.findIndex(u => u.uid === user.uid);
    if (index !== -1) {
      this.selectedUsers.splice(index, 1);
      this.scheduleForm.patchValue({ selectedUsers: this.selectedUsers });
    }
  }
 }
