import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxUploadComponent } from './ngx-upload.component';

describe('NgxUploadComponent', () => {
  let component: NgxUploadComponent;
  let fixture: ComponentFixture<NgxUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
