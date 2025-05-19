import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
import axios from 'axios';
import { finalize, from, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  constructor(private storage: Storage,private httpClient:HttpClient) {}

  uploadImage(form : FormData): Observable<any> {
    // const storageRef = ref(this.storage, path);
    // const uploadTask = from(uploadBytes(storageRef, image));
    // return uploadTask.pipe(switchMap((result) => getDownloadURL(result.ref)));
 return this.httpClient.post("https://api.cloudinary.com/v1_1/dcadewwme/upload",form);
  }
}
