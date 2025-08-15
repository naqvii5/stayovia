import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useModifyBooking } from '../../../context/ModifyBookingContext';
import toast, { Toaster } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Spinner from '../../../components/Spinner';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef(null);

  const { loginWithToken } = useModifyBooking();

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Email and password are required!');
      return;
    }

    setLoading(true);

    // Simulated API login
    setTimeout(() => {
      const dummyToken = 'dummy_token_123';
      loginWithToken(dummyToken);
      toast.success('Login successful!');
      setLoading(false);
    }, 1500);
  };

  return (
    <Wrapper>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <LoginBox onSubmit={handleLogin}>
        <Title>Log in</Title>
        <Subtitle>Log in to access our bookings.</Subtitle>

        <FieldGroup>
          <Label>Email address</Label>
          <Input
            type="email"
            ref={emailRef}
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FieldGroup>

        <FieldGroup>
          <Label>Password</Label>
          <PasswordWrapper>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <ToggleIcon onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </ToggleIcon>
          </PasswordWrapper>
        </FieldGroup>

        <LoginButton type="submit" disabled={loading}>
          {loading ? (
            <>
              Logging in <Spinner />
            </>
          ) : (
            'Login'
          )}
        </LoginButton>
      </LoginBox>
    </Wrapper>
  );
}
const Wrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  // min-height: 85vh;
  // background: ${({ theme }) => theme.colors.mainBackground};
  padding: 2rem;
`;

const LoginBox = styled.form`
  background: ${({ theme }) => theme.colors.cardColor};
  width: 100%;
  max-width: 550px;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px ${({ theme }) => theme.colors.cardColor2};
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: flex-start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.heading};
  margin: 0;
  text-align: left;
  width: 100%;
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.secondaryText};
  text-align: left;
  width: 100%;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.primaryText};
`;

const Input = styled.input`
  padding: 1rem;
  font-size: ${({ theme }) => theme.fontSizes.small};
  border: 1px solid #ccc;
  border-radius: 1.7rem;
  background: #fff;
  color: #333;
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

const ToggleIcon = styled.div`
  position: absolute;
  right: 1rem;
  color: #999;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  width: 100%;
  border-radius: 1.8rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    color: black;
    background: ${({ theme }) => theme.colors.cardColor2};
  }
`;
