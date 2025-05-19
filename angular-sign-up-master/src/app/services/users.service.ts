import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  docData,
  DocumentSnapshot,
  Firestore,
  getDoc,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc,
  orderBy,
  limit,
  query as firestoreQuery,
  serverTimestamp
} from '@angular/fire/firestore';
import { catchError, delay, filter, forkJoin, from, map, mergeMap, observable, Observable, of, switchMap, throwError } from 'rxjs';
import { ProfileUser } from '../models/user';
import { AuthService } from './auth.service';
import { ISocial } from '../models/isocial';
import { addDoc, arrayUnion, collectionGroup, deleteDoc, getDocs, query, QuerySnapshot, where } from 'firebase/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { IMeetings } from '../models/imeetings';
import { get } from 'http';
import { ILessonTeachert } from '../models/ilesson-teachert';
import { Imaterial } from '../models/imaterial';
import { IChatMessage } from '../models/ichat-message';

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
  getUserById(id:string): Observable<any> {
    const ref = doc(this.firestore, 'users', id);
    return from(getDoc(ref));
  }
 deleteMeetingById(link: string): Observable<void> {
  const ref = collection(this.firestore, 'meetings');
  const q = query(ref, where('MeetingLink', '==', link));

  return from(
    getDocs(q).then(snapshot => {
      const deletePromises = snapshot.docs.map(docSnap =>
        deleteDoc(doc(this.firestore, 'meetings', docSnap.id))
      );
      return Promise.all(deletePromises).then(() => undefined); // <<< هذا يرجّع void
    })
  );
}
  addSociety(social: ISocial): Observable<DocumentData> {
  
    const ref = collection(this.firestore, 'socials');
    return from(addDoc(ref, social));
  }
  addMaterial(mat: Imaterial): Observable<DocumentData> {
  
    const ref = collection(this.firestore, 'material');
    return from(addDoc(ref, mat));
  }
  addMeeting(meeting: IMeetings): Observable<DocumentData> {
  
    const ref = collection(this.firestore, 'meetings');
    return from(addDoc(ref, meeting));
  }
  updateSociety(social: ISocial):Observable<void>{
     const ref = doc(this.firestore, 'socials', social.socialID);
    return from(updateDoc(ref, { ...social })); 
  }
  // getSocietyById(id:string):Observable<any>{
  //    const ref = doc(this.firestore, 'socials', id);
  //   return from(getDoc(ref)).pipe(
  //     map((res: DocumentSnapshot) => {
  //       // map
  //       return UsersService.NewInstance(res);
  //     }),
  //   ); 
  // }
  getTeacherLessonById(id: string): Observable<any> {
  const docRef = doc(this.firestore, `lessonTeacher/${id}`);

  return from(
    getDoc(docRef).then((docSnapshot) => {
      if (docSnapshot.exists()) {
        return docSnapshot.data(); // هنا بترجع البيانات بتاعة المستند
      } else {
        throw new Error('المستند غير موجود');
      }
    }).catch((error) => {
      console.error('فيه خطأ في جلب البيانات:', error);
      throw error; // لو فيه مشكلة في جلب البيانات هنرجع الخطأ
    })
  );
}
 getmeetingData(userId: string):Observable<any[]>{
  const meetingsRef = collection(this.firestore, 'meetings');
    const q = query(meetingsRef, where('userID', '==', userId));

    // collectionData بتحول النتيجة إلى Observable
    return collectionData(q, { idField: 'id' });
}
getmeetingDataTeacher(teacherID: string):Observable<any[]>{
  const meetingsRef = collection(this.firestore, 'meetings');
    const q = query(meetingsRef, where('TeacherID', '==', teacherID));

    // collectionData بتحول النتيجة إلى Observable
    return collectionData(q, { idField: 'id' });
}
getlessonData():Observable<any[]>{
  const meetingsRef = collection(this.firestore, 'lessons');
    return collectionData(meetingsRef, { idField: 'id' });
}
getMaterialDataByChapterId(id:string):Observable<any>{
    const materialRef = collection(this.firestore, 'material');
    const q = query(materialRef, where('chapterId', '==', id));

    // collectionData بتحول النتيجة إلى Observable
    return collectionData(q, { idField: 'id' });
}
getTeachersLessonsByLesson(id:string):Observable<any>{
    const materialRef = collection(this.firestore, 'lessonTeacher');
    const q = query(materialRef, where('lessonID', '==', id));

    // collectionData بتحول النتيجة إلى Observable
    return collectionData(q, { idField: 'id' });
}
addlessonsTeacher(lessonTeacher: ILessonTeachert): Observable<DocumentData> {
    const ref = collection(this.firestore, 'lessonTeacher');
    console.log(ref);
    console.log(lessonTeacher);
    return from(addDoc(ref, lessonTeacher));
  }

addBookUrl(documentId: string, newUrl: string):Observable<any> {
  const docRef = doc(this.firestore, `lessonTeacher/${documentId}`);

  return from(updateDoc(docRef, {
    booksUrls: arrayUnion(newUrl)
  })).pipe(
   switchMap(() => of(null).pipe(delay(300))), // ندي Firebase وقت يحدّث
    switchMap(() => docData(docRef))
  );
  
}
addVideoUrl(documentId: string, newUrl: string):Observable<any> {
  const docRef = doc(this.firestore, `lessonTeacher/${documentId}`);

  return from(updateDoc(docRef, {
    videoUrls: arrayUnion(newUrl)
  })).pipe(
   switchMap(() => of(null).pipe(delay(300))), // ندي Firebase وقت يحدّث
    switchMap(() => docData(docRef))
  );
  
}
addGameUrl(documentId: string, newUrl: string):Observable<any> {
  const docRef = doc(this.firestore, `lessonTeacher/${documentId}`);

  return from(updateDoc(docRef, {
    gamesUrls: arrayUnion(newUrl)
  })).pipe(
   switchMap(() => of(null).pipe(delay(300))), // ندي Firebase وقت يحدّث
    switchMap(() => docData(docRef))
  );
  
}
addExamUrl(documentId: string, newUrl: string):Observable<any> {
  const docRef = doc(this.firestore, `lessonTeacher/${documentId}`);

   return from(updateDoc(docRef, {
    examUrls: arrayUnion(newUrl)
  })).pipe(
   switchMap(() => of(null).pipe(delay(300))), // ندي Firebase وقت يحدّث
    switchMap(() => docData(docRef))
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
   addMeetingForStudents(studentIds: string[], meeting: IMeetings): Observable<any> {
    const meetingsRef = collection(this.firestore, 'meetings');

    const promises = studentIds.map(studentId => {
      return addDoc(meetingsRef, {
        studentID: studentId,
        MeetingName: meeting.MeetingName,
        MeetingLink: meeting.MeetingLink,
        TeacherID: meeting.TeacherID,
        MeetingDate: meeting.MeetingDate
      });
    });

    return from(Promise.all(promises)); // تحويل Promise إلى Observable
  }
  getSocietyById(id: string): Observable<ISocial> {
    const ref = doc(this.firestore, 'socials', id);
    return from(getDoc(ref)).pipe(
      map((res: DocumentSnapshot) => {
        // map
       // return UsersService.NewInstance(res);
       return (res.exists()&&res.id&&res.data()) ? (<ISocial>{ socialID: res.id, ...res.data() }) : (null);
      }),
      mergeMap((soc) => soc ? of(soc) : throwError(() => new Error('Society not found')))

    ).pipe(
    catchError(err => {
      console.error('Error getting society:', err);
      return throwError(() => new Error('Society not found'));
    }));
  }
  getSocietiesByUserId(userId: string): Observable<ISocial[]> {
    const ref = collection(this.firestore, 'enrollments');
    const q = query(ref, where('userId', '==', userId));

    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => doc.data()['socialId'] as string)
      )
    ).pipe(switchMap((socialIds)=>{
      if (!socialIds.length) return of([]); // Handle empty case

      const socialObservables = socialIds.map(id =>
        this.getSocietyById(id));

      return forkJoin(socialObservables);
      
    }));
  }

  // Send a new message
  sendMessage(message: IChatMessage): Observable<DocumentData> {
    const ref = collection(this.firestore, 'messages');
    const messageWithTimestamp = {
      ...message,
      timestamp: serverTimestamp()
    };
    return from(addDoc(ref, messageWithTimestamp));
  }

  // Get chat messages between two users
  getChatMessages(userId1: string, userId2: string): Observable<IChatMessage[]> {
    const messagesRef = collection(this.firestore, 'messages');
    const q = firestoreQuery(
      messagesRef,
      where('senderId', 'in', [userId1, userId2]),
      where('receiverId', 'in', [userId1, userId2]),
      orderBy('timestamp', 'asc'),
      limit(100)
    );
    
    return collectionData(q, { idField: 'id' }) as Observable<IChatMessage[]>;
  }

  // Get all chat conversations for a user
  getUserConversations(userId: string): Observable<IChatMessage[]> {
    const messagesRef = collection(this.firestore, 'messages');
    const q = firestoreQuery(
      messagesRef,
      where('senderId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    return collectionData(q, { idField: 'id' }) as Observable<IChatMessage[]>;
  }

  getAllUsers(): Observable<ProfileUser[]> {
    const ref = collection(this.firestore, 'users');
    return collectionData(ref, { idField: 'uid' }) as Observable<ProfileUser[]>;
  }
}