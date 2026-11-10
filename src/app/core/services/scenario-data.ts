import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScenarioTest } from '../models/scenario.model';

@Injectable({
  providedIn: 'root'
})
export class ScenarioData {
  private http = inject(HttpClient);

  getTestById(testId: string): Observable<ScenarioTest> {
    const url = `/content/${testId}.json`;
    return this.http.get<ScenarioTest>(url);
  }
}