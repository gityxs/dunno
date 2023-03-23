var GET={};window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(str,key,value){GET[key] = value;});

log10 = Math.log(10);
log100 = Math.log(100);
log1000 = Math.log(1000);
NUMBER_SUFFIXES = ["K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "Nn",
                   "Dc", "UDc", "DDc", "TDc", "QaDc", "QtDc", "SxDc", "SpDc", "ODc", "NDc",
                   "Vi", "UVi", "DVi", "TVi", "QaVi", "QtVi", "SxVi", "SpVi", "OcVi", "NnVi",
                   "Tg", "UTg", "DTg", "TTg", "QaTg", "QtTg", "SxTg", "SpTg", "OcTg", "NnTg",
                   "Qd", "UQd", "DQd", "TQd", "QaQd", "QtQd", "SxQd", "SpQd", "OcQd", "NnQd",
                   "Qq", "UQq", "DQq", "TQq", "QaQq", "QtQq", "SxQq", "SpQq", "OcQq", "NnQq",
                   "Sg"
];
function format_number(num) {
    if(num === 0) {
        return 0;
    }
    if(!num.toFixed) {
        console.log("Something's wrong with numbers:", num);
    }
    if(num < 10 && num % 1) {
        return num.toFixed(2);
    }
    if(num < 1000) {
        return Math.floor(num);
    }
    var digits = Math.floor(Math.log(num) / log10 + 0.1);
    var suffix = NUMBER_SUFFIXES[Math.floor(digits / 3)-1];
    var smaller = (num / Math.pow(10, Math.floor(digits/3)*3));
    var fmted;
    if(smaller >= 100) fmted = smaller.toFixed(0);
    else if(smaller >= 10) fmted = smaller.toFixed(1);
    else fmted = smaller.toFixed(2);
    return fmted + "<span class='suffix'>"+suffix+"</span>";
}


Dunno = Scaling.$extend('Dunno', {
    __init__: function(blob) {
        var self = this;

        this.$super();

        this.keybindings = KeyBindings(this);

        this.dice = [];
        this.gold = IceObservable(this, 0);
        this.xp = IceObservable(this, 0);
        this.bp = IceObservable(this, 0);

        this.new_dice_blob = IceObservable(this, basic_dice_blob);

        this.rolls_remaining = IceObservable(this, 20);
        this.total_rolls = IceObservable(this, 20);
        this.bonus_rolls = IceObservable(this, 0);

        this.purchased_die = IceObservable(this, 0);

        this.level = IceObservable(this, null);

        this.perks = {};
        this.pending_perks = [];

        //this.owned_tricks.push(OnePair);

        this.owned_tricks = {};
        //this.available_tricks = {};

        this.achievements = {};

        this.magic_boost = {};

        this.stats = new DunnoStats();

        this.bp.subChanged(this.onBpChanged, this);
        this.xp.subChanged(this.onXpChanged, this);
        this.level.subSet(this.onLevelChanged, this);

        this.won = IceObservable(this, false);
        this.analytics = Analytics();

        this.load_game(blob);
        console.log("Checking for kongregate");
        if(GET.kongregate) {
            console.log("Trying to load kongregate api");
            self.load_kongregate_api();
        }
    },
    addGold: function(amt) {
        this.gold.inc(amt);
        this.stats.total_gold_alltime.inc(amt);
        this.stats.total_gold_this_game.inc(amt);
    },
    addXp: function(amt) {
        this.xp.inc(amt);
    },
    addBp: function(amt) {
        this.bp.inc(amt);
    },
    purchase_trick: function(trick, forfree) {
        if(!(this.available_tricks[trick.name] || forfree)) {
            return false;
        }
        if(this.owned_tricks[trick.name]) {
            debug_game = this;
            return false;
        }

        if(!forfree) {
            var cost = trick.cost;
            if(cost.gold) {
                if(this.gold() < cost.gold) {
                    return false;
                }
                this.gold(this.gold() - cost.gold);
            }
        }

        delete this.available_tricks[trick.name];
        this.owned_tricks[trick.name] = trick;

        this.evChanged(this.owned_tricks);
        this.evChanged(this.available_tricks);

    },

    purchase_die: function(forfree) {
        if(!forfree) {
            if(this.gold() < this.next_die_cost()) {
                return false;
            }
            this.gold.dec(this.next_die_cost());
            this.purchased_die.inc(1);
            this.stats.dice_purchased.inc(1);

        }


        var d = new Die(this, this.new_dice_blob());
        this.dice.push(d);
        this.evChanged(this.dice);

    },
    onBpChanged: function() {
        var dfd_bp, dfd_bonus, dfd_total, dfd_rolls;

        while(this.bp() >= this.next_bonus_at()) {
            dfd_bp = this.bp(this.bp() - this.next_bonus_at(), 'defer');
            dfd_bonus = this.bonus_rolls(this.bonus_rolls() + 1, 'defer');
            dfd_total = this.total_rolls(this.total_rolls() + 1, 'defer');
            dfd_rolls = this.rolls_remaining(this.rolls_remaining() + 1, 'defer');
        }

        if(dfd_bp) {
            dfd_bp();
            dfd_bonus();
            dfd_total();
            dfd_rolls();
        }
    },
    onXpChanged: function() {
        if(this.xp() < this.next_level_at()) {
            return;
        }

        this.xp(this.xp() - this.next_level_at());
        this.level(this.level() + 1);
    },


    randomize_all: function(prop) {
        _.each(this.dice, function(die) {
            var sides = die.sides();
            var rnd = Rand.int(1, sides);
            if(prop == 'display_value' && false) {
                die.container.diepoly.$roll.text(rnd);
            }        else {
                die[prop](rnd);
            }
        });
    },

    roll: function() {
        if(this.rolling) {
            return;
        }
        if(this.rolls_remaining() <= 0) {
            return;
        }
        this.rolls_remaining(this.rolls_remaining() -1);
        this.rolling = new RoundProcessor(this);
        this.sidebar.round_pane.$round_log.empty();

        this.rolling.set_phase('tumble');
        this.rolling.resume();
    },
    post_roll: function() {
        // Good job!
        var self = this;
        this.rolling = false;
        _.each(this.dice, function(die) {
            self.gold(self.gold() + die.value() * 1);
        });


    },
    onLevelChanged: function() {
        var self = this;
        var lvl = self.level();
        var levelups = _.filter(LEVELUPS, function(levelup) {
            if(lvl < levelup.level) return false;

            return true;
        });
        _.each(levelups, function(levelup) {
            self.learn_perk(levelup.perk);
        });
    },
    learn_trick: function(trick) {
        this.owned_tricks[trick.name] = trick;
        trick.game = this;
        this.evChanged(this.owned_tricks);
    },
    learn_perk: function(perk) {
        // self.perks = {id: perk} perks owned.
        if(_.contains(this.perks, perk)) {
            return false;
        }
        this.perks[perk.id] = perk;
        this.evChanged(this.perks);
        this.pending_perks.push(perk);

    },
    save_game: function() {
        // We're going to construct a big blob
        // and slap data into it, which our init should be able to reparse.

        /*
        Things we need saved:
            each die
            each unlocked trick (by name)
            each applied perk (by name?)
            gold, xp, bp, level
            rolls remaining, earned, total

        */
        var blob = {};
        blob.dice = [];
        _.each(this.dice, function(die){
            var b = die.to_blob();
            blob.dice.push(b);
        });

        blob.owned_tricks = _.map(this.owned_tricks, function(trick) {
            return trick.save_blob();
        });

        var self = this;
        _.each(['gold', 'xp', 'bp', 'level', 'rolls_remaining',
                'bonus_rolls', 'total_rolls', 'purchased_die',
                'new_dice_blob', 'won'], function(key) {
            blob[key] = self[key]();
        });

        blob.stats = this.stats.save_blob();
        blob.magic_boost = _.omit(this.magic_boost);

        var json = JSON.stringify(blob);
        localStorage['Dunno.current_game'] = json;
        return blob;
    },
    load_game: function(blob) {

        var self = this;
        self.perks = {};

        _.each(['gold', 'xp', 'bp', 'level', 'rolls_remaining',
                'bonus_rolls', 'total_rolls', 'purchased_die',
                'new_dice_blob', 'won'], function(key) {
            self[key](blob[key]);
        });

        self.new_dice_blob(_.omit(self.new_dice_blob()));
        this.owned_tricks = {};
        _.each(blob.owned_tricks, function(saved) {
            if(!saved || !saved.name) { return; }
            var trick = TRICKS[saved.name];
            self.learn_trick(trick);
            //restore performances, which will trigger
            //level and perks.  However, pending will
            // be cleared post-load.
            // (New Game Plus will refill it with just the replays)
            trick.performances(saved.performances);

        });
        this.evChanged(this.owned_tricks);

        // Level was filled earlier, triggering perks.
        // Because we are loading a game, we don't want to reapply
        // them.

        this.dice = [];
        _.each(blob.dice, function(dieblob) {
            var die = new Die(self, dieblob);

            self.dice.push(die);
        });

        this.stats.load_blob(blob.stats);

        this.achievements = ACHIEVEMENTS;
        //Reapply all achievements.
        _.each(this.achievements, function(ach) {
            ach.test(self);
        });

        this.magic_boost = _.omit(blob.magic_boost || Dunno.new_game_blob.magic_boost);


        this.pending_perks = [];
        this.evChanged(this.perks);
        this.evChanged(this.achievements);

        this.evChanged(this.dice);

    },
    new_game_plus: function() {
        var self = this;
        if(self.rolling) {
            return;
        }

        this.stats.new_game();

        var blob = JSON.parse(JSON.stringify(Dunno.new_game_blob));
        blob.xp = this.xp();
        blob.level = this.level();
        blob.stats = this.stats.save_blob();
        blob.owned_tricks = [];
        blob.won = this.won();

        _.each(this.owned_tricks, function(trick) {
            blob.owned_tricks.push(trick.save_blob());
        });

        this.load_game(blob);

        // Replay any perks which need replaying.
        _.each(this.perks, function(perk) {
            if(perk.trick_name && self.owned_tricks[perk.trick_name]) {
                return;
            }
            if(perk.reapply) {
                self.pending_perks.push(perk);
            }
        });

        this.rolling = new RoundProcessor(this, 'apply_perks');
        this.rolling.resume();
    },
    load_kongregate_api: function() {
        var self = this;
        kongregateAPI.loadAPI(onComplete);

        // Callback function
        function onComplete(){
          // Set the global kongregate API object
          self.kongregate = kongregateAPI.getAPI();

          self.submit_statistics();
        }
    },
    submit_statistics: function() {
        var self = this;
        if(!self.kongregate) {
            return;
        }
        var submits = [
            'highest_gold_turn',
            'dice_rolled_one_game',
            'tricks_performed_one_game',
            'total_gold_one_game',
            'turns_one_game',
            'most_tricks_turn',
            'highest_magic',
            'highest_multiplier',
            'most_dice_rolled',
            'largest_die_rolled',
            'green_power',
            'blue_bp',
            'red_multiplier',
            'pink_multiplier',
            'yellow_gold',
        ];
        _.each(submits, function(stat) {
            var val = Math.floor(self.stats[stat]());
            self.kongregate.stats.submit(stat, val);
        });

        self.kongregate.stats.submit('player_level', self.level());
        self.kongregate.stats.submit('tricks_learned', self.tricks_learned());
        self.kongregate.stats.submit('tricks_mastered', self.tricks_mastered());
    },
    tricks_learned: function() {
        var self = this;
        return _.values(self.owned_tricks).length;
    },
    tricks_mastered: function() {
        var self = this;
        var cnt = 0;
        _.each(self.owned_tricks, function(trick) {
            if(trick.mastered()) cnt += 1;
        });
        return cnt;
    }

});

basic_dice_blob = {
    color: 'white',
    plus: 0,
    multiplier: 1,
    value: 3,
    display_value: 3,
    power: 1,
    total_color: 0,
    red: 0, blue: 0, green: 0, yellow: 0, purple: 0, pink: 0,

    purchased_power: 0,
    purchased_plus: 0,
    purchased_multiplier: 0,
    purchased_magic: 0
};

Dunno.new_game_blob = {
    gold: 0,
    xp: 0,
    bp: 0,
    level: 1,
    rolls_remaining: 10,
    bonus_rolls: 0,
    total_rolls: 10,
    purchased_die: 0,
    dice: [
        basic_dice_blob
    ],
    new_dice_blob: basic_dice_blob,
    owned_tricks: [
        {name: 'One Pair', performances: 0},
        {name: 'Salary', performances: 0}
    ],
    achievements: [],
    stats: {},
    magic_boost : _.object(Die.colors, _.map(Die.colors, function() { return 0;})),
    won: false
};

Dunno.start_game = function() {
    var json = localStorage['Dunno.current_game'];
    var blob;
    if(json) {
        blob = JSON.parse(json);
    } else {
        blob = Dunno.new_game_blob;
    }
    return new Dunno(blob);

};

