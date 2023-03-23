Settings = Ice.$extend('Settings', {
    __init__: function() {
        this.$super();
        this.mute_sounds = IceObservable(this, false);
        this.mute_music = IceObservable(this, false);
        this.show_tutorial_on_start = IceObservable(this, true);

        this.evChanged.sub(this.save, this);
        this.evChanged.sub(this.sync_audio, this);

        this.sync_audio();
    },
    load: function() {
        var json = localStorage['Dunno.settings'];
        var blob;
        if(json) {
            blob = JSON.parse(json);
        } else {
            blob = _.omit(Settings.default_settings);
        }

        var self = this;
        _.each(Settings.keys, function(k) {
            self[k](blob[k]);
        });
    },
    save: function() {
        var self = this;
        var blob = {};
        _.each(Settings.keys, function(k) {
            blob[k] = self[k]();
        });

        var json = JSON.stringify(blob);
        localStorage['Dunno.settings'] = json;
    },
    sync_audio: function() {
        if(!window.audio) {
            return;
        }
        audio.channels['music'].muted(this.mute_music());
        if(!this.mute_music()) {
            audio.start_bgm();
        } else if(this.mute_music()) {
            audio.stop_bgm();
        }
        audio.channels['sounds'].muted(this.mute_sounds());
    }
});
Settings.keys = ['mute_sounds', 'mute_music', 'show_tutorial_on_start'];
Settings.default_settings = {
    mute_sounds: false,
    mute_music: false,
    show_tutorial_on_start: true
};