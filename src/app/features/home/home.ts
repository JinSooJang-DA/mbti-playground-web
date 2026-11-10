import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  title = 'Squid Game MBTI'
  subtitle = 'Find your survival personality type'
  private router = inject(Router);

  startTest(): void {
    this.router.navigate(['/test'])
  }
}
  
