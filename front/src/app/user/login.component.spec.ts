import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {BaseComponent} from "../base/base.component";
import {ReactiveFormsModule} from "@angular/forms";

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LoginComponent, BaseComponent],
            imports: [ReactiveFormsModule]
        });
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("shouldn't be valid as a username because it's empty", () => {
        component.username.setValue("");
        component.password.setValue("validpa55word");
        component.onInputChange();
        expect(component.isValid).toBeFalsy();
    })

    it("shouldn't be valid as a username because it's too short", () => {
        component.username.setValue("jmz");
        component.password.setValue("validpa55word");
        component.onInputChange();
        expect(component.isValid).toBeFalsy();
    })

    it("shouldn't be valid  as a username as it contains illegal chars", () => {
        component.username.setValue("$[helloplease]");
        component.password.setValue("validpa55word");
        component.onInputChange();
        expect(component.isValid).toBeFalsy();
    })

    it("shouldn't be valid  as a username as it's too long", () => {
        component.username.setValue("IMustNotFearFearIsTheMindKiller");
        component.password.setValue("validpa55word");
        component.onInputChange();
        expect(component.isValid).toBeFalsy();
    })

    it("shouldn't be valid  because password wasn't written", () => {
        component.username.setValue("vladko");
        component.password.setValue("");
        component.onInputChange();
        expect(component.isValid).toBeFalsy();
    })

    it("shouldn't be valid because password was too short", () => {
        component.username.setValue("vogel");
        component.password.setValue("538");
        component.onInputChange();
        expect(component.isValid).toBeFalsy();
    })

    it("should be valid", () => {
        component.username.setValue("lmtp_protokol");
        component.password.setValue("WalecParkFernetAK47");
        component.onInputChange();
        expect(component.isValid).toBeTruthy();
    })

    it("should be valid", () => {
        component.username.setValue("lucas.smallhands");
        component.password.setValue("l3gitp8ssw0rd");
        component.onInputChange();
        expect(component.isValid).toBeTruthy();
    })
});
