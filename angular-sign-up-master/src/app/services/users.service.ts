import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  docData,
  DocumentSnapshot,
  Firestore,
  getDoc,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc

} from '@angular/fire/firestore';
import { filter, from, map, Observable, of, switchMap } from 'rxjs';
import { ProfileUser } from '../models/user';
import { AuthService } from './auth.service';
import { ISocial } from '../models/isocial';
import { addDoc } from 'firebase/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const ref = doc(this.firestore, 'users', user?.uid);
        return docData(ref) as Observable<ProfileUser>;
      })
    );
  }

  addUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(setDoc(ref, user));
  }

  updateUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(updateDoc(ref, { ...user }));
  }
  addSociety(social: ISocial): Observable<DocumentData> {
  
    const ref = collection(this.firestore, 'socials');
    return from(addDoc(ref, social));
  }
  updateSociety(social: ISocial):Observable<void>{
     const ref = doc(this.firestore, 'socials', social.socialID);
    return from(updateDoc(ref, { ...social })); 
  }
  getSocietyById(id:string):Observable<any>{
     const ref = doc(this.firestore, 'socials', id);
    return from(getDoc(ref)).pipe(
      map((res: DocumentSnapshot) => {
        // map
        return UsersService.NewInstance(res);
      }),
    ); 
  }
  public static NewInstance(data: DocumentSnapshot): ISocial | null {
    if (data === null) {
      return null ;
    }
        const d = data instanceof DocumentSnapshot ? data.data() : data;
        if(d != undefined)
    return {
      socialID: d['socialID'],
      socialName: d['socialName'],
      socialclass:d['socialclass'],
      socialStage:d['socialStage'],
      socialSubject:d['socialSubject'],
      uid:d['uid'],
      socialProfileImg:d['socialProfileImg'],
      socialBackImg:d['socialBackImg'],
      creator:d['creator']
      
    };else return null
  }
}
