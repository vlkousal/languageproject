import {Component, EventEmitter, Input, Output} from '@angular/core';
import {WordInterface} from "../../constants"
import {DEFAULT_DELIMETER} from "../../constants";
import {FormControl} from "@angular/forms";
import {Utils} from "../../utils";

@Component({
  selector: 'app-vocabulary-file-upload',
  templateUrl: './vocabulary-file-upload.component.html',
  styleUrls: ['./vocabulary-file-upload.component.css']
})
export class VocabularyFileUploadComponent {

    @Input() words: Set<WordInterface> = new Set<WordInterface>();
    @Output() onWordChange = new EventEmitter<Set<WordInterface>>();

    delimiter: FormControl<string> = new FormControl(DEFAULT_DELIMETER) as FormControl<string>;

    uploadedWords: Set<WordInterface> = new Set<WordInterface>();
    uploaded: boolean = false;

    onDragOver(event: DragEvent) {
        event.preventDefault();
        (event.currentTarget as HTMLElement).classList.add("dragover");
    }

    onDragLeave(event: DragEvent) {
        (event.currentTarget as HTMLElement).classList.remove("dragover");
    }

    onFileDrop(event: DragEvent) {
        event.preventDefault();
        (event.currentTarget as HTMLElement).classList.remove("dragover");
        const file = event.dataTransfer?.files?.[0];
        if (file) {
            this.handleFile(file);
        }
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
            this.handleFile(file);
        }
    }

    handleFile(file: File) {
        this.uploadedWords = new Set<WordInterface>();
        const reader = new FileReader();
        reader.onload = () => {
            const fileContent = reader.result as string;
            this.uploadedWords = Utils.parseTextToVocabulary(fileContent, this.delimiter.value);
            if(this.uploadedWords.size == 0) {
                return;
            }
            this.uploaded = true;
        }
        reader.readAsText(file);
    }

    onConfirm(): void {
        for(const word of this.uploadedWords) {
            this.tryToAdd(word);
        }
        this.onWordChange.emit(this.words);
        this.uploaded = false;
    }

    tryToAdd(word: WordInterface): void {
        for(const w of this.words) {
            if(w.first == word.first && w.phonetic == word.phonetic && w.second == word.second) {
                return;
            }
        }
        this.words.add(word);
    }
}
