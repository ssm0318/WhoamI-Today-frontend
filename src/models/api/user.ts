export interface SignInParams {
  username: string;
  password: string;
}

export interface SignInResponse {
  access: string;
  refresh: string;
}

export interface SignUpError {
  detail: EmailValidateErrorType;
}

export const EmailValidateError = {
  ALREADY_EXIST_KO: '이미 가입된 이메일입니다',
  ALREADY_EXIST_EN: 'An account with this email already exists.',
  INVALID_EMAIL_FORMAT_KO: '유효하지 않은 이메일 형식입니다.',
  INVALID_EMAIL_FORMAT_EN: 'Email format is invalid.',
} as const;

export type EmailValidateErrorType = (typeof EmailValidateError)[keyof typeof EmailValidateError];
