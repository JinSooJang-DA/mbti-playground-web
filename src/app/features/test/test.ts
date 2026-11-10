import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScenarioData } from '../../core/services/scenario-data';
import { TestState } from '../../core/services/test-state';
import { LanguageService } from '../../core/services/language';
import { ScenarioOption } from '../../core/models/scenario.model';
import { YoutubePlayer } from '../../shared/ui/youtube-player/youtube-player';

@Component({
  selector: 'app-test',
  imports: [CommonModule, YoutubePlayer],
  templateUrl: './test.html',
  styleUrl: './test.scss'
})
export class Test implements OnInit {
  private dataService = inject(ScenarioData);
  readonly state = inject(TestState);
  readonly langService = inject(LanguageService);

  readonly isChoiceVisible = signal(false);

  // 고정 UI 라벨 다국어 사전
  readonly uiText = {
    survivalRate: { ko: '생존율', en: 'Survival Rate', de: 'Überlebensrate' },
    bestPartner: { ko: '환상의 궁합', en: 'Best Match', de: 'Bester Partner' },
    worstPartner: { ko: '환장의 궁합', en: 'Worst Match', de: 'Schlechtester Partner' },
    restart: { ko: '다시 테스트하기', en: 'Retake Test', de: 'Test wiederholen' },
    stage: { ko: '단계', en: 'Stage', de: 'Stufe' }
  };

  ngOnInit(): void {
    this.dataService.getFullTest('s1').subscribe({
      next: (data) => {
        this.state.initTest(data.scenario, data.results);
      },
      error: (err: unknown) => {
        console.error('시나리오 데이터를 불러오지 못했습니다:', err);
      }
    });
  }

  onVideoEnded(): void {
    this.isChoiceVisible.set(true);
  }

  onChoose(option: ScenarioOption): void {
    this.isChoiceVisible.set(false);
    this.state.selectOption(option);
  }

  onRestart(): void {
    this.isChoiceVisible.set(false);
    this.state.restartTest();
  }
}