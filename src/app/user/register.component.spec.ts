import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import {HttpTestingController} from "@angular/common/http/testing";
import {BaseComponent} from "../base/base.component";
import {ReactiveFormsModule} from "@angular/forms";

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [RegisterComponent, BaseComponent],
            imports: [ReactiveFormsModule]
        });
        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should fail as a username because it's empty", () => {
        component.username.setValue("");
        component.password.setValue("validpa55word");
        component.password.setValue("validpa55word");
        component.onInputChange();
        expect(component.isValid).toBeFalsy();
    })

    it("should fail as a username because it's too short", () => {
        component.username.setValue("jmz");
        component.password.setValue("validpa55word");
        component.password.setValue("validpa55word");
        component.onInputChange();
        expect(component.isValid).toBeFalsy();
    })

    it("should fail as a username as it contains illegal chars", () => {
        component.username.setValue("$[helloplease]");
        component.password.setValue("validpa55word");
        component.password.setValue("validpa55word");
        component.onInputChange();
        expect(component.isValid).toBeFalsy();
    })

    it("should fail as a username as it's too long", () => {
        component.username.setValue("IMustNotFearFearIsTheMindKiller");
        component.password.setValue("validpa55word");
        component.password_again.setValue("validpa55word");
        component.onInputChange();
        expect(component.isValid).toBeFalsy();
    })

    it("should fail because password wasn't written", () => {
        component.username.setValue("vladko");
        component.password.setValue("");
        component.password.setValue("");
        component.onInputChange();
        expect(component.isValid).toBeFalsy();
    })

    it("should fail because password was too short", () => {
        component.username.setValue("vogel");
        component.password.setValue("538");
        component.password.setValue("538");
        component.onInputChange();
        expect(component.isValid).toBeFalsy();
    })

    it("should fail because the password wasn't written again", () => {
        component.username.setValue("vladko");
        component.password.setValue("p8ssw0rd");
        component.password.setValue("");
        component.onInputChange();
        expect(component.isValid).toBeFalsy();
    })

    it("should fail because the passwords don't match", () => {
        component.username.setValue("vladko");
        component.password.setValue("l3gitp8ssw0rd");
        component.password_again.setValue("legitpassword");
        component.onInputChange();
        expect(component.isValid).toBeFalsy();
    })

    it("should be completely legal", () => {
        component.username.setValue("lmtp_protokol");
        component.password.setValue("WalecParkFernetAK47");
        component.password_again.setValue("WalecParkFernetAK47");
        component.onInputChange();
        expect(component.isValid).toBeTruthy();
    })

    it("should be correct", () => {
        component.username.setValue("lucas.smallhands");
        component.password.setValue("l3gitp8ssw0rd");
        component.password_again.setValue("l3gitp8ssw0rd");
        component.onInputChange();
        expect(component.isValid).toBeTruthy();
    })
});
