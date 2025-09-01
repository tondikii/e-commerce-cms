"use client";
import {
  StyledSubmitButton,
  StyledInput,
  Title,
  TextSecondary,
  StoreLogo,
} from "@/components";
import {RESPONSE_MESSAGE_INVALID_EMAIL_FORMAT} from "@/constants";
import {useRedirectIfAuthenticated} from "@/hooks";
import {validateEmailFormat} from "@/utils";
import {Key, Mail, Visibility, VisibilityOff} from "@mui/icons-material";
import {Box, Card, IconButton, Stack} from "@mui/joy";
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
  useRedirectIfAuthenticated();

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
    setFormData({...formData, [name]: value});
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
        text: "Selamat bekerja kembali di RUMAH FASHION",
        icon: "success",
      });
    } catch (err: any) {
      let message: string = err?.message || "Terjadi kesalahan tidak diketahui";
      Swal.fire({
        title: "Gagal Masuk",
        text: message,
        icon: "error",
      });
    } finally {
      setLoading(false);
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
      <Card variant="outlined" sx={{alignItems: "center", width: "33%", p: 4}}>
        <StoreLogo />
        <Stack sx={{mb: 2, textAlign: "center"}}>
          <Title>Selamat datang</Title>
          <TextSecondary>Masuk untuk mengelola dasbor</TextSecondary>
        </Stack>
        <form onSubmit={onSubmitForm} className="w-full">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
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
          </Box>
          <StyledSubmitButton type="submit" loading={loading}>
            Masuk
          </StyledSubmitButton>
        </form>
      </Card>
    </div>
  );
};
export default SignUpPage;
