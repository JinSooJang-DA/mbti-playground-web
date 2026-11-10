import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  afterNextRender,
  input,
  output,
  viewChild
} from '@angular/core';

// 전역 window.YT 객체 타입 힌트
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

@Component({
  selector: 'app-youtube-player',
  templateUrl: './youtube-player.html',
  styleUrl: './youtube-player.scss'
})
export class YoutubePlayer implements OnInit, OnDestroy {
  // 1. 부모 컴포넌트와 통신하는 Input / Output
  readonly videoId = input.required<string>();
  readonly videoEnded = output<void>();

  // 2. HTML의 플레이어 컨테이너 요소 참조
  private playerContainer = viewChild<ElementRef<HTMLDivElement>>('playerTarget');
  private player: any = null;

  constructor() {
    // 3. 브라우저 렌더링이 완료된 뒤 플레이어 초기화
    afterNextRender(() => {
      this.initPlayer();
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.player?.destroy) {
      this.player.destroy();
    }
  }

  private initPlayer(): void {
    const container = this.playerContainer()?.nativeElement;
    if (!container || !window.YT || !window.YT.Player) {
      return;
    }

    this.player = new window.YT.Player(container, {
      videoId: this.videoId(),
      playerVars: {
        autoplay: 1,
        controls: 0,       // 몰입감을 위해 기본 컨트롤러 숨김
        rel: 0,            // 추천 영상 제한
        modestbranding: 1
      },
      events: {
        onStateChange: (event: any) => {
          // YT.PlayerState.ENDED (값이 0일 때 = 영상 종료)
          if (event.data === 0) {
            this.videoEnded.emit();
          }
        }
      }
    });
  }
}