namespace Model {
  export interface User {
    userName: string;
    password: string;
    isAdmin: boolean;
    userImage: string;
    _id: any;
    bookLimit: number;
    admin: string;
  }
}