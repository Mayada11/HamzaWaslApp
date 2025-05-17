import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-live-video',
  templateUrl: './live-video.component.html',
  styleUrls: ['./live-video.component.css']
})
export class LiveVideoComponent implements OnInit {

  constructor() { }
// async ngAfterContentInit():Promise<any>{
// const {ZoomMtg} = await import('@zoomus/websdk');
// ZoomMtg.setZoomJSLib('https://source.zoom.us/lib','/av');
// ZoomMtg.preLoadWasm();
// ZoomMtg.prepareWebSDK();
// let payload={
// meetingNumber:'',
// passWord:'',
// sdkKey:'',
// sdkSecret:'',
// userName:'mmyada7',
// userEmail:'',
// role:'0',
// leaveUrl:'https://localhost:4200'
// };
// ZoomMtg.generateSDKSignature({
//   meetingNumber:payload.meetingNumber,
//   role:payload.role,
//   sdkKey:payload.sdkKey,
//   sdkSecret:payload.sdkSecret,
//   success:function(signature:any){
//     ZoomMtg.init({
//       leaveUrl:payload.leaveUrl,
//       success:function(data:any){
//         ZoomMtg.join({
//           meetingNumber:payload.meetingNumber,
//           passWord:payload.passWord,
//           sdkKey:payload.sdkKey,
//           userName:payload.userName,
//           userEmail:payload.userEmail,
//           signature:signature.result,
//           tk:'',
//           success:function(data:any){
//             console.log(data)
//           },
//           error:function(error:any){
//             console.log('error join'+error);
//           }

//         })
//       },
//       error:function(error:any){
// console.log('error init'+error);
//       }
//     })
//   },
//   error:function(error:any){
//     console.log(error);
//   }
// })
// }
  ngOnInit(): void {
  }

}
