// 1. 다국어 지원 텍스트 (한국어, 영어, 독일어)
export interface LocalizedText {
  ko: string;
  en: string;
  de: string;
}

// 2. A / B 선택지 버튼 정보
export interface ScenarioOption {
  key: 'A' | 'B';          // 버튼 종류 (A 또는 B)
  label: LocalizedText;    // 버튼에 표시될 문구
  trait: string;           // E, I, S, N, T, F, J, P 중 하나
  nextId: string;          // 클릭 시 이동할 다음 노드 ID
}

// 3. 질문 노드 (1~4단계 영상과 2개의 선택지)
export interface QuestionNode {
  id: string;
  type: 'question';
  videoId: string;
  stage: number;           // 1단계, 2단계, 3단계, 4단계 표시용
  options: ScenarioOption[];
}

// 4. 트리의 끝에 위치한 기본 결과 노드
export interface ResultNode {
  id: string;
  type: 'result';
  videoId: string;
  mbtiType: string;        // 예: 'ENFJ', 'ISTJ'
}

// 5. 노드는 '질문 노드'이거나 '결과 노드' 둘 중 하나
export type ScenarioNode = QuestionNode | ResultNode;

// 6. test_s1.json 전체를 담는 시나리오 트리 인터페이스
export interface ScenarioTest {
  id: string;
  title: LocalizedText;
  startNodeId: string;
  choiceWindowSec: number; // 선택 제한시간 (15초)
  languages: string[];     // ['ko', 'en', 'de']
  nodes: Record<string, ScenarioNode>; // 노드 모음집
}

// 7. results_s1.json에 들어있는 16개 MBTI 상세 결과 카드 정보
export interface ResultDetail {
  mbtiType: string;
  resultNodeId: string;    // 예: 'RES_ENFJ'
  videoId: string;
  title: LocalizedText;    // 칭호 (예: '빛을 든 인도자')
  description: LocalizedText; // 설명 문구
  survivalRate: number;    // 생존율 (숫자)
  bestPartner: string;     // 환상의 궁합 MBTI
  worstPartner: string;    // 환장의 궁합 MBTI
  shortsVideoId: string | null; // 유튜브 쇼츠 ID (없으면 null)
}

// 8. 16개 결과를 MBTI 문자열을 키로 보관하는 맵
export type ResultDetailMap = Record<string, ResultDetail>;