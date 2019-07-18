Earnings = Ice.$extend('Earnings', {
    __init__: function(opts) {
        opts = opts || {};
        this.gold = opts.gold || 0;
        this.xp = opts.xp || 0;
        this.bp = opts.bp || 0;

        this.white = opts.white || 0;
        this.yellow = opts.yellow || 0;
        this.blue = opts.blue || 0;
        this.purple = opts.purple || 0;
    },
    total: function() {
        return this.gold + this.xp + this.bp;
    },
    plus_equals: function(rhs) {
        this.gold += rhs.gold;
        this.xp += rhs.xp;
        this.bp += rhs.bp;

        this.white += rhs.white;
        this.yellow += rhs.yellow;
        this.blue += rhs.blue;
        this.purple += rhs.purple;
    },
    plus: function(rhs) {
        return new Earnings({
            gold: this.gold + rhs.gold,
            xp: this.xp + rhs.xp,
            bp: this.bp + rhs.bp,

            white: this.white + rhs.white,
            yellow: this.yellow + rhs.yellow,
            blue: this.blue + rhs.blue,
            purple: this.purple + rhs.purple

        });
    },
    times: function(factor) {
        return new Earnings({
            gold: this.gold * factor,
            xp: this.xp * factor,
            bp: this.bp * factor,

            white: this.white * factor,
            yellow: this.yellow * factor,
            blue: this.blue * factor,
            purple: this.purple * factor,
        });
    },
    floor: function() {
        return new Earnings({
            gold: Math.floor(this.gold),
            xp: Math.floor(this.xp),
            bp: Math.floor(this.bp),

            white: Math.floor(this.white),
            yellow: Math.floor(this.yellow),
            blue: Math.floor(this.blue),
            purple: Math.floor(this.purple)
        });
    },
    make_reward_line: function() {
        handles = {};
        $line = TemplateManager.clone_from_html(
            '<div class="reward">'+
                '<span id="gold"></span>'+
                ' <span id="xp"></span>'+
                ' <span id="bp"></span>'+
            '</div>', handles);

        if(this.gold) {
            handles.$gold.text('$' + this.gold);
        } else {
            handles.$gold.hide();
        }

        if(this.xp) {
            handles.$xp.text(this.xp + "XP");
        } else {
            handles.$xp.hide();
        }

        if(this.bp) {
            handles.$bp.text(this.bp + "BP");
        } else {
            handles.$bp.hide();
        }

        return $line;

    },

    apply_earnings: function(game) {

        if(game.rolling) {
            game.rolling.round_earnings.plus_equals(this);
        }

        if(this.gold) {
            game.addGold(this.gold);
        }
        if(this.xp) {
            game.addXp(this.xp);
        }
        if(this.bp) {
            game.addBp(this.bp);
        }
    },
    simple: function() {
        return {
            gold: this.gold,
            xp: this.xp,
            bp: this.bp
        }
    },
    
    apply_stats: function(game) {
        game.stats.yellow_gold.inc(this.yellow);
        game.stats.white_xp.inc(this.white);
        game.stats.blue_bp.inc(this.blue);
        game.stats.purple_xp.inc(this.purple);

    }
});
Earnings.sum = function(them) {
    var sum = new Earnings();
    _.each(them, function(e) {
        sum.plus_equals(e);
    });
    return sum;
};

