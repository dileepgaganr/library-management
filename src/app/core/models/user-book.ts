namespace Model {
  export interface UserBook {
    userId: string;
    bookId: string;
    assignedDate: Date;
    returnDate:Date;
    rating: number;
  }
}