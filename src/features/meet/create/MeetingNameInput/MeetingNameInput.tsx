import { UseInputStateReturn } from '@/lib/hooks/useInputState';
import InputWrapper from '@/components/Input/InputWrapper';
import Input from '@/components/Input';
import styled from 'styled-components';
import React from 'react';
import Label from '@/components/common/Label';

type MeetingNameInputProps = {
  meetingName: UseInputStateReturn;
};

const MeetingNameInput: React.FC<MeetingNameInputProps> = ({ meetingName }) => {
  return (
    <>
      <Container>
        <InputWrapper isFocused={meetingName.isFocused} isEmpty={meetingName.isEmpty}>
          <Label>이름</Label>
          <Input
            type="text"
            value={meetingName.value}
            placeholder="미팅 이름을 입력하세요."
            onChange={meetingName.handleChange}
            onFocus={meetingName.handleFocus}
            onBlur={meetingName.handleBlur}
          />
        </InputWrapper>
      </Container>
    </>
  );
};

export default MeetingNameInput;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-bottom: 100px;
`;
