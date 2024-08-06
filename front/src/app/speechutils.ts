
export class SpeechUtils {

    static utt: SpeechSynthesisUtterance = new SpeechSynthesisUtterance();
    static isMuted: boolean = false;

    public static play(text: string, voice: SpeechSynthesisVoice): void {
        if(this.isMuted) return;
        const volume = this.getVolume();
        this.utt.text = text;
        this.utt.volume = volume;
        this.utt.voice = voice;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(this.utt);
    }

    public static getVoices(): string[] {
        let voices: string[] = [];
        for(let voice of speechSynthesis.getVoices()) {
            voices.push(voice.name);
        }
        return voices;
    }

    public static speak(text: string, useSecondLanguage?: boolean): void {
        let voiceName;
        if(useSecondLanguage) {
            const secondLanguage: string | null = localStorage.getItem("secondLanguage");
            if(secondLanguage == null) return;
            voiceName = localStorage.getItem(secondLanguage);
        } else {
            const firstLanguage: string | null = localStorage.getItem("firstLanguage");
            if(firstLanguage == null) return;
            voiceName = localStorage.getItem(firstLanguage);
        }
        for(let voice of speechSynthesis.getVoices()) {
            if(voice.name == voiceName){
                this.play(text, voice);
            }
        }
    }

    private static getVolume(): number {
        const volume = localStorage.getItem("volume");
        if(volume == null){
            localStorage.setItem("volume", "0.5");
            return 0.5;
        }
        return Number(volume);
    }

    public static toggleMute(): void {
        this.isMuted = !this.isMuted;
        localStorage.setItem("isMuted", String(this.isMuted));
    }

    public static checkMute(): void {
        const val = localStorage.getItem("isMuted");

        if(val == "true"){
            this.isMuted = true;
        }
    }
}