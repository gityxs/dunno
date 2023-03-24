Trick = Ice.$extend('Trick', {
    __init__: function(opts) {
        this.$super();
        var self = this;

        //Tricks come basically in three types.  Maybe four even.

        /*
        Streak: Checks each die.
        Combo: Checks all your dice together for combinations.

        */

        this.is_gambit = !!opts.gambit;

        this.name = opts.name;
        this.description = opts.description;
        this.test = opts.test;
        this.rewards = opts.rewards;
        this.cost = opts.cost;

        this.level = IceObservable(this, 0);
        this.performances = IceObservable(this, 0);

        this.levels = opts.levels || {
            1: {at: 5, perk: FreeGold(5)},
            2: {at: 25, perk: FreeGold(25)},
            3: {at: 100, perk: FreeGold(100)},
        };
        _.each(this.levels, function(tl, level) {
            tl.perk.name = self.name + ' ';
            for(var x=0; x < level; x++)
                tl.perk.name += '*';
            tl.perk.id = self.name + '.' + level;
        });

        //this.owned = IceObservable(this, false);
        this.game = null;

        this.performances.subSet(this.onPerform, this);
        this.level.subSet(this.onLevelSet, this);

        this.evPerformed = IceEvent(this);
    },
    get_matches: function(dice) {
        return this.test.get_matches(this, dice);
    },
    get_description: function() {
        return this.description || this.test.get_description();
    },
    onPerform: function() {
        this.evPerformed();

        var self = this;
        var target_level = 0;
        var performances = self.performances();

        _.each(this.levels, function(levelup, level) {
            if(target_level < level && performances >= levelup.at) {
                target_level = parseInt(level, 10);
            }
        });
        self.level(target_level);
    },
    onLevelSet: function() {
        if(!this.game) return;
        var self = this;
        _.each(this.levels, function(levelup, level) {
            if(self.level() >= level) {
                self.game.learn_perk(levelup.perk);
            }
        });
    },
    save_blob: function() {
        return {
            name: this.name,
            performances: this.performances()
        };
    },
    mastered: function() {
        return !this.levels[this.level() + 1];
    }

});
