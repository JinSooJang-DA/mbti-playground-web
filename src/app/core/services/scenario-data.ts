import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { ScenarioTest, ResultDetailMap } from '../models/scenario.model';

// 테스트 트리와 결과 상세를 한 번에 묶어서 반환할 형태
export interface FullTestData {
  scenario: ScenarioTest;
  results: ResultDetailMap;
}

@Injectable({
  providedIn: 'root'
})
export class ScenarioData {
  private http = inject(HttpClient);

  // 1. 시나리오 트리만 가져올 때
  getScenario(testId: string = 's1'): Observable<ScenarioTest> {
    return this.http.get<ScenarioTest>(`/content/test_${testId}.json`);
  }

  // 2. 결과 상세 데이터만 가져올 때
  getResults(testId: string = 's1'): Observable<ResultDetailMap> {
    return this.http.get<ResultDetailMap>(`/content/results_${testId}.json`);
  }

  // 3. 테스트 시작 시 두 파일을 한 번에 묶어서 가져올 때 (추천)
  getFullTest(testId: string = 's1'): Observable<FullTestData> {
    return forkJoin({
      scenario: this.getScenario(testId),
      results: this.getResults(testId)
    });
  }
}