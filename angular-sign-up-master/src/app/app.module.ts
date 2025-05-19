import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http'
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { HomeComponent } from './components/home/home.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { HotToastModule } from '@ngneat/hot-toast';
import { LandingComponent } from './components/landing/landing.component';
import { MatMenuModule } from '@angular/material/menu';
import { ProfileComponent } from './components/profile/profile.component';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { SignOptionComponent } from './components/sign-option/sign-option.component';
import {MatRadioModule} from '@angular/material/radio';
import { SignSuccessComponent } from './components/sign-success/sign-success.component';
import { PackagesComponent } from './components/packages/packages.component';
import { SocialMediaComponent } from './components/social-media/social-media.component';
import { SocialRegisterComponent } from './components/social-register/social-register.component';
import { LiveVideoComponent } from './components/live-video/live-video.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ClassListComponent } from './components/class-list/class-list.component';
import { ClassDetailsComponent } from './components/class-details/class-details.component';
import { ClassVideoComponent } from './components/class-video/class-video.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MainservicesComponent } from './components/mainservices/mainservices.component';
import { SocialMediaListComponent } from './components/social-media-list/social-media-list.component';
import { SocialMediaTileComponent } from './components/social-media-tile/social-media-tile.component';
import { StudentSocietyEnrollComponent } from './components/student-society-enroll/student-society-enroll.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    LandingComponent,
    HomeComponent,
    ProfileComponent,
    SignOptionComponent,
    SignSuccessComponent,
    PackagesComponent,
    SocialMediaComponent,
    SocialRegisterComponent,
    LiveVideoComponent,
    AboutUsComponent,
    ClassListComponent,
    ClassDetailsComponent,
    ClassVideoComponent,
    NotFoundComponent,
    MainservicesComponent,
    SocialMediaListComponent,
    SocialMediaTileComponent,
    StudentSocietyEnrollComponent,
  ],
  imports: [

    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatRadioModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    HotToastModule.forRoot(),
    MatMenuModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
