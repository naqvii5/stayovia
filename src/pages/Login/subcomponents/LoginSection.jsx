// LoginSection.jsx
import React from "react";
import styled from "styled-components";
import { useThemeContext } from "../../../theme/ThemeProvider";
import logoSrc from "../../../assets/StayoViaLogo.png";
import heroImg from "../../../assets/login_hero_back_images.png";
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import SwitchThemeBtn from "../../../components/SwitchThemeBtn";
import Header from "../../../components/Header";
import toast from "react-hot-toast";
import { login } from "../../../api/login";

// ——— Import React Hook Form & Zod Resolver ———
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { setAuthToken } from "../../../utils/authCookies";
import { usePermissions } from "../../../context/PermissionsContext";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";

const Container = styled.section`
  position: relative;
  width: 100%;
  margin: 0 auto;
  padding: 20px 100px 0 100px;
  background: linear-gradient(
    to top,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.secondary} 100%
  );
  color: ${({ theme }) => theme.colors.primaryText};
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 10px 10px 0 10px;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
`;

const Logo = styled.img`
  height: 40px;
  cursor: pointer;
`;

const ContentRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  gap: 10px;
  margin-top: 150px;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const LeftContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-self: start;
  padding-right: 2rem;
  width: 100%;

  h2 {
    font-family: ${({ theme }) => theme.fonts.primaryHeading};
    color: ${({ theme }) => theme.colors.primaryHeading};
    font-size: ${({ theme }) => theme.fontSizes.xxlarge};
    margin-bottom: 1rem;
  }

  p {
    font-family: ${({ theme }) => theme.fonts.primaryText};
    font-size: ${({ theme }) => theme.fontSizes.large};
    color: ${({ theme }) => theme.colors.primaryHeading};
    line-height: 1.5;
  }
`;

const RightContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: center;
  }
`;

const CardWrapper = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 460px;
  padding: 2rem;
  background: ${({ theme }) =>
    theme.mode === "light" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.4)"};
  border-radius: 1rem 1rem 0 0;
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.primaryHeading};
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  color: ${({ theme }) => theme.colors.primaryHeading};
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.secondaryText};
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const Icon = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: 1.25rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid ${({ theme }) => theme.colors.secondaryText};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.mainBackground};
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.secondary}33;
  }
`;

/* (Optional) Style for error messages */
const ErrorText = styled.span`
  color: red;
  font-size: ${({ theme }) => theme.fontSizes.xxsmall};
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
`;

const ForgotLink = styled.a`
  align-self: flex-end;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  margin-bottom: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.small};
  cursor: pointer;
  margin-top: 0.5rem;

  &:hover {
    opacity: 0.9;
  }
`;

const SignUpText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.primaryText};
  text-align: center;
  margin-top: 1.5rem;
`;

const SignUpLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const HeroImage = styled.img`
  position: absolute;
  bottom: 0;
  width: 100%;
  max-width: 950px;
  max-height: 300px;
  height: auto;
  z-index: 0;
  object-fit: contain;
`;

// ——— Zod schema for login form ———
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function LoginSection() {
  const { toggleMode } = useThemeContext();
  const { setPermissions } = usePermissions();
  const { setToken } = useAuthContext();
  const navigate = useNavigate()
  // ——— Set up React Hook Form with Zod resolver ———
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur", // validate when user leaves the field
  });

  // ——— onSubmit handler (using the commented logic from handleLogin) ———
  const onSubmit = async (data) => {
    const payload = {
      email: data.email,
      password: data.password,
    };

    // Show loading toast
    // const toastId = toast.loading("Logging in…", {
    //   style: { fontSize: "1.25rem", padding: "16px 24px" },
    // });

    try {
      const data = await login(payload);
      // console.log("results", data);

      // toast.dismiss(toastId);

      if (data.status) {
        toast.success("Logged in successfully!", {
          style: { fontSize: "1.25rem", padding: "16px 24px" },
        });

        // 1. Save token in cookies (you can call your utility here)
        setAuthToken(data.token, 1);
        setToken(data.token);
        // 2. Save user roles in context or state (create middleware if needed)\
        localStorage.setItem("permissions", JSON.stringify(data?.permisssions || []));
        setPermissions(data?.permisssions || []);

        // 3. Redirect / navigate to the protected route (e.g., "/search")
        navigate("/search");
      } else {
        toast.error("Failed to login!", {
          style: { fontSize: "1.25rem", padding: "16px 24px" },
        });
      }
    } catch (err) {
      // toast.dismiss(toastId);
      toast.error("Error logging in!", {
        style: { fontSize: "1.25rem", padding: "16px 24px" },
      });
      console.error("Login error:", err);
    }
  };

  return (
    <Container>
      <Header />
      {/* If you ever want to re-enable the logo + theme toggle, uncomment below:
      <HeaderRow>
        <Logo src={logoSrc} alt="Logo" />
        <SwitchThemeBtn />
      </HeaderRow>
      */}
      <ContentRow>
        <LeftContent>
          <h2>
            Empowering Hotels to Reach
            <br></br>New Heights Globally.
          </h2>
          {/* <p>Book hotel all in one place.</p> */}
        </LeftContent>

        <RightContent>
          <CardWrapper>
            <Title>WELCOME</Title>
            <Subtitle>Please login to continue</Subtitle>

            {/* ——— Attach handleSubmit to Form ——— */}
            <Form onSubmit={handleSubmit(onSubmit)}>
              <InputWrapper>
                <Icon>
                  <AiOutlineUser />
                </Icon>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                />
              </InputWrapper>
              {errors.email && <ErrorText>{errors.email.message}</ErrorText>}

              <InputWrapper>
                <Icon>
                  <AiOutlineLock />
                </Icon>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                />
              </InputWrapper>
              {errors.password && (
                <ErrorText>{errors.password.message}</ErrorText>
              )}

              {/* Uncomment if you want a "Forgot password" link:
              <ForgotLink href="#">Forgot password?</ForgotLink>
              */}

              <LoginButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Logging in…" : "Login"}
              </LoginButton>
            </Form>

            {/* Uncomment if you need a sign-up prompt:
            <SignUpText>
              Don’t have an account? <SignUpLink href="#">Sign up</SignUpLink>
            </SignUpText>
            */}
          </CardWrapper>
        </RightContent>
      </ContentRow>

      <HeroImage src={heroImg} alt="Login Hero Background" />
    </Container>
  );
}
