import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  afterNextRender,
  effect,
  input,
  output,
  viewChild
} from '@angular/core';

declare const YT: any;

@Component({
  selector: 'app-youtube-player',
  templateUrl: './youtube-player.html',
  styleUrl: './youtube-player.scss'
})
export class YoutubePlayer implements OnInit, OnDestroy {
  readonly videoId = input.required<string>();
  readonly choiceAtSec = input<number | undefined>(undefined); // 1. 선택지 노출 초 입력받기
  readonly videoEnded = output<void>();
  readonly choiceTriggered = output<void>(); // 2. 선택 시점 도달 이벤트

  private playerContainer = viewChild<ElementRef<HTMLDivElement>>('playerTarget');
  private player: any = null;
  private timeCheckInterval: any = null;
  private hasTriggeredChoice = false;

  constructor() {
    afterNextRender(() => {
      this.initPlayer();
    });

    effect(() => {
      const nextId = this.videoId();
      if (this.player?.loadVideoById) {
        this.hasTriggeredChoice = false;
        this.player.loadVideoById(nextId);
      }
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.stopTimeTracker();
    if (this.player?.destroy) {
      this.player.destroy();
    }
  }

  private initPlayer(): void {
    const container = this.playerContainer()?.nativeElement;
    if (!container || typeof YT === 'undefined' || !YT.Player) {
      return;
    }

    this.player = new YT.Player(container, {
      videoId: this.videoId(),
      playerVars: {
        autoplay: 1,
        controls: 1,       // 개발 및 테스트 편의를 위해 컨트롤바 활성화
        rel: 0,
        modestbranding: 1
      },
      events: {
        onStateChange: (event: any) => {
          // 재생 중 (PLAYING: 1)
          if (event.data === 1) {
            this.startTimeTracker();
          } else {
            this.stopTimeTracker();
          }

          // 영상 종료 (ENDED: 0)
          if (event.data === 0) {
            this.videoEnded.emit();
          }
        }
      }
    });
  }

  private startTimeTracker(): void {
    this.stopTimeTracker();
    this.timeCheckInterval = setInterval(() => {
      if (!this.player?.getCurrentTime) return;

      const currentSec = this.player.getCurrentTime();
      const targetSec = this.choiceAtSec();

      if (targetSec !== undefined && currentSec >= targetSec && !this.hasTriggeredChoice) {
        this.hasTriggeredChoice = true;
        this.choiceTriggered.emit();
      }
    }, 500);
  }

  private stopTimeTracker(): void {
    if (this.timeCheckInterval) {
      clearInterval(this.timeCheckInterval);
      this.timeCheckInterval = null;
    }
  }
}