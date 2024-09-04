
export class SpeechUtils {

    static utt: SpeechSynthesisUtterance = new SpeechSynthesisUtterance();

    public static play(text: string, voice: SpeechSynthesisVoice): void {
        const volume = this.getVolume();
        this.utt.text = text;
        this.utt.volume = volume;
        this.utt.voice = voice;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(this.utt);
    }

    public static getVoices(): string[] {
        const voices: string[] = [];
        for(const voice of speechSynthesis.getVoices()) {
            voices.push(voice.name);
        }
        return voices;
    }

    public static speak(text: string, useSecondLanguage?: boolean): void {
        if(this.isMuted()) return;
        let voiceName;
        if(useSecondLanguage) {
            const secondLanguage: string | null = sessionStorage.getItem("secondLanguage");
            if(secondLanguage == null) return;
            voiceName = localStorage.getItem(secondLanguage);
        } else {
            const firstLanguage: string | null = sessionStorage.getItem("firstLanguage");
            if(firstLanguage == null) return;
            voiceName = localStorage.getItem(firstLanguage);
        }
        for(const voice of speechSynthesis.getVoices()) {
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
        const val = localStorage.getItem("isMuted");
        if(val === null || val === "false"){
            localStorage.setItem("isMuted", "true");
        } else{
            localStorage.setItem("isMuted", "false");
        }
    }

    public static isMuted(): boolean {
        const val = localStorage.getItem("isMuted");
        return val === "true";
    }
}