import styled from 'styled-components';

function Reimbursement() {
  return (
    <Page aria-labelledby="reimbursement-title">
      <Panel>
        <Eyebrow>Reimbursement</Eyebrow>
        <Title id="reimbursement-title">Page under construction</Title>
        <Body>Please revisit this page later.</Body>
      </Panel>
    </Page>
  );
}

const Page = styled.main`
  min-height: calc(100dvh - 44px - 70px);
  margin-top: 44px;
  margin-bottom: 70px;
  padding: 32px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
`;

const Panel = styled.section`
  width: 100%;
  max-width: 320px;
  padding: 28px 22px;
  border: 1px solid #ece7f5;
  border-radius: 8px;
  background: #fbf8ff;
  text-align: center;
`;

const Eyebrow = styled.p`
  margin: 0 0 8px;
  color: #8700ff;
  font-size: 12px;
  font-weight: 700;
`;

const Title = styled.h1`
  margin: 0;
  color: #1f1f1f;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.25;
`;

const Body = styled.p`
  margin: 12px 0 0;
  color: #5f5f68;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.5;
`;

export default Reimbursement;
