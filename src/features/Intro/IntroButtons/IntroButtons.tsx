'use client';
import React from 'react';
import NaverLogo from '@/assets/icons/svg/naver.svg';
import styled, { css } from 'styled-components';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import { theme } from '@/styles/theme';

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8080';

const IntroButtons = () => {
  const router = useRouter();

  const handleNaverLogin = async () => {
    window.location.href = `${baseURL}/oauth2/authorization/naver`;
  };

  return (
    <ButtonContainer>
      <NaverLoginButton onClick={handleNaverLogin}>
        <NaverLogo />
        네이버로 로그인
      </NaverLoginButton>
      <StyledCustomButton name="이메일로 로그인" onClick={() => router.push('/login')} />
      <TextButton>
        <Link onClick={() => router.push('/signup')}>회원가입</Link>
        {/*<span className="divider">|</span>*/}
        {/*<Link onClick={() => router.push('/findpw')}> 비밀번호 찾기</Link>*/}
      </TextButton>
    </ButtonContainer>
  );
};

export default IntroButtons;

const ButtonContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  bottom: 138px;
  width: calc(100% - 32px);
  gap: 8px;
  svg {
    margin-right: 16px;
  }
`;

const NaverLoginButton = styled.button`
  height: 55px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #03c75a;
  border-color: transparent;
  ${({ theme }) => {
    return css`
      ${theme.fonts.title.sm};
      border-radius: ${theme.borderRadius.medium};
      color: ${theme.colors.white};
      &:hover {
        background-color: #ABDBC1;
      }
      &:active {
        background-color: #028a48;
        color: ${theme.colors.darker};
      }
      &:disabled {
        background-color: ${theme.colors.gray[5]};
      `;
  }}
`;

const StyledCustomButton = styled(Button)`
  height: 55px;
  margin-bottom: 24px;
`;

const TextButton = styled.p`
  ${theme.fonts.text.sm};
  color: ${theme.colors.gray[3]};
  .divider {
    margin: 0 20px;
  }
`;

const Link = styled.span`
  cursor: pointer;
`;
