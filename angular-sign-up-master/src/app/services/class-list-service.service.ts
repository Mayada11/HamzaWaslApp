import { Injectable } from '@angular/core';
import { IClassList } from '../models/iclass-list';

@Injectable({
  providedIn: 'root'
})
export class ClassListServiceService {
  classLst:IClassList[];
  constructor() {
    this.classLst = [
      {id:100,name:"فصل اللغة العربية",imgUrl:"assets/images/Arabic.png",classDetails:[{id:1,name:"الحصة الاولي",videoUrl:"assets/images/video1.mp4"},{id:2,name:"الحصة الثانية"},{id:3,name:"الحصة الثالثة"},{id:4,name:"الحصة الرابعة"},{id:5,name:"الحصة الخامسة"},{id:6,name:"الحصة السادسة"},{id:7,name:"الحصة السابعة"}],tests:["الاختبار الاسبوعي","الاختبار الشهري","الاختبار النهائي"]},
      {id:200,name:"فصل الدراسات الاجتماعية",imgUrl:"assets/images/social.png",classDetails:[{id:1,name:"الحصة الاولي"},{id:2,name:"الحصة الثانية"}],tests:["الاختبار الاسبوعي","الاختبار الشهري","الاختبار النهائي"]},
      {id:300,name:"فصل اللغة الانجليزية",imgUrl:"assets/images/english.png",classDetails:[{id:1,name:"الحصة الاولي"},{id:2,name:"الحصة الثانية"}],tests:["الاختبار الاسبوعي","الاختبار الشهري","الاختبار النهائي"]},
      {id:400,name:"فصل الرياضيات",imgUrl:"assets/images/math.png",classDetails:[{id:1,name:"الحصة الاولي"},{id:2,name:"الحصة الثانية"}],tests:["الاختبار الاسبوعي","الاختبار الشهري","الاختبار النهائي"]},
      {id:500,name:"فصل تكنولوجيا المعلومات",imgUrl:"assets/images/tech.png",classDetails:[{id:1,name:"الحصة الاولي"},{id:2,name:"الحصة الثانية"}],tests:["الاختبار الاسبوعي","الاختبار الشهري","الاختبار النهائي"]},
      {id:600,name:"فصل العلوم",imgUrl:"assets/images/cience.png",classDetails:[{id:1,name:"الحصة الاولي"},{id:2,name:"الحصة الثانية"}],tests:["الاختبار الاسبوعي","الاختبار الشهري","الاختبار النهائي"]}
     ]
   }
   getElementById(id:number):IClassList | null{
    let foundedclass = this.classLst.find(list=>list.id==id);
    return foundedclass?foundedclass:null;
   }
}
