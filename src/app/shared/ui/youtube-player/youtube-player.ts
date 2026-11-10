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
  readonly choiceAtSec = input<number | undefined>(undefined);
  readonly videoEnded = output<void>();
  readonly choiceTriggered = output<void>();

  private playerContainer = viewChild<ElementRef<HTMLDivElement>>('playerTarget');
  private player: any = null;
  private timeCheckInterval: any = null;
  private hasTriggeredChoice = false;

  constructor() {
    afterNextRender(() => {
      this.ensureYTReadyAndInit();
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

  private ensureYTReadyAndInit(): void {
    if (typeof YT !== 'undefined' && YT.ready) {
      YT.ready(() => this.initPlayer());
    } else {
      // 0.2초 뒤 재시도
      setTimeout(() => this.ensureYTReadyAndInit(), 200);
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
        controls: 1,
        rel: 0,
        modestbranding: 1
      },
      events: {
        onReady: () => {
          console.log('✅ YouTube Player 준비 완료');
        },
        onStateChange: (event: any) => {
          console.log('▶️ 플레이어 상태 변경:', event.data);
          // 재생 중 (PLAYING: 1)
          if (event.data === 1) {
            this.startTimeTracker();
          } else {
            this.stopTimeTracker();
          }

          // 종료 (ENDED: 0)
          if (event.data === 0) {
            console.log('🏁 영상 종료 감지');
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
        console.log(`🎯 선택 시점 도달 (${currentSec.toFixed(1)}초 >= ${targetSec}초)`);
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