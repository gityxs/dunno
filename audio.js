
IceAudio = Ice.$extend('IceAudio', {
    __init__: function() {
        var self = this;
        this.$super();

        //createjs.Sound.registerPlugins([createjs.HTMLAudioPLugin, createjs.WebAudioPlugin]);

        this.manifest = this.manifest || [];
        createjs.Sound.registerManifest(this.manifest);

        this.sounds = [];
        this.channels = {};

        this.evSoundLoaded = IceEvent(this);

        _.each(this.manifest, function(snd) {
            var sound = new AudioSound(snd);
            self.sounds.push(sound);
            self[sound.sound_id] = sound;
            if(!self.channels[sound.channel]) {
                self.channels[sound.channel] = new AudioChannel(sound.channel);
            }
            sound.channel = self.channels[sound.channel];
            sound.channel.register_sound(sound);
        });

        createjs.Sound.addEventListener("fileload", _.bind(this.handleFileLoad, this));

    },
    handleFileLoad: function(event) {
        // A sound has been preloaded.
        console.log("Preloaded:", event.id, event.src);
        this[event.id].loaded(true);

        this.evSoundLoaded();
    }

});

AudioChannel = Ice.$extend('AudioChannel', {
    __init__: function(channel_name) {
        this.$super();
        this.name = channel_name;

        this.volume = IceObservable(this, 1);
        this.muted = IceObservable(this, false);

        this.sounds = {};
        this.playing = [];

        this.volume.subChanged(this.onVolumeChange, this);
        this.muted.subChanged(this.onVolumeChange, this);

        this.onVolumeChange();
    },
    register_sound: function(sound) {
        this.sounds[sound.sound_id] = sound;
    },
    actual_volume: function() {
        return this.muted() ? 0 : this.volume();
    },
    onVolumeChange: function() {
        var self = this;
        this.cleanup();

        _.each(this.playing, function(asi) {
            var vol = self.actual_volume() * asi.sound.actual_volume();
            asi.volume(vol);
        });
    },
    cleanup: function() {
        this.playing = _.filter(this.playing, function(si) {
            if(si.playState === createjs.Sound.PLAY_FINISHED || si.playState === createjs.Sound.PLAY_FAILED)
                return false;
            return true;
        });
        _.each(this.sounds, function(sound) {
            sound.cleanup();
        });
    },
    stop: function() {
        _.each(this.playing, function(asi) {
            asi.stop();
        });
    }
});

AudioSound = Ice.$extend('AudioSound', {
    __init__: function(snd) {
        this.$super();

        this.sound_id = snd.id;
        this.channel = snd.channel || 'sounds';
        this.volume = IceObservable(this, snd.volume === undefined ? 1 : snd.volume);
        this.muted = IceObservable(this, snd.muted === undefined ? false : snd.muted);

        this.loaded = IceObservable(this, false);

        this.muted.subChanged(this.syncVolume, this);
        this.volume.subChanged(this.syncVolume, this);

        this.loaded.subChanged(this.onLoadedChanged, this);

        this.playing = [];

    },
    syncVolume: function() {
        var volume = this.channel.actual_volume() * this.actual_volume();

        _.each(this.playing, function(asi) {
            asi.volume(volume);
        });
    },
    actual_volume: function() {
        return this.muted() ? 0 : this.volume();
    },
    play: function(flags) {
        flags = flags || [];
        var eventually = flags.indexOf('eventually') !== -1;
        var loop = flags.indexOf('loop') !== -1;

        if(this.muted() || this.channel.muted()) {
            return;
        }
        if(!this.loaded()) {
            if(eventually) {
                this.play_on_load = flags;
            }
            return;
        }


        var asi = new AudioInstance(this, this.channel, flags);
        return asi;
    },
    stop: function() {
        var self = this;
        _.each(this.playing, function(asi) {
            asi.stop();
        });
    },
    onLoadedChanged: function() {
        if(this.play_on_load) {
            this.play();
        }
    },
    cleanup: function() {
        this.playing = _.filter(this.playing, function(si) {
            if(si.playState === createjs.Sound.PLAY_FINISHED || si.playState === createjs.Sound.PLAY_FAILED)
                return false;
            return true;
        });
    }
});

AudioInstance = Ice.$extend('AudioInstance', {
    __init__: function(sound, channel, flags) {
        this.loop = flags.indexOf('loop') != -1;
        this.$super();

        this.evSoundEnded = IceEvent(this);

        this.sound = sound;
        this.channel = channel;
        this.volume = IceObservable(this, sound.actual_volume() * channel.actual_volume());


        //play ( src  [interrupt="none"]  [delay=0]  [offset=0]  [loop=0]  [volume=1]  [pan=0]
        this.si = createjs.Sound.play(sound.sound_id, 'none',
               0, //delay
               0, //offset
               this.loop ? 1 : 0, //loop
               this.volume());
        this.volume.subChanged(this.onVolumeChange, this);

        channel.cleanup();
        sound.cleanup();

        channel.playing.push(this);
        sound.playing.push(this);

        this.si.addEventListener("complete", _.bind(this._onComplete, this));
    },
    subscribe_complete: function(callback) {
        this.si.addEventListener("complete", callback);
    },
    _onComplete: function() {
        this.evSoundEnded(this);
    },
    onVolumeChange: function() {
        this.si.setVolume(this.volume());
    },
    stop: function() {
        this.si.stop();
    }
});

DunnoAudio = IceAudio.$extend('DunnoAudio', {
    __init__: function() {
        var self = this;
        this.manifest = [
            {
                id: 'dundundun',
                src: 'sounds/dundundun3.wav',
                channel: 'sounds'
            },
            {
                id: 'levelup',
                src: 'sounds/levelup3.wav',
                channel: 'sounds'
            },
            {
                id: 'bgm_1',
                //src: 'sounds/546380_Karmachine.mp3',
                src: 'sounds/548364_Mechanism-of-Balance.mp3',
                volume: 0.5,
                channel: 'music'
            },
            {
                id: 'bgm_2',
                src: 'sounds/546380_Karmachine.mp3',
                //src: 'sounds/548364_Mechanism-of-Balance.mp3',
                volume: 0.5,
                channel: 'music'
            }
        ];

        /* Grab the trick sounds. */
        this.trick_sounds = [];
        for(var x=1;x<=3;x++) {
            var snd = {
                id: 'trick' + x,
                src: 'sounds/trick' + x + '.wav',
                channel: 'sounds'
            };
            this.manifest.push(snd);
            this.trick_sounds.push(snd);
        }

        this.$super();

        this.trick_sounds = _.map(this.trick_sounds, function(snd) {
            return self[snd.id];
        });

        this.trick_shuffle = [];
        while(this.trick_shuffle.length < 100) {
            this.trick_shuffle.push(Rand.choose(this.trick_sounds));
        }

        this.bgm = IceObservable(this, null);

        this.channels.music.volume(0.05);
        this.channels.sounds.volume(5);


    },
    play_trick: function(index) {
        var sound = this.trick_shuffle[index % this.trick_shuffle.length];
        //console.log("Playing ", sound.sound_id, " for trick ", index);
        sound.play();
    },
    start_bgm: function() {
        var self = this;
        if(self.bgm()) {
            self.bgm().stop();
        }
        var bgms = _.filter(this.channels['music'].sounds, function(sound) {
            return sound !== self.bgm();
        });
        if(!bgms.length) {
            bgms = _.values(this.channels['music'].sounds);
        }
        self.bgm(Rand.choose(bgms));
        console.log("Randomly shuffled ", self.bgm());
        self.bgm_instance = self.bgm().play(['eventually']);
        self.bgm_instance.subscribe_complete(_.bind(self.start_bgm, self));
    },
    stop_bgm: function() {
        if(!this.bgm()) return;

        this.bgm().stop();
        self.bgm_instance = null;
    },
});
