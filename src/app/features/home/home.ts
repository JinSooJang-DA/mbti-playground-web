import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  title = 'Squid Game MBTI'
  subtitle = 'Find your survival personality type'
  startTest(): void {
  console.log('Start test clicked!');
  }
}
