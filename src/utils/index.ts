import {REGEX_EMAIL} from "@/constants";

export const validateEmailFormat = (email: string) => REGEX_EMAIL.test(email);
