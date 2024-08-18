import {Component, EventEmitter, Output} from '@angular/core';
import {SpeechUtils} from "../speechutils";

@Component({
  selector: 'app-top-panel',
  templateUrl: './top-panel.component.html',
  styleUrls: ['./top-panel.component.css']
})
export class TopPanelComponent {

    showSettings: boolean = false;
    @Output() emitter: EventEmitter<void> = new EventEmitter();
    @Output() settingsEmitter: EventEmitter<void> = new EventEmitter();

    toggleSettings(): void {
        this.settingsEmitter.emit();
        this.showSettings = !this.showSettings;
    }

    protected readonly SpeechUtils = SpeechUtils;
    protected readonly console = console;
}
