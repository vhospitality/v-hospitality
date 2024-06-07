export interface Login {
  email: string;
  password: string;
}

export interface RequestResetPassword {
  email: string;
}

export interface Signup {
  newPassword: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  month: string;
  day: string;
  year: string;
  nin: string;
  email: string;
  phone: string;
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  email2: string;
  business_name: string;
}

export interface CardDetails {
  cardNumber: string;
  monthYear: string;
  cvv: string;
  address: boolean;
  email: string;
  city: string;
  zip: string;
  country: string;
}

export interface ResetPassword {
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Tokens {
  access: string;
}

export let OPTIONS = [
  {
    id: '',
    name: '',
    code: '',
  },
];

export let STATE = [
  {
    id: '',
    name: '',
    code: '',
  },
];

export let LGA = [
  {
    id: '',
    name: '',
    code: '',
  },
];
