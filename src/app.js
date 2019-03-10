'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const requestPromise = require('request-promise');
const BASE_API_END_POINT = 'http://sandipbgt.com/theastrologer/api/horoscope/';

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        return this.toIntent('WelocmeIntent');
    },

    WelocmeIntent() {
        this.ask('Hello, I can tell your horoscope. You can know your yesterday, today and tomorrow horoscope. For example for Gemini you can simply say Gemini yesterday, Gemini today or Gemini tomorrow.'
        + 'Can you please tell your sign');
    },

    CreditsIntent() {
        this.tell("The credit for this skill goes to Kelli Fox, The Astrologer. Her, website is http://new.theastrologer.com. The content used under Creative Common license");
    },

    async YesterDayHoroscopeIntent() {
        const horoscope = await getHoroscope(BASE_API_END_POINT + this.$inputs.sign.value + '/yesterday');
        this.tell(horoscope);
    },

    async TodayHoroscopeIntent() {
        const horoscope = await getHoroscope(BASE_API_END_POINT + this.$inputs.sign.value + '/today');
        this.tell(horoscope);
    },

    async TomorrowHoroscopeIntent() {
        const horoscope = await getHoroscope(BASE_API_END_POINT + this.$inputs.sign.value + '/tomorrow');
        this.tell(horoscope);
    }
});

async function getHoroscope(url) {
    const options = {
        uri: url,
        json: true
    }
    
    let data;
    try {
        data = await requestPromise(options);
        return data.horoscope;
    } catch(err) {
        return 'Sorry, there is no such sign.';
    }
    
}

module.exports.app = app;
