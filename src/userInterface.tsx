export interface User {
  name: {
    first: string;
    last: string;
  }

  email: string;

  dob: {
    age: number;
  };

  phone: string;

  gender: string;

  picture: {
    thumbnail: string;
  };
}