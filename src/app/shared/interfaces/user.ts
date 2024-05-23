export interface BaseUser {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  password: string;
  address: string;
  zipcode: string;
  avatar: string;
  gender: string;
  phone: string;
}

export type SignUpUser = Omit<BaseUser, 'password'>;
export type SignInUser = Pick<BaseUser, 'email' | 'password'>;

export interface User extends SignUpUser {
  _id: string;
  verified: boolean;
  role: string;
}
