import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ng2fileuploadComponent } from './ng2fileupload.component';

describe('Ng2fileuploadComponent', () => {
  let component: Ng2fileuploadComponent;
  let fixture: ComponentFixture<Ng2fileuploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ng2fileuploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ng2fileuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
