import { Injectable } from '@angular/core';
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  docData,
  DocumentSnapshot,
  Firestore,
  getDoc,
  getDocs,
  query,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { catchError, filter, forkJoin, from, map, mergeMap, Observable, of, switchMap, throwError } from 'rxjs';
import { ProfileUser } from '../models/user';
import { AuthService } from './auth.service';
import { ISocial } from '../models/isocial';
import { addDoc, CollectionReference, DocumentReference, Timestamp } from 'firebase/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { UserCat, UserRole, UserRoles, UsreCat } from '../components/Enums/usre-cat';
import { Enrollment } from '../models/Enrollment';

@Injectable({
  providedIn: 'root',
})
export class SocialService {


  soc!: ISocial;
  constructor(private firestore: Firestore, private authService: AuthService) {}

   userRole = (num:UserRoles):UserRole =>UserRole[num]

  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }
   

        const ref = doc(this.firestore, 'users', user?.uid);
        return <Observable<ProfileUser>>docData(ref,{ idField: 'uid' }) ;
      })
    );
  }

  get isTeacher$(): Observable<boolean> {
    return this.currentUserProfile$.pipe(map((user) => user?.userCategory === UserCat.معلم));
  }

  getUser(uid: string): Observable<ProfileUser> {
    const ref = doc(this.firestore, 'users', uid);
    return <Observable<ProfileUser>>docData(ref , { idField: 'uid' }).pipe(
      mergeMap((user) => user ? of(user) : throwError(() => new Error('User not found'))),

    );
  }

  getSocial(id: string): Observable<ISocial> {
    const ref = doc(this.firestore, 'socials', id);
    return <Observable<ISocial>>docData(ref, { idField: 'socialID' }).pipe(
      mergeMap((social) => social ? of(social) : throwError(() => new Error('Society not found')))
    );
  }

  addUser(user: ProfileUser): Observable<ProfileUser> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(setDoc(ref, user)).pipe(
      switchMap(() => from(getDoc(ref))),
      map((docSnap)=>( (docSnap.exists() && docSnap.id&& docSnap.data()) ? (<ProfileUser>{uid: docSnap.id, ...docSnap.data()}): (null) )),
      mergeMap(( user) => user ? of(user) : throwError(() => new Error('User creation failed')))

    ).pipe(
      catchError(err => {
        console.error('Error adding user:', err);
        return throwError(() => new Error('User creation failed'));
      })
    );
  }

  updateUser(uid: string,user: Omit<ProfileUser,'uid'|'NationalId'|'userCategory'>): Observable<ProfileUser> {
    const ref = doc(this.firestore, 'users', uid);
    return from(getDoc(ref)).pipe( switchMap((docSnap) => (docSnap.exists()&& docSnap.id&& docSnap.data()&&docSnap.id ===uid) ? from(updateDoc(docSnap.ref, { ...user })) : throwError(() => new Error('User not found')) ),
switchMap( () => from(getDoc(ref))),
//map((docSnap) =>( (docSnap.exists()) ? (<ProfileUser>{uid: docSnap.id, ...docSnap.data()}): (null) )),
mergeMap((docSnap) => (docSnap.exists()&& docSnap.id && docSnap.data()) ? of(docSnap) : throwError(() => new Error('User not found'))),
map( (docSnap) =>  (<ProfileUser>{uid: docSnap.id, ...docSnap.data()}) ),
)

  .pipe(
    catchError(err => {
      console.error('Error updating user:', err);
      return throwError(() => new Error(err?.message??'User update failed'));
    })
  );

  }

  getmeetingData(userId: string): Observable<any> {
    const ref = collection(this.firestore, 'meetings');
    const q = query(ref, where('userID', '==', userId));
    //const qRes =  await getDocs(q);
    //console.log(qRes);
    return from(getDocs(q)).pipe(
      map((res) => {
        // map
        console.log(res.docs.map((doc) => ({ uid: doc.id, ...doc.data() })));
        return res.docs.map((doc) => {
          return { uid: doc.id, ...doc.data() };
        });
      })
    );
  }
  getAllUsers( categoryIdFilter?: UserCat,socialIdFilter?: string , includeEnrolledUsers: boolean=false): Observable<ProfileUser[]> {
    const ref = collection(this.firestore, 'users');
    let q = query(ref);

    if (categoryIdFilter !== undefined) {
      console.log(categoryIdFilter);
      q = query(q, where('userCategory', '==', categoryIdFilter));
    }

    if (socialIdFilter !== undefined && socialIdFilter.length > 0) {
      return this.getSocietyById(socialIdFilter).pipe(
        switchMap((soc) => {
          console.log(soc);
          const enrollmentsRef = collection(this.firestore, 'Enrollments');
          const enrollmentQuery = query(
            enrollmentsRef,
            where('socialId', '==', socialIdFilter)
          );
          return from(getDocs(enrollmentQuery)).pipe(
            switchMap((enrollmentSnapshot) => {
              const enrolledUsers = enrollmentSnapshot.docs.map(
                (doc) => <string>doc.data()['userId']
              );
              console.log(enrolledUsers);
              // q = query(q, where('uid', 'not-in', enrolledUsers));
              return from(getDocs(q)).pipe(
                map((snapshot) => {
                  console.log(
                    snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }))
                  );
                  return snapshot.docs
                    .map(
                      (doc) => ({ uid: doc.id, ...doc.data() } as ProfileUser)
                    )

                    .filter((user) => ( (!includeEnrolledUsers) ?(!enrolledUsers.includes(user.uid)):(enrolledUsers.includes(user.uid))));
                })
              );
            })
          );
        })
      ).pipe(
        catchError(err => {
          console.error('Error getting users:', err);
          return throwError(() => new Error('Users not found'));
        })
      );
    }

    return from(getDocs(q)).pipe(
      map((snapshot) => {
        return snapshot.docs.map(
          (doc) => ({ uid: doc.id, ...doc.data() } as ProfileUser)
        );
      })
    ).pipe(catchError(err => {
      console.error('Error getting users:', err);
      return throwError(() => new Error('Users not found'));
    }));
  }

  AddUserToSociety(userId: string, socialId: string): Observable<Enrollment> {
    const id = `${userId}_${socialId}`; // Composite key
    const ref = doc(this.firestore, 'Enrollments', id);
    const enrollment: Enrollment = {
     userId: userId,
    socialId:  socialId,
      joinedAt: Timestamp.now(),
    };
    return from(setDoc(ref, enrollment)).pipe( switchMap(() => from(getDoc(ref))),

    map((doc) => (doc.exists()) ? (<Enrollment>{  ...doc.data() }) : (null)),

    mergeMap((enr) => enr ? of(enr) : throwError(() => new Error('Enrollment failed'))))
    .pipe(
    catchError(err => {
      console.error('Error enrolling user:', err);
      return throwError(() => new Error('Enrollment failed'));
    }));
  }

  removeStudentFromSociety(userId: string, socialId: string): Observable<void> {
    const id = `${userId}_${socialId}`;
    const ref = doc(this.firestore, 'Enrollments', id);
    return from(deleteDoc(ref));
  }

  getTeacherBySocietyId(socialId: string): Observable<ProfileUser> {
    const ref = collection(this.firestore, 'socials');
    const q = query(ref, where('socialID', '==', socialId));

    return from(getDocs(q)).pipe(
      map((snapshot) => {
        if (snapshot.docs.length === 0) {
          return null;
        }
        return <string>snapshot.docs[0].data()['uid'];
      }),

      mergeMap((teacherId) => teacherId ? this.getUser(teacherId) : throwError(() => new Error('Teacher not found'))),
     

      catchError(err => {
        console.error('Error getting teacher:', err);
        return throwError(() => new Error('Teacher not found'));
      })
    );
  }

  getUsersBySocietyId(socialId: string): Observable<ProfileUser[]> {
    const ref = collection(this.firestore, 'Enrollments');
    const q = query(ref, where('socialId', '==', socialId));

    return from(getDocs(q)).pipe(
      map((snapshot) =>{
        console.log(snapshot.docs)
       return snapshot.docs.map((doc) => (<string>doc.data()['userId']))
      }
      )
    ).pipe(switchMap((userIds)=>{
      if (!userIds.length) return of([]); // Handle empty case

      const userObservables = userIds.map(id =>
        this.getUser(id));

      return forkJoin(userObservables);
      
    }));
  }

  getSocietiesByUserId(userId: string): Observable<ISocial[]> {
    const ref = collection(this.firestore, 'Enrollments');
    const q = query(ref, where('userId', '==', userId));

    return from(getDocs(q)).pipe(
      map((snapshot) =>{
         console.log(snapshot.docs);
       return snapshot.docs.map((doc) => (<string>doc.data()['socialId']))
      }
      )).pipe(
        switchMap((socialIds)=>{
          console.log(socialIds);
          if (!socialIds.length) return of(new Array<ISocial>(0)); 
          else return  forkJoin(socialIds.map(id => {return this.getSocietyById(id)}));// Handle empty case

          // const socialObservables = socialIds.map(id =>
          //   this.getSocietyById(id));

          // return forkJoin(socialObservables);
        })
      )
    // .pipe(switchMap((socialIds)=>{
    //   if (!socialIds.length) return of([]).
    //   pipe(
    //     switchMap((socs)=>socs)
    //   ); // Handle empty case


      // const socialObservables = socialIds.map(id =>
      //   this.getSocietyById(id));

      // return socialObservables;
      // forkJoin(socialObservables);
      
    
  }

  addSociety(social: Omit<ISocial,'socialID'>): Observable<ISocial> {
    const ref = collection(this.firestore, 'socials');

    return from(addDoc(ref, social)).pipe(switchMap(data =>from(getDoc(data))),
 map((doc) => (doc.exists()&&doc.id&&doc.data())? (<ISocial>{...doc.data(), socialID: doc.id}): (null) ),
 mergeMap((soc)=>soc?of(soc):throwError(() => new Error('Society creation failed')))
).pipe(

      catchError(err => {
        console.error('Error adding society:', err);
        return throwError(() => new Error('Society creation failed'));
      })
    );
  }
  updateSociety(socialID: string,social: Omit<ISocial, 'uid'|'socialID'|'creator'>): Observable<ISocial> {
    const ref = doc(this.firestore, 'socials', socialID);
    return from(updateDoc(ref, { ...social })).pipe(switchMap(() => from(getDoc(ref)))
    , map((doc) =>(doc.exists()&&doc.id&&doc.data())? (<ISocial>{ socialID: doc.id, ...doc.data() }) : (null)),
    mergeMap((soc) => soc ? of(soc) : throwError(() => new Error('Society update failed')))
  )
    .pipe(
    catchError(err => {
      console.error('Error updating society:', err);
      return throwError(() => new Error(err?.message??'Society update failed'));
    }));
  }
  getSocietiesByTeacherId(uid: string): Observable<ISocial[]> {
    const ref = collection(this.firestore, 'socials');
    const q = query(ref, where('uid', '==', uid));

    return from(getDocs(q)).pipe(
      map((snapshot) => {

        return (snapshot&&snapshot.docs&&snapshot.docs.length>0)? (snapshot.docs.map(
          (doc) =>//(doc.exists()&&doc.id&&doc.data())?
            (<ISocial>{
              socialID: doc.id,
              ...doc.data(),
            } ))
            //: (null)
          ):[]
        //.filter(s=>s!==null))): [];
      }),


    ).pipe(
    catchError(err => {
      console.error('Error getting societies:', err);
      return throwError(() => new Error('Societies not found'));
    }));
  }

  getSocietyById(id: string): Observable<ISocial> {
    //const collRef = <CollectionReference<ISocial>>collection(this.firestore, 'socials');
    
   // const ref = doc<ISocial>(collRef, id);

    const document = getDoc(doc(this.firestore, 'socials', id));

   
   return from(document).pipe(
  //   // return docData<ISocial>( ref, { idField: 'socialID' }).pipe(

      map((res) => {
      //   console.log(res.data())
      //   // map
      //  // return UsersService.NewInstance(res);
      //  return (res.exists()&&res.id&&res.data()) ? (<ISocial>{ socialID: res.id, ...res.data() }) : (null);
       const data = res.data();
      if (res.exists() && data) {
        console.log('document data', data);
        return { socialID: res.id, ...data } as ISocial;
      } else {
        return null;
      }
      }),

  //  const socialsRef = collection(this.firestore, 'socials');
  // const q = query(socialsRef, where('socialID', '==', id));

  // return from(getDocs(q)).pipe(
  //   map(snapshot => {
  //     if (snapshot.empty) return console.log('No matching documents.');

  //     const docSnap = snapshot.docs[0];
  //     return {
  //       socialID: docSnap.id,
  //       ...docSnap.data()
  //     } as ISocial;
  //   }),
      mergeMap((soc) => soc ? of(soc) : throwError(() => new Error('Society not found')))

    ).pipe(
    catchError(err => {
      console.error('Error getting society:', err);
      return throwError(() => new Error('Society not found'));
    }));
  }

  // public static NewInstance(data: DocumentSnapshot): ISocial | null {
  //   if (data === null) {
  //     return null;
  //   }
  //   const d = data instanceof DocumentSnapshot ? data.data() : data;
  //   if (d != undefined)
  //     return <ISocial>{
  //       socialID: d['socialID'],
  //       socialName: d['socialName'],
  //       socialclass: d['socialclass'],
  //       socialStage: d['socialStage'],
  //       socialSubject: d['socialSubject'],
  //       uid: d['uid'],
  //       socialProfileImg: d['socialProfileImg'],
  //       socialBackImg: d['socialBackImg'],
  //       creator: d['creator'],
  //     };
  //   else return null;
  // }

}
