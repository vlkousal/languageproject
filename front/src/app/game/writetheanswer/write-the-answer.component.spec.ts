import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteTheAnswerComponent } from './write-the-answer.component';
import {ReactiveFormsModule} from "@angular/forms";

describe('WritetheanswerComponent', () => {
    let component: WriteTheAnswerComponent;
    let fixture: ComponentFixture<WriteTheAnswerComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [WriteTheAnswerComponent],
            imports: [ReactiveFormsModule]
        });
        fixture = TestBed.createComponent(WriteTheAnswerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
