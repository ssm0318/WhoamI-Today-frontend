export interface SignInParams {
  username: string;
  password: string;
}

export interface SignInResponse {
  access: string;
  refresh: string;
}
