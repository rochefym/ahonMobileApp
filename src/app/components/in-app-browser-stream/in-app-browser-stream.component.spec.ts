import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InAppBrowserStreamComponent } from './in-app-browser-stream.component';

describe('InAppBrowserStreamComponent', () => {
  let component: InAppBrowserStreamComponent;
  let fixture: ComponentFixture<InAppBrowserStreamComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InAppBrowserStreamComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InAppBrowserStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
