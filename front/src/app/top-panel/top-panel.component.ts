import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SpeechUtils} from "../speechutils";

@Component({
  selector: 'app-top-panel',
  templateUrl: './top-panel.component.html',
  styleUrls: ['./top-panel.component.css']
})
export class TopPanelComponent {

    @Input() showMuteButton: boolean = true;
    @Output() onGoBack: EventEmitter<void> = new EventEmitter();
    @Output() settingsEmitter: EventEmitter<void> = new EventEmitter();
    showSettings: boolean = false;

    toggleSettings(): void {
        this.showSettings = !this.showSettings;
        this.settingsEmitter.emit();
    }

    protected readonly SpeechUtils = SpeechUtils;
    protected readonly console = console;
}
