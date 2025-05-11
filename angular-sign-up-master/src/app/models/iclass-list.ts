import { IClassDetails } from "./iclass-details"

export interface IClassList {
    id:number,
    name:string,
    imgUrl?:string
    classDetails?:IClassDetails[],
    tests?:string[]
}
