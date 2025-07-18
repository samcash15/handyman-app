import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ClientListComponent } from './components/client-list/client-list';
import { ProjectListComponent } from './components/project-list/project-list';
import { ScheduleViewComponent } from './components/schedule-view/schedule-view';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    ClientListComponent,
    ProjectListComponent,
    ScheduleViewComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Handyman App');
}
