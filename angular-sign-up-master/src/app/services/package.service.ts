import { Injectable } from '@angular/core';
import {UserPackage} from '../models/user-package'
@Injectable({
  providedIn: 'root'
})
export class PackageService {
packages:UserPackage[];
  constructor() {
    this.packages = [
      {id:1,
      name:"اتقن",
      description:["خصم 25%","كل ميزات الباقة الأساسية","أولوية في الحجز للحصص المميزة","دعوة مجانية لصديق واحد","ملاحظة: يمكن الترقية من الخطة الأساسية في أي","وقت مع خصم الفارق المدفوع."],
      price:"1500 جنية/ترم بدلا من 2000",
      userCategory:"3",
    type:"ترم",
  freePackage:false},
      {id:2,
        name:"اتعلم",
        description:["حضور غير محدود لجميع الحصص المباشرة","مشاهدة الحصص المسجلة في أي وقت","تحميل المذكرات والملفات","شهادة معتمدة لكل مادة","دعم فني يومي","ملاحظة: متاح خصم 10% في حالة اشتراك طالبين أو أكثر من نفس الأسرة."],
        price:"500 جنية /شهريا",
        userCategory:"3",
        type:"شهر",
        freePackage:false
      },
      {
        id:3,
        name:"استكشف",
        description:["حضور حتى 3 حصص مسجلة","تجربة بث مباشر واحد","بدون شهادة","صلاحية لمدة 7 أيام","ملاحظة: يمكن للطالب ترقية الباقة في أي وقت بدون فقدان تقدمه."],
        price:"",
        userCategory:"3",
        type:"مجانية",
        freePackage:true
      },{
        id:4,
        name:"خبير",
        description:["قريبا"],
        price:"",
        userCategory:"4",
        type:"",
        freePackage:false

      },
      {
        id:5,
        name:"مُتميّز",
        description:["ظهور مميز في الصفحة الرئيسية للمنصة","دعم تقني خاص للمعلم","دعوة حتى 2 مساعدين","تقارير أداء متقدمة","ملاحظة: يمكن الاشتراك أو إلغاء الباقة ","في أي وقت بدون فقدان بيانات الطلاب أو الحصص."],
        price:"شهريا",
        userCategory:"4",
        type:"شهرية",
        freePackage:false

      },{
        id:6,
        name:"مُعلّم",
        description:["إنشاء غير محدود للحصص المباشرة","تحميل ملفات + إدارة المحتوى","لوحة بيانات لإحصائيات التفاعل","سجل مالي مفصل بالأرباح","دون ارباح لأول اسبوع عمل","صالحة لمدة 7 أيام","ملاحظة: الأرباح تُصرف شهريًا عبر ","محفظة رقمية أو تحويل بنكي."],
        price:"",
         userCategory:"4",
        type:"مجانية",
        freePackage:true
      },
      {
        id:7,
        name:"منسق صف",
        description:[""],
        price:"قريبا",
        userCategory:"2",
        type:"",
        freePackage:false
      },
      {
        id:8,
        name:"مساعد نشط",
        description:["الرد على استفسارات الطلاب","إدارة الغرف أثناء البث","رفع ملفات ومتابعة الواجبات","إشراف مباشر على تفاعل الطلاب","أرباح بنسبة 20%","ملاحظة: يمكن للمساعد العمل مع أكثر من معلم، والنسبة تُحسب بناءً على مساهماته."],
        price:"شهرياً",
        userCategory:"2",
        type:"شهرياً",
        freePackage:false
      },{
        id:9,
        name:"مساعد مبتدئ",
        description:["الرد على استفسارات الطلاب","إدارة الغرف أثناء البث","رفع ملفات ومتابعة الواجبات","إشراف مباشر على تفاعل الطلاب","بدون ارباح لأول اسبوع عمل","صالحة لمدة 7 أيام"],
        price:"",
        userCategory:"2",
        type:"مجانية",
        freePackage:true
      },{
        id:10,
        name:"مرشد متميز",
        description:[],
        price:"قريبا",
         userCategory:"1",
        type:"",
        freePackage:false
      },{
        id:11,
        name:"مرشد أكاديمي",
        description:["دعم أكاديمي فردي للطلاب","متابعة مستمرة مع أولياء الأمور","اقتراح المعلمين المناسبين لكل طالب","تقارير تحليلية دورية عن تقدم الطالب","حضور الحصص كمراقب تربوي","أرباح بنسبة 15%","ملاحظة: يحصل المرشد على نسبة من أي باقة يشترك بها الطالب تحت إشرافه"],
        price:"قريبا",
        userCategory:"1",
       type:"",
       freePackage:false
      },
      {
        id:12,
        name:"مرشد ناشئ",
        description:["دعم أكاديمي فردي للطلاب","متابعة مستمرة مع أولياء الأمور","اقتراح المعلمين المناسبين لكل طالب","تقارير تحليلية دورية عن تقدم الطالب","حضور الحصص كمراقب تربوي","بدون ارباح لأول اسبوع عمل","ملاحظة: يحصل المرشد على نسبة من أي باقة يشترك بها الطالب تحت إشرافه"],
        price:"",
        userCategory:"1",
       type:"مجانية",
       freePackage:true
      }
      ]
   }
   getPackagesByCat(usercat:string):UserPackage[]{
    return this.packages.filter(ele=>ele.userCategory==usercat);
   }
   getPackageByID(id:number):UserPackage{
    return this.packages.filter(ele=>ele.id == id)[0];
   }
   getFreePackage(usercat:string):UserPackage{
    const packs = this.packages.filter(ele=>ele.userCategory==usercat);
    return packs.filter(ele=>ele.freePackage == true)[0]
   }
}
