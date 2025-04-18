import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { BaseComponent } from "../base/base.component";
import { ReactiveFormsModule, AbstractControl } from "@angular/forms";

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let username: AbstractControl;
    let password: AbstractControl;
    let password_again: AbstractControl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [RegisterComponent, BaseComponent],
            imports: [ReactiveFormsModule]
        });

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;

        username = component.registerForm.get("username")!;
        password = component.registerForm.get("password")!;
        password_again = component.registerForm.get("password_again")!;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should fail as a username because it's too short", () => {
        username.setValue("jmz");
        password.setValue("validpa55word");
        password_again.setValue("validpa55word");
        component.onInputChange();
        expect(component.isValid).toBeFalse();
    });

    it("should fail as a username as it contains illegal chars", () => {
        username.setValue("$[helloplease]");
        password.setValue("validpa55word");
        password_again.setValue("validpa55word");
        component.onInputChange();
        expect(component.isValid).toBeFalse();
    });

    it("should fail as a username as it's too long", () => {
        username.setValue("IMustNotFearFearIsTheMindKiller");
        password.setValue("validpa55word");
        password_again.setValue("validpa55word");
        component.onInputChange();
        expect(component.isValid).toBeFalse();
    });

    it("should fail because password wasn't written", () => {
        username.setValue("vladko");
        password.setValue("");
        password_again.setValue("");
        component.onInputChange();
        expect(component.isValid).toBeFalse();
    });

    it("should fail because password was too short", () => {
        username.setValue("vogel");
        password.setValue("538");
        password_again.setValue("538");
        component.onInputChange();
        expect(component.isValid).toBeFalse();
    });

    it("should fail because the password wasn't written again", () => {
        username.setValue("vladko");
        password.setValue("p8ssw0rd");
        password_again.setValue("");
        component.onInputChange();
        expect(component.isValid).toBeFalse();
    });

    it("should fail because the passwords don't match", () => {
        username.setValue("vladko");
        password.setValue("l3gitp8ssw0rd");
        password_again.setValue("legitpassword");
        component.onInputChange();
        expect(component.isValid).toBeFalse();
    });

    it("should be completely legal", () => {
        username.setValue("lmtp_protokol");
        password.setValue("WalecParkFernetAK47");
        password_again.setValue("WalecParkFernetAK47");
        component.onInputChange();
        expect(component.isValid).toBeTrue();
    });

    it("should be correct", () => {
        username.setValue("lucas.smallhands");
        password.setValue("l3gitp8ssw0rd");
        password_again.setValue("l3gitp8ssw0rd");
        component.onInputChange();
        expect(component.isValid).toBeTrue();
    });
});
