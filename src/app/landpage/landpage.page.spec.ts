import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LandpagePage } from './landpage.page';

describe('LandpagePage', () => {
  let component: LandpagePage;
  let fixture: ComponentFixture<LandpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandpagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LandpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
