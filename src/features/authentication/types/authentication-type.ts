// export type Auth = {
//   "user_id": number,
//   "user_email": string,
//   "user_role": 'hr_employee' | 'project_manager' | 'admin' | 'dev_employee' | 'hr_manager',
//   "access_token": string,
//   "refresh_token": string
// }

export const ACCESS_TOKEN = "__access-token";

export type SignupResponse = {
  bgColor: number | null;
  _id: string;
  email: string;
  profileImage: string;
  profileSetup: boolean;
  firstName: string;
  lastName: string;
  token: string;
};

export type ImageChangeResponse = {
  profileImage: string;
};

export interface User {
  _id: string;
  email: string;
  profileSetup: boolean;
  profileImage: string;
  bgColor: number;
  __v: number;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}
