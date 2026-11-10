import { Injectable, signal } from '@angular/core';

export type SupportedLang = 'ko' | 'en' | 'de';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  // 기본 언어는 한국어('ko')로 시작
  readonly currentLang = signal<SupportedLang>('ko');

  // 지원 언어 목록
  readonly availableLangs: { code: SupportedLang; label: string }[] = [
    { code: 'ko', label: 'KO' },
    { code: 'en', label: 'EN' },
    { code: 'de', label: 'DE' }
  ];

  // 언어 변경 메서드
  setLanguage(lang: SupportedLang): void {
    this.currentLang.set(lang);
  }
}