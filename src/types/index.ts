import {ReactNode} from "react";

// custom event.target component Select @mui/joy
export interface CustomTargetType {
  name: string;
  value: string | number;
}

export interface UserType {
  name: string;
  email: string;
}

export type SessionType = {
  user: UserType;
} | null;

export interface MenuType {
  label: string;
  route: string;
  icon: ReactNode;
}
export type MenusType = MenuType[];
