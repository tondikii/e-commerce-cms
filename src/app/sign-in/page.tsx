"use client";
import {CopyRight, StyledSubmitButton, StyledInput} from "@/components";
import {
  MAX_VARCHAR_LENGTH,
  RESPONSE_MESSAGE_INVALID_EMAIL_FORMAT,
} from "@/constant";
import {useUnrequiredAuth} from "@/hooks";
import {validateEmailFormat} from "@/utils";
import {Key, Mail, Visibility, VisibilityOff} from "@mui/icons-material";
import {IconButton} from "@mui/joy";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useMemo, useState, type FC} from "react";
import Swal from "sweetalert2";

interface Props {}

type FormSignInType = {
  email: string;
  password: string;
};

const initialFormSignIn: FormSignInType = {
  email: "",
  password: "",
};

const SignUpPage: FC<Props> = ({}) => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormSignInType>(initialFormSignIn);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // direct to home if have session
  useUnrequiredAuth();

  const {errorsForm, isValidForm} = useMemo(() => {
    const errorsForm: FormSignInType = {...initialFormSignIn};
    let isValidForm: boolean = true;

    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof FormSignInType];
      if (!value) {
        isValidForm = false;
        if (submitted) {
          errorsForm[key as keyof FormSignInType] = "Data ini perlu diisi";
        }
      } else if (key === "email") {
        const isValidEmailFormat = validateEmailFormat(formData.email);
        if (!isValidEmailFormat) {
          errorsForm.email = RESPONSE_MESSAGE_INVALID_EMAIL_FORMAT;
          isValidForm = false;
        }
      }
    });

    return {errorsForm, isValidForm};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, submitted]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    let maxLength: number = MAX_VARCHAR_LENGTH;
    if (name === "postalCode") {
      maxLength = 5;
    }
    if (value?.length <= maxLength) {
      setFormData({...formData, [name]: value});
    } else {
      setFormData({...formData, [name]: value.slice(0, maxLength)});
    }
  };

  const onSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (!isValidForm) {
      return;
    }
    try {
      setLoading(true);
      const signInData = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (signInData?.error) {
        throw new Error(signInData.error);
      }
      router.push("/");
      Swal.fire({
        title: "Berhasil Masuk",
        text: "Selamat bekerja kembali di TokoTrend",
        icon: "success",
      });
    } catch (err: any) {
      let message: string = err?.message || "Terjadi kesalahan tidak diketahui";
      Swal.fire({
        title: "Gagal Masuk",
        text: message,
        icon: "error",
      });
    } finally{
      setLoading(false)
    }
  };

  const renderVisibilityPassword = () => {
    const sx = {color: "#626b74"};
    const toggleShowPassword = () => setShowPassword(!showPassword);
    return (
      <IconButton onClick={toggleShowPassword}>
        {showPassword ? <Visibility sx={sx} /> : <VisibilityOff sx={sx} />}
      </IconButton>
    );
  };

  return (
    <div className="flex flex-col justify-center items-center min-height-screen min-width-screen">
      <span className="text-4xl font-montserrat font-black absolute top-4 left-4">
        TokoTrend
      </span>
      <div className="flex flex-col justify-center items-center bg-secondary rounded-xl w-2/6 p-8 bg-secondary">
        <h1 className="text-3xl font-montserrat font-bold mb-4">MASUK</h1>
        <form onSubmit={onSubmitForm} className="w-full">
          <StyledInput
            label="Alamat Email"
            value={formData.email}
            onChange={onChange}
            name="email"
            errorMessage={errorsForm.email}
            placeholder="Masukkan alamat email..."
            startDecorator={<Mail />}
          />
          <StyledInput
            label="Kata Sandi"
            value={formData.password}
            onChange={onChange}
            name="password"
            errorMessage={errorsForm.password}
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan kata sandi..."
            startDecorator={<Key />}
            endDecorator={renderVisibilityPassword()}
          />
          <StyledSubmitButton type="submit" loading={loading}>
            MASUK
          </StyledSubmitButton>
        </form>
      </div>
      <div className="absolute bottom-4">
        <CopyRight />
      </div>
    </div>
  );
};
export default SignUpPage;
