import { Injectable, computed, signal } from '@angular/core';
import {
  ScenarioTest,
  ScenarioNode,
  QuestionNode,
  ResultDetail,
  ResultDetailMap,
  ScenarioOption
} from '../models/scenario.model';

@Injectable({
  providedIn: 'root'
})
export class TestState {
  // 1. 전체 시나리오 트리 및 결과 상세 데이터 보관
  readonly currentTest = signal<ScenarioTest | null>(null);
  readonly resultsMap = signal<ResultDetailMap | null>(null);

  // 2. 현재 화면에 표시 중인 노드 ID
  readonly currentNodeId = signal<string | null>(null);

  // 3. 사용자가 고른 성향 코드 누적 (예: ['E', 'S', 'T', 'J'])
  readonly selectedTraits = signal<string[]>([]);

  // 4. 현재 노드 데이터 (QuestionNode 또는 ResultNode)
  readonly currentNode = computed<ScenarioNode | null>(() => {
    const test = this.currentTest();
    const nodeId = this.currentNodeId();
    if (!test || !nodeId) return null;
    return test.nodes[nodeId] ?? null;
  });

  // 5. 현재 진행 단계 (질문 1~4, 결과 5)
  readonly currentStage = computed<number>(() => {
    const node = this.currentNode();
    if (node?.type === 'question') {
      return (node as QuestionNode).stage;
    }
    if (node?.type === 'result') {
      return 5;
    }
    return 1;
  });

  // 6. 진행 퍼센트 (20% 단위: 1->20%, 2->40%, 3->60%, 4->80%, 결과->100%)
  readonly progressPercent = computed<number>(() => {
    return this.currentStage() * 20;
  });

  // 7. 결과 노드 도달 시 매칭되는 상세 결과 카드 정보
  readonly currentResultDetail = computed<ResultDetail | null>(() => {
    const node = this.currentNode();
    const results = this.resultsMap();
    if (!node || node.type !== 'result' || !results) return null;
    return results[node.mbtiType] ?? null;
  });

  // 데이터 초기화 메서드 (테스트 시작 시 호출)
  initTest(scenario: ScenarioTest, results: ResultDetailMap): void {
    this.currentTest.set(scenario);
    this.resultsMap.set(results);
    this.currentNodeId.set(scenario.startNodeId);
    this.selectedTraits.set([]);
  }

  // A/B 선택지 클릭 시 다음 노드로 전진
  selectOption(option: ScenarioOption): void {
    this.selectedTraits.update((traits) => [...traits, option.trait]);
    this.currentNodeId.set(option.nextId);
  }

  // 테스트 다시 시작하기
  restartTest(): void {
    const test = this.currentTest();
    if (test) {
      this.currentNodeId.set(test.startNodeId);
      this.selectedTraits.set([]);
    }
  }
}