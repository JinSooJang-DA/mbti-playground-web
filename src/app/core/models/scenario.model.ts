// 1. 다국어 지원 텍스트 타입 (한국어, 영어, 독일어)
export interface LocalizedText {
  ko: string;
  en: string;
  de: string;
}

// 2. MBTI 성향 단일 문자 (오타 방지용 유니온 타입)
export type MbtiTrait = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

// 3. 질문 영상의 A/B 선택지 규격
export interface ScenarioOption {
  label: LocalizedText;    // 버튼에 표시할 3개 언어 문구
  trait: MbtiTrait;        // 선택 시 얻는 성향 지표
  nextId: string;          // 이동할 다음 노드의 id
}

// 4. 질문 영상 노드 규격
export interface QuestionNode {
  type: 'question';        // 노드 종류 구분용
  id: string;              // 예: 'Q1_LightsOut', 'Q2_E_Dalgona'
  videoId: string;         // 유튜브 영상 고유 ID
  choiceAtSec?: number;    // A/B 선택 버튼을 띄울 시점 (초 단위, 선택 사항)
  options: ScenarioOption[]; // A/B 2개 선택지 배열
}

// 5. 결과 영상 노드 규격 (16개 유형)
export interface ResultNode {
  type: 'result';          // 노드 종류 구분용
  id: string;              // 예: 'R_ENFP'
  videoId: string;         // 유튜브 결과 풀영상 ID
  mbtiType: string;        // 예: 'ENFP'
  title: LocalizedText;    // 유형별 칭호
  description: LocalizedText; // 유형별 성향/생존 분석 설명
  survivalRate: number;    // 생존율 (예: 12.5)
  compatibleType: string;  // 환상의 궁합 MBTI 유형 (예: 'INFJ')
  shortsVideoId: string;   // 해당 유형 전용 유튜브 쇼츠 영상 ID
}

// 6. 전체 노드 유니온 타입
export type ScenarioNode = QuestionNode | ResultNode;

// 7. 테스트 1개 단위 최상위 데이터 구조 (시리즈 1탄, 2탄 등)
export interface ScenarioTest {
  id: string;              // 예: 'squid-game-s1'
  title: LocalizedText;    // 테스트 제목
  startNodeId: string;     // 첫 번째 질문 노드 ID (예: 'Q1_LightsOut')
  nodes: Record<string, ScenarioNode>; // id를 키(Key)로 하는 노드 맵
}