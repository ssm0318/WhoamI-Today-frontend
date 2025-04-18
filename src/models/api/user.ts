import { MyCheckIn } from '@models/checkIn';
import { User } from '@models/user';

export interface SignInParams {
  username: string;
  password: string;
}

export interface SignInResponse {
  access: string;
  refresh: string;
}
export interface SignInError {
  code: SignInErrorCodeType;
  detail: string;
}

const SignInErrorCode = {
  NO_USERNAME: 'username_does_not_exist',
  WRONG_PASSWORD: 'wrong_password',
} as const;

type SignInErrorCodeType = (typeof SignInErrorCode)[keyof typeof SignInErrorCode];

export interface SignUpParams {
  email: string;
  username: string;
  password: string;
  /** default: 16:00 */
  noti_time?: string;
  current_ver?: VersionType;
  user_group?: UserGroup;
  inviter_id?: number;
}

export const hasMandatorySignUpParams = (
  signUpParams: Partial<SignUpParams>,
): signUpParams is SignUpParams =>
  !!signUpParams.email && !!signUpParams.username && !!signUpParams.password;

export enum Gender {
  FEMALE,
  MALE,
  TRANSGENDER,
  NON_BINARY,
  NO_RESPOND,
}
export interface EmailError {
  detail: EmailValidateErrorType;
}

export const EmailValidateError = {
  ALREADY_EXIST_KO: '이미 가입된 이메일입니다',
  ALREADY_EXIST_EN: 'An account with this email already exists.',
  INVALID_EMAIL_FORMAT_KO: '유효하지 않은 이메일 형식입니다.',
  INVALID_EMAIL_FORMAT_EN: 'Email format is invalid.',
} as const;

export type EmailValidateErrorType = (typeof EmailValidateError)[keyof typeof EmailValidateError];

export interface PasswordError {
  password: PasswordValidateErrorType[];
  password_validation_error: string[];
}

export interface PasswordConfirmError {
  code: 'wrong_password';
  detail: 'Please check your password.' | '비밀번호를 다시 확인해주세요.';
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

export interface UsernameError {
  detail: UsernameValidateErrorType;
}

export const UsernameValidateError = {
  ALREADY_EXIST_KO: '이미 존재하는 닉네임입니다.',
  ALREADY_EXIST_EN: 'Username already exists.',
  NO_MORE_THAN_20_CHAR_KO: '닉네임은 20글자 이하로 설정해주세요.',
  NO_MORE_THAN_20_CHAR_EN: 'Username must be shorter than 21 letters.',
  CHAR_CONSTRAINTS_KO:
    '유효하지 않은 닉네임입니다. 닉네임은 영어, 한글, 숫자, 특수문자(_)만 포함할 수 있습니다.',
  CHAR_CONSTRAINTS_EN:
    'Username format is invalid. Usernames can only include letters (alphabet/Korean), numbers and underscores(_).',
} as const;

export type UsernameValidateErrorType =
  (typeof UsernameValidateError)[keyof typeof UsernameValidateError];

export type DayOfWeek = '0' | '1' | '2' | '3' | '4' | '5' | '6'; // 0 = Sunday, 1 = Monday, etc.

export enum VersionType {
  DEFAULT = 'default',
  EXPERIMENT = 'experiment',
}

export enum UserGroup {
  GROUP_1 = 'group_1', // 'Group 1: US / default (ver.R) -> experiment (ver.Q)'
  GROUP_2 = 'group_2', // 'Group 2: US / experiment (ver.Q) -> default (ver.R)'
  GROUP_3 = 'group_3', // 'Group 3: Korea / default (ver.R) -> experiment (ver.Q)'
  GROUP_4 = 'group_4', // 'Group 4: Korea / experiment (ver.Q) -> default (ver.R)'
}

export interface MyProfile extends User {
  email: string;
  date_of_birth: string | null;
  date_of_signature: string | null;
  ethnicity: unknown;
  gender: Gender;
  nationality: unknown;
  question_history: number[] | null;
  research_agreement: boolean;
  signature: string | null;
  url: string;
  noti_time: string;
  noti_period_days: DayOfWeek[];
  unread_noti: boolean;
  timezone?: string;
  check_in?: MyCheckIn;
  current_ver: VersionType;
  user_group: UserGroup;
}

export interface FriendRequest {
  requestee_id: number;
  requester_id: number;
  requester_detail: User;
  accepted: boolean;
}

export interface SentFriendRequest {
  requestee_id: number;
  requester_id: number;
  requestee_detail: User;
}
