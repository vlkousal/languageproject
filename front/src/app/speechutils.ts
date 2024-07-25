
export class SpeechUtils {

    static first_language_utt: SpeechSynthesisUtterance = new SpeechSynthesisUtterance();
    static second_language_utt: SpeechSynthesisUtterance = new SpeechSynthesisUtterance();
    static isMuted: boolean = false;


    static speak(text: string, useFirstLanguage: boolean = true): void {
        if(this.isMuted) return;
        if(useFirstLanguage) {
            this.first_language_utt.text = text;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(this.first_language_utt);
            return
        }
        this.second_language_utt.text = text;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(this.second_language_utt);
    }
}