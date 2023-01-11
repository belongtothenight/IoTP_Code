// reference: https://github.com/belongtothenight/IoTP_Code/blob/main/src/w17/script.js
// https://stackoverflow.com/questions/49506716/speechsynthesis-getvoices-returns-empty-array-on-windows

class Reader {
    constructor() {
        this.synth = window.speechSynthesis;
        this.inputTxt = '';
        this.voiceSelect; // ex 'en-US';
        this.pitch = 1;
        this.rate = 1;
        this.voices = [];
    }

    async populateVoiceList() {
        function setSpeech() {
            return new Promise(
                function (resolve, reject) {
                    let synth = window.speechSynthesis;
                    let id;

                    id = setInterval(() => {
                        if (synth.getVoices().length !== 0) {
                            resolve(synth.getVoices());
                            clearInterval(id);
                        }
                    }, 10);
                }
            )
        }

        let s = setSpeech();
        await s.then((voices) => {
            this.voices = voices;
            // console.log(voices);
            // console.log(this.voices);
        });

        this.voices.sort(function (a, b) {
            const aname = a.name.toUpperCase();
            const bname = b.name.toUpperCase();

            if (aname < bname) {
                return -1;
            } else if (aname == bname) {
                return 0;
            } else {
                return +1;
            }
        });
        // console.log(this.voices);
    }

    speak() {
        if (this.synth.speaking) {
            console.error("speechSynthesis.speaking");
            return;
        }

        if (this.inputTxt !== "") {
            const utterThis = new SpeechSynthesisUtterance(this.inputTxt);

            utterThis.onend = function (event) {
                console.log("SpeechSynthesisUtterance.onend");
            };

            utterThis.onerror = function (event) {
                console.error("SpeechSynthesisUtterance.onerror");
            };

            for (let i = 0; i < this.voices.length; i++) {
                if (this.voices[i].lang === this.voiceSelect) {
                    utterThis.voice = this.voices[i];
                    break;
                }
            }
            utterThis.pitch = this.pitch;
            utterThis.rate = this.rate;
            this.synth.speak(utterThis);
        }
    }
}

async function initInfoReader() {
    const reader = new Reader();
    await reader.populateVoiceList();
    var options = [];
    reader.voices.forEach((voice) => {
        var tempObj = {};
        tempObj[voice.lang] = voice.name;
        options.push(tempObj);
    });
    // console.log(options)
    Reader.voices = options;
    return options;
}

function read(text, lang) {
    // console.log(text, lang);
    if (lang === undefined) return;
    const reader = new Reader();
    reader.inputTxt = text;
    reader.voiceSelect = lang;
    reader.speak();
}

export {
    Reader, initInfoReader, read,
}