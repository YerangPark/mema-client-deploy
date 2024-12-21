'use client';
import styled from 'styled-components';
import React from 'react';
import { UseInputStateReturn } from '@/lib/hooks/useInputState';
import InputWrapper from '@/components/Input/InputWrapper';
import Input from '@/components/Input';

type JoinCodeInputProps = {
  joinCode: UseInputStateReturn;
};

const JoinCodeInput: React.FC<JoinCodeInputProps> = ({ joinCode }) => {
  return (
    <>
      <Container>
        <InputWrapper isFocused={joinCode.isFocused} isEmpty={joinCode.isEmpty}>
          <Input
            type="text"
            value={joinCode.value}
            placeholder="참여 코드를 입력해주세요"
            onChange={joinCode.handleChange}
            onFocus={joinCode.handleFocus}
            onBlur={joinCode.handleBlur}
          />
        </InputWrapper>
      </Container>
    </>
  );
};

export default JoinCodeInput;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-bottom: 100px;
`;
