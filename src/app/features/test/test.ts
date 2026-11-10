import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScenarioData } from '../../core/services/scenario-data';
import { TestState } from '../../core/services/test-state';
import { ScenarioOption } from '../../core/models/scenario.model';
import { YoutubePlayer } from '../../shared/ui/youtube-player/youtube-player';

@Component({
  selector: 'app-test',
  imports: [CommonModule, YoutubePlayer], // 1. YoutubePlayer 컴포넌트 등록
  templateUrl: './test.html',
  styleUrl: './test.scss'
})
export class Test implements OnInit {
  private dataService = inject(ScenarioData);
  readonly state = inject(TestState);

  // 2. 선택지 버튼 표시 여부 상태 Signal
  readonly isChoiceVisible = signal(false);

  ngOnInit(): void {
    this.dataService.getTestById('squid-game-s1').subscribe({
      next: (testData) => {
        this.state.initTest(testData);
      },
      error: (err) => {
        console.error('시나리오 데이터를 불러오지 못했습니다:', err);
      }
    });
  }

  // 3. 영상 재생 종료 시 호출
  onVideoEnded(): void {
    this.isChoiceVisible.set(true);
  }

  // 4. 선택지 클릭 시 다음 노드로 이동하고 버튼 숨기기
  onChoose(option: ScenarioOption): void {
    this.isChoiceVisible.set(false);
    this.state.selectOption(option);
  }
}