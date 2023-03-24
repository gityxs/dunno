Reward = Ice.$extend('Reward', {
    __init__: function(opts) {
        this.$super();
    },
    play_reward: function(game, dice) {
        this.apply_winnings(game, dice);
        return this.make_reward_line(game, dice);
    },
    get_earnings: function(dice) {

    },
    apply_winnings: function(game, dice) {
        var e = this.get_earnings(game, dice)
        winnings.apply_earnings(game);
        this.earnings = winnings;

        //this.$super(game, dice);
    },

});

FlatReward = Reward.$extend('FlatReward', {
    __init__: function(opts) {
        this.$super();

        this.gold = opts.gold || 0;
        this.xp = opts.xp || 0;
        this.bp = opts.bp || 0;
    },
    get_earnings: function(dice) {
        var e = Earnings({gold: this.gold, xp: this.xp, bp: this.bp});
        return e;     
    },
    apply_winnings: function(game, dice) {
        var e = this.get_earnings(game, dice);
        e.apply_earnings(game);

    },
    make_reward_description: function(earnings) {

        var earnings = this.earnings || this;

        var handles = {};
        var $line = TemplateManager.clone_from_html(
            '<div class="reward">'+
                '<span id="gold"></span>'+
                ' <span id="xp"></span>'+
                ' <span id="bp"></span>'+
            '</div>', handles);

        if(earnings.gold) {
            handles.$gold.text('$' + earnings.gold);
        } else {
            handles.$gold.hide();
        }

        if(earnings.xp) {
            handles.$xp.text(earnings.xp + "XP");
        } else {
            handles.$xp.hide();
        }

        if(earnings.bp) {
            handles.$bp.text(earnings.bp + "BP");
        } else {
            handles.$bp.hide();
        }

        return $line;


    }
});


SalaryBonus = Reward.$extend('SalaryBonus', {
    __init__: function(factor) {
        this.$super();

        this.factor = factor || 1;
    },
    get_earnings: function(dice) {
        var es = _.map(dice, function(die) {
            return die.get_salary();
        });

        var e = Earnings.sum(es).times(this.factor).floor();
        return e;

    },
    apply_winnings: function(game, dice) {
        var e = this.get_earnings(game, dice);

        e.apply_earnings(game);
    },
    make_reward_description: function() {
        var $line = $('<div class="reward"><span id="factor"></span>x the earnings of the matching die.</div>');
        $line.find('#factor').text(this.factor);

        return $line;
    
    }
});


SalaryReward = FlatReward.$extend('SalaryReward', {
    __init__: function() {
        this.$super({});
    },
    get_earnings: function(dice) {
        var sals = _.map(dice, function(die) {
            return die.get_salary();
        });

        var winnings = Earnings.sum(sals).floor();
        return winnings;
    },

    make_reward_description: function() {
        var $line = $('<div class="reward"><span id="factor"></span>x the earnings of every die.</div>');
        $line.find('#factor').text(this.factor);

        return $line;
    
    }
});