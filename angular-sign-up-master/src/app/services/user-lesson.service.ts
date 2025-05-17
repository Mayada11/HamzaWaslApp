import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
  Firestore
} from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Observable, from, of, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ILessonTeachert } from '../models/ilesson-teachert';

@Injectable({
  providedIn: 'root'
})
export class UserLessonService {
private firestore: Firestore = inject(Firestore);
  constructor() {}

getUsersByLesson(lessonId: string): Observable<any[]> {
    const userLessonsRef = collection(this.firestore, 'lessonTeacher');
    const q = query(userLessonsRef, where('lessonID', '==', lessonId));

    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => (doc.data() as any).teacherID)),
      switchMap(userIds => {
        if (userIds.length === 0) return of([]);

        const chunked = this.chunkArray(userIds, 10);
        const queries = chunked.map(chunk => {
          const usersRef = collection(this.firestore, 'users');
          const userQuery = query(usersRef, where('__name__', 'in', chunk));
          return from(getDocs(userQuery));
        });

        return forkJoin(queries).pipe(
          map(results =>
            results.flatMap(snapshot =>
              snapshot.docs.map(doc => {
                const data = doc.data() as any;
                return { id: doc.id, ...data };
              })
            )
          )
        );
      })
    );
  }

  private chunkArray(array: string[], size: number): string[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
    );
  }
}

