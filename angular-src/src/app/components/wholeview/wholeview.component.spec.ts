import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WholeviewComponent } from './wholeview.component';

describe('WholeviewComponent', () => {
  let component: WholeviewComponent;
  let fixture: ComponentFixture<WholeviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WholeviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WholeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
