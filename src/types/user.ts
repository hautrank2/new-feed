export interface IUser {
  _id?: string;
  username: string;
  email?: string;
  password: string;
  phone?: string;
  isValidPhone?: boolean;
  name?: string;
  role: RoleType;
  isActive: boolean;
  emailOrPhone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum RoleType {
  ADMIN = "admin",
  CUSTOMER = "customer",
}
