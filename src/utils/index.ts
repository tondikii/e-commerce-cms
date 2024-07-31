import {REGEX_EMAIL} from "@/constant";

export const validateEmailFormat = (email: string) => REGEX_EMAIL.test(email);
