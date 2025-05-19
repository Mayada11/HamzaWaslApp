export enum UsreCat {
    " مرشد أكاديمي" = 1,
    "مساعد معلم" = 2,
    "طالب" = 4,
    "معلم" = 3
}


export const UserCat = {
     'مرشد أكاديمي':'1',
     'مساعد معلم' :'2',
     'معلم' : '3',
     'طالب' : '4'
} as const;
export const UserRoles  = {
     'مرشد أكاديمي':'1',
     'مساعد معلم' :'2',
     'طالب' : '4'
} as const;
export type UserCat = (typeof UserCat)[keyof typeof UserCat];
export type UserRoles = (typeof UserRoles)[keyof typeof UserRoles];

export const UserRole  = {
     '1':'مرشد أكاديمي',
    '2': 'مساعد معلم',
    '4': 'طالب'
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

