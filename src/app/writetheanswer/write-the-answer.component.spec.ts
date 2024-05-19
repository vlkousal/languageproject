import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteTheAnswerComponent } from './write-the-answer.component';
import {ReactiveFormsModule} from "@angular/forms";
import {Word} from "../constants";

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

    it('should be a wrong answer', () => {
        component.correctAnswers = 0;
        component.current = new Word(-1, -1, "question", "phonetic", "correct", ["correct", "wrong", "wrong"]);
        component.writtenAnswer.setValue("wrong");
        component.checkWrittenAnswer();
        expect(component.correctAnswers).toBe(0);
    })

    it('should be a correct answer', () => {
        component.correctAnswers = 0;
        component.current = new Word(-1, -1, "question", "phonetic", "correct", ["correct", "wrong", "wrong"]);
        component.writtenAnswer.setValue("correct");
        component.checkWrittenAnswer();
        expect(component.correctAnswers).toBe(0);
    })
});
