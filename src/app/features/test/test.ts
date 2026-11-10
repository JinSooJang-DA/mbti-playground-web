import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScenarioData } from '../../core/services/scenario-data';
import { TestState } from '../../core/services/test-state';
import { ScenarioOption } from '../../core/models/scenario.model';

@Component({
  selector: 'app-test',
  imports: [CommonModule],
  templateUrl: './test.html',
  styleUrl: './test.scss'
})
export class Test implements OnInit {
  // 1. 서비스 주입 (template에서도 읽을 수 있게 public 또는 기본 선언)
  private dataService = inject(ScenarioData);
  readonly state = inject(TestState);

  ngOnInit(): void {
    // 2. 컴포넌트 로드 시 더미 JSON 데이터 불러오기
    this.dataService.getTestById('squid-game-s1').subscribe({
      next: (testData) => {
        this.state.initTest(testData);
      },
      error: (err) => {
        console.error('시나리오 데이터를 불러오지 못했습니다:', err);
      }
    });
  }

  // 3. 버튼 클릭 시 다음 노드로 전환하는 메서드
  onChoose(option: ScenarioOption): void {
    this.state.selectOption(option);
  }
}