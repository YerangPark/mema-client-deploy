import JoinIcon from '@/assets/icons/svg/join.svg';
import styled from 'styled-components';

const MeetingJoinGuide = () => {
  return (
    <Container>
      <JoinIcon />
      <p className="title">미팅에 참여하시나요?</p>
      <p className="description">전달받으신 코드 6자리를 입력하고 미팅에 참여해요!</p>
    </Container>
  );
};
export default MeetingJoinGuide;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px 0 50px;
  text-align: center;
  svg {
    margin-bottom: 20px;
  }
  .title {
    margin-bottom: 10px;
    ${({ theme }) => theme.fonts.title.md};
  }
  .description {
    ${({ theme }) => theme.fonts.text.lg};
  }
`;
