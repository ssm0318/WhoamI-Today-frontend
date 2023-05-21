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

/** TODO: 패스워드 유효 검증 백엔드 반영 후 확인 필요 */
export interface PasswordError {
  password: PasswordValidateErrorType;
}

export const PasswordValidateError = {
  MUST_INCLUDE_NUM_KO: '비밀번호는 숫자(0-9)를 한 개 이상 포함해야 합니다',
  MUST_INCLUDE_NUM_EN: 'Your password must contain at least 1 digit, 0-9.',
  MUST_INCLUDE_ALPHABET_UPPER_KO: '비밀번호는 알파벳 대문자(A-Z)를 한 개 이상 포함해야 합니다.',
  MUST_INCLUDE_ALPHABET_UPPER_EN: 'Your password must contain at least 1 uppercase letter, A-Z.',
  MUST_INCLUDE_ALPHABET_LOWER_KO: '비밀번호는 알파벳 소문자(a-z)를 한 개 이상 포함해야 합니다.',
  MUST_INCLUDE_ALPHABET_LOWER_EN: 'Your password must contain at least 1 lowercase letter, a-z.',
  MUST_INCLUDE_SPECIAL_CHAR_KO:
    '비밀번호는 특수문자를 한 개 이상 포함해야 합니다: ()[]{}|\\`~!@#$%^&*_-+=;:\'",<>./?',
  MUST_INCLUDE_SPECIAL_CHAR_EN:
    'Your password must contain at least 1 symbol: ()[]{}|\\`~!@#$%^&*_-+=;:\'",<>./?',
} as const;

export type PasswordValidateErrorType =
  (typeof PasswordValidateError)[keyof typeof PasswordValidateError];
