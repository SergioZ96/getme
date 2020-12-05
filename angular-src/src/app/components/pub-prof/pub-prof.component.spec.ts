import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PubProfComponent } from './pub-prof.component';

describe('PubProfComponent', () => {
  let component: PubProfComponent;
  let fixture: ComponentFixture<PubProfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PubProfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PubProfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
