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
  readonly choiceWindowSec = input<number>(15); // 기본 선택 대기시간 15초
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
        onStateChange: (event: any) => {
          // 재생 중 (PLAYING: 1)
          if (event.data === 1) {
            this.startTimeTracker();
          } else {
            this.stopTimeTracker();
          }

          // 종료 (ENDED: 0)
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
      if (!this.player?.getCurrentTime || !this.player?.getDuration) return;

      const currentSec = this.player.getCurrentTime();
      const totalSec = this.player.getDuration();

      // 영상 전체 길이 - 선택 제한시간(예: 38 - 15 = 23초) 계산
      const triggerSec = Math.max(0, totalSec - this.choiceWindowSec());

      if (totalSec > 0 && currentSec >= triggerSec && !this.hasTriggeredChoice) {
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