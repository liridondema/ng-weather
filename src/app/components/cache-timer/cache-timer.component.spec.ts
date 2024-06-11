import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacheTimerComponent } from './cache-timer.component';

describe('CacheTimerComponent', () => {
  let component: CacheTimerComponent;
  let fixture: ComponentFixture<CacheTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CacheTimerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CacheTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
