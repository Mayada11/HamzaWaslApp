export interface IMeetingParticipant {
  uid: string;
  displayName: string;
  photoURL: string;
}

export interface IMeetings {
  id?:string
  userID: string;
  MeetingName: string;
  MeetingLink: string;
  MeetingDate: string;
  TeacherID: string;
  TeacherName: string;
  participants?: IMeetingParticipant[];
}
