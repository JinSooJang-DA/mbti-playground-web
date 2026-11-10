import { Routes } from '@angular/router';
import { Home } from './features/home/home'
import { Test } from './features/test/test'

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'test', component: Test }
];

