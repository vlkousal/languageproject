
export class SpeechUtils {

    static utt: SpeechSynthesisUtterance = new SpeechSynthesisUtterance();

    static speak(text: string) {
        this.utt.text = text;
        if (this.utt.voice == null) {
            return;
        }
        console.log(this.utt.lang, this.utt.voice.name);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(this.utt);
    }
}