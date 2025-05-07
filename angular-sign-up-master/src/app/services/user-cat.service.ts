import { Injectable } from '@angular/core';
import { UsreCat } from '../components/Enums/usre-cat';

@Injectable({
  providedIn: 'root'
})
export class UserCatService {
userCategory?:UsreCat
  constructor() { }
  getUserCat(usCat?:number):string{
    console.log(usCat);
    switch(true){
      case usCat == 1:{return UsreCat[1]}
      case usCat == 2:{return UsreCat[2]
      }
      case usCat == 3:{return UsreCat[3]}
      case usCat == 4:{return UsreCat[4]}
      default : return "Not Found"

    }

  }
}
