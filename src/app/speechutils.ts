
export class SpeechUtils {

    static first_language_utt: SpeechSynthesisUtterance = new SpeechSynthesisUtterance();
    static second_language_utt: SpeechSynthesisUtterance = new SpeechSynthesisUtterance();


    static speak(text: string, useFirstLanguage: boolean = true) {
        if(useFirstLanguage) {
            this.first_language_utt.text = text;
            console.log(this.first_language_utt.lang, this.first_language_utt.voice);
            console.log("using the first voice, i am trying to say" + text);
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(this.first_language_utt);
            return
        }
        this.second_language_utt.text = text;
        console.log("using the second voice, i am trying to say" + text);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(this.second_language_utt);
    }
}