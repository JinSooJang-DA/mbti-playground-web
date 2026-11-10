import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScenarioData } from '../../core/services/scenario-data';
import { TestState } from '../../core/services/test-state';
import { LanguageService } from '../../core/services/language'; // 1. 추가
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
  readonly langService = inject(LanguageService); // 2. 추가

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

  onVideoEnded(): void {
    this.isChoiceVisible.set(true);
  }

  onChoose(option: ScenarioOption): void {
    this.isChoiceVisible.set(false);
    this.state.selectOption(option);
  }
}