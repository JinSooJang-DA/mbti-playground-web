import { Injectable, signal } from '@angular/core';
import { ScenarioNode, ScenarioOption, ScenarioTest } from '../models/scenario.model';


@Injectable({
  providedIn: 'root',
})
export class TestState {
  // 1. 상태(Signals) 정의
  readonly currentTest = signal<ScenarioTest | null>(null);
  readonly currentNode = signal<ScenarioNode | null>(null);
  readonly selectedTraits = signal<string[]>([]);

  // 2. 테스트 시작/초기화 메서드
  initTest(test: ScenarioTest): void {
    this.currentTest.set(test);
    this.selectedTraits.set([]);

    // 시작 노드 설정
    const firstNode = test.nodes[test.startNodeId];
    this.currentNode.set(firstNode ?? null);
  }

  // 3. 사용자가 A 또는 B 선택지를 골랐을 때 다음 노드로 이동하는 메서드
  selectOption(option: ScenarioOption): void {
    const test = this.currentTest();
    if (!test) return;

    // 선택한 성향(E, I 등)을 기록에 누적
    this.selectedTraits.update(traits => [...traits, option.trait]);

    // 다음 노드로 교체 (트리의 다음 단계 또는 결과 노드)
    const nextNode = test.nodes[option.nextId];
    if (nextNode) {
      this.currentNode.set(nextNode);
    }
  }
}
