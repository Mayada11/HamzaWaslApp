import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PackageService } from 'src/app/services/package.service';
import { UsersService } from 'src/app/services/users.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap, tap } from 'rxjs';
@Component({
  selector: 'app-create-lesson',
  templateUrl: './create-lesson.component.html',
  styleUrls: ['./create-lesson.component.css']
})
export class CreateLessonComponent implements OnInit {
  user$ = this.usersService.currentUserProfile$;
  uid: string = ''
 signUpForm = this.fb.group(
    {
      className: ['', Validators.required],
      stage: ['', Validators.required],
      chapter: ['', Validators.required],
    },
  );
  constructor( private authService: AuthService,
    private router: Router,
    private toast: HotToastService,
    private usersService: UsersService,
    private fb: NonNullableFormBuilder,
    private route: ActivatedRoute,
    private packService: PackageService,) { }

  ngOnInit(): void {
  }

  get stage() {
    return this.signUpForm.get('stage');
  }
  get chapter() {
    return this.signUpForm.get('chapter');
  }
  get className() {
    return this.signUpForm.get('className');
  }

  submit() {
    const { className, chapter, stage} = this.signUpForm.value;
    if (!this.signUpForm.valid || !stage || !chapter || !className) {
      return;
    }
    this.usersService.currentUserProfile$
      .subscribe((user) => {
        this.uid = user?.uid as string
        this.usersService.addlessonsTeacher({ lessonID:chapter,teacherName:user?.displayName,teacherImg:(user?.photoURL)?user?.photoURL:"",teacherID: this.uid ,className:className,stage:stage}).pipe(
        ).pipe(
        
            this.toast.observe({
              success: ' تم اضافة الفصل بنجاح  ',
              loading: 'جاري الانشاء .....',
              error: ({ message }) => `${message}`,
      })
          ).subscribe(e=>{
              console.log(e);
              localStorage.setItem('userCreatedId',this.uid);
              //id of teacher lesson table
             this.router.navigate(['/classDetails', e['id']]);
      })

      })
  }
}
