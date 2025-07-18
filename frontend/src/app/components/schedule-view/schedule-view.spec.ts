import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleView } from './schedule-view';

describe('ScheduleView', () => {
  let component: ScheduleView;
  let fixture: ComponentFixture<ScheduleView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
