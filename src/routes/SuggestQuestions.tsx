import { Colors, Layout, Typo } from '@design-system';
import { MainScrollContainer } from './Root';

function SuggestQuestions() {
  return (
    <MainScrollContainer>
      <Layout.FlexCol mt={20} w="100%" h="100%" ph={25} alignItems="center">
        <Typo type="head-line" mb={12} textAlign="center">
          {`Please Tell Us the Questions You'd Like to See on WIT`}
          <img
            src="/whoami-logo.svg"
            width="14px"
            alt="who_am_i"
            style={{
              marginLeft: 8,
            }}
          />
        </Typo>
        <Typo type="head-line" textAlign="center">
          WIT에서 보고싶은 질문들을 알려주세요
          <img
            src="/whoami-logo.svg"
            width="14px"
            alt="who_am_i"
            style={{
              marginLeft: 8,
            }}
          />
        </Typo>
        <Typo type="title-medium" pre mb={12} mt={50}>
          Hi! We heard from several of you that the current questions didn&apos;t quite hit the
          mark, or that you&apos;d like the ability to add your own. While that feature isn&apos;t
          available just yet, we&apos;d love to get a better sense of what kinds of questions you
          want to see on the platform. Whenever you have a new question idea, please use the{' '}
          <strong style={{ color: Colors.PRIMARY, fontWeight: 600 }}>
            &quot;Suggest Questions&quot; survey in the side menu
          </strong>{' '}
          (where the settings are) to help us shape this upcoming feature in a way that actually
          works for you. Thank you! ☺️
        </Typo>
        <Typo type="title-medium" pre>
          안녕하세요! 여러분 중 몇 분은 기존 질문이 아쉽다고 느끼셨거나, 직접 질문을 추가할 수
          있으면 좋겠다고 말씀해 주셨어요. 아직 그 기능은 준비되지 않았지만, 어떤 질문이 여러분에게
          더 잘 맞을지 파악하고 싶어요. 새로운 질문이 떠오르실때마다 설정이 있는 사이드 메뉴에서{' '}
          <strong style={{ color: Colors.PRIMARY, fontWeight: 600 }}>
            &quot;질문 제안하기&quot; 설문
          </strong>
          을 통해 의견을 보내주세요. 여러분의 피드백을 바탕으로 이 기능을 더 잘 만들어가고 싶습니다.
          감사합니다! ☺️
        </Typo>
      </Layout.FlexCol>
    </MainScrollContainer>
  );
}

export default SuggestQuestions;
