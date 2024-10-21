import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageInProgressComponent } from './page-in-progress.component';

describe('PageInProgressComponent', () => {
  let component: PageInProgressComponent;
  let fixture: ComponentFixture<PageInProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageInProgressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PageInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
