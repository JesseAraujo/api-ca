export interface User {
  id: number | string;
  email: string;
  name?: string | null;
  password_hash?: string | null;
  admin?: boolean | number | null;
  must_change_password?: boolean | number | null;
  verified?: boolean | number | null;
  created?: string | null;
  updated?: string | null;
}
