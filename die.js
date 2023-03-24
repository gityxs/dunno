

Die = Ice.$extend('Die', {
    __init__: function(game, blob) {
        var self = this;
        this.$super();

        this.game = game;

        // This is a straight model, it has no el or anything.
        this.sides = IceObservable(this, 45);
        this.color = IceObservable(this, 'white');
        this.value = IceObservable(this, 3);
        this.display_value = IceObservable(this, this.value());
        this.power = IceObservable(this, 1);
        this.tier = IceObservable(this, 0);

        this.plus = IceObservable(this, 0);
        this.multiplier = IceObservable(this, 1);
        this.magic = IceObservable(this, 0);

        this.purchased_plus = IceObservable(this, 0);
        this.purchased_multiplier = IceObservable(this, 0);
        this.purchased_power = IceObservable(this, 0);

        this.partial_power = IceObservable(this, 0);

        this.value.subSet(this.onValueSet, this);

        this.used_rerolls = 0;
        this.history = [];

        this.sides.subChanged(this.update_stats, this);
        this.plus.subChanged(this.update_stats, this);
        this.multiplier.subChanged(this.update_stats, this);
        this.magic.subChanged(this.update_stats, this);
        _.each(Die.colors, function(color) {
            self[color] = IceObservable(self, 0);
        });
        this.total_color = IceObservable(this, 0);

        this.power.subSet(this.onPowerSet, this);

        if(blob) {
            this.load_blob(blob);
        }

    },
    keys: function() {
        return ['color', 'sides', 'plus', 'multiplier', 'magic',
                'value', 'display_value',
                'purchased_plus',
                'purchased_multiplier',
                'power', 'purchased_power', 'white', 'total_color',
                'red', 'green', 'blue', 'yellow', 'purple', 'pink', 'partial_power'];
    },
    update_stats: function() {
        this.game.stats.highest_multiplier.higher(this.multiplier());
        this.game.stats.highest_magic.higher(this.magic());
    },
    load_blob: function(blob) {
        var self = this;
        _.each(this.keys(), function(key) {
            self[key](blob[key]);
        });
        if(self.partial_power() === undefined) {
            self.partial_power(0);
        }
    },
    to_blob: function() {
        var blob = {};
        var self = this;
        _.each(this.keys(), function(key) {
            blob[key] = self[key]();
        });
        return blob;
    },
    tumble: function() {
        var val = Rand.int(1, this.sides()) + this.plus();
        this.display_value(val);
    },
    roll: function() {
        var val = Rand.int(1, this.sides()) + this.plus();
        this.history.push(val);
        if(this.history.length > 10) {
            this.history.splice(0,1); // Remove the first.
        }
        this.value(val);
        this.used_rerolls = 0;

        this.game.stats.largest_die_rolled.higher(this.sides());

    },
    onPowerSet: function() {
        var power = this.power();
        var cache = Die.get_power_cache(power);

        this.sides(cache.sides);
        this.magic(cache.tier);
        this.tier(cache.tier);
    },
    apply_special_effects: function() {
        var roll = Rand.int(1, 100);
        var magic = this.magic();
        var color = this.color();

        if(this.green()) {
            /*if(this.value() == this.sides() + this.plus()) {
                this.power.inc(game.green_power(this.green()));
            }*/

            /*
            if(this.value() <= this.game.green_power(this.green())) {
                this.power.inc(1);
                this.game.stats.green_power.inc(1);
                this.purchased_power.inc(1);

                if(this.container) {
                    this.container.flash('green');
                }
            }
            */

            var green_power = this.game.green_power(this.green());
            this.partial_power.inc(green_power);
            this.game.stats.green_power.inc(green_power);

            if(this.partial_power() > 1) {
                var gain = Math.floor(this.partial_power());
                this.partial_power.inc(-1 * gain);
                this.power.inc(gain);
                this.purchased_power.inc(gain);
                if(this.container) {
                    this.container.flash('green');
                }
            }


            /*for(var x = 0;x < game.green_power(this.green()); x++) {
                Rand.choose(this.game.dice).power.inc(1);
            }*/
        }
         if(this.pink()) {
            var mul = this.game.pink_power(this.pink());
            this.multiplier.inc(mul);
            this.game.stats.free_multiplier.inc(mul);
            this.game.stats.pink_multiplier.inc(mul);
        }
        if(this.red()) {
            var self = this;
            var bonus = this.game.red_power(this.red());
            _.each(this.game.dice, function(die) {
                if(die === self) {
                    //Not myself.
                    return;
                }
                die.multiplier.inc(bonus);
            });
            this.game.stats.free_multiplier.inc(bonus * (this.game.dice.length - 1));
            this.game.stats.red_multiplier.inc(bonus * (this.game.dice.length - 1));
        }
    },
    onValueSet: function(self, eargs) {
        // console.log("Syncing display value to ", this.value());
        this.display_value(this.value());
    },
    get_salary: function() {
        var e = Earnings({xp: 1, gold: this.value()});
        e.white = 1;
        var mult = this.multiplier();

        if(this.blue()) {
            e.bp = this.value() * this.game.blue_power(this.blue());
            e.blue = e.bp;
        }
        if(this.purple()) {
            var bonusxp = this.value() * this.game.purple_power(this.purple());
            e.xp += bonusxp;
            e.purple = bonusxp;

        }
        if(this.yellow()) {
            var bonusgold = this.value() * this.game.yellow_power(this.yellow());
            e.gold += bonusgold;
            e.yellow = bonusgold;
        }
        //console.log("Going to award ", e, " times ", mult);

        //Shouldn't be flooring here I'm pretty sure.
        e = e.times(mult);
        //console.log("Which is ", e);
        return e;
    },
    purchase_power: function() {
        if(this.game.gold() < this.next_power_cost()) {
            return false;
        }
        this.game.gold.dec(this.next_power_cost());
        this.purchased_power.inc(1);
        this.power.inc(1);
        return true;
    },
    purchase_plus: function() {
        if(this.game.gold() < this.next_plus_cost()) {
            return false;
        }
        this.game.gold(this.game.gold() - this.next_plus_cost());
        this.purchased_plus(this.purchased_plus() + 1);
        this.plus(this.plus() + 1);
        return true;
    },
    purchase_multiplier: function() {
        if(this.game.gold() < this.next_multiplier_cost()) {
            return false;
        }
        this.game.gold(this.game.gold() - this.next_multiplier_cost());
        this.purchased_multiplier(this.purchased_multiplier() + 1);
        this.multiplier(this.multiplier() + 0.5);
        return true;
    },
    spend_magic: function(color) {
        if(this.total_color() >= this.magic()) {
            return false;
        }
        this.total_color.inc(1);
        this[color].inc(1);
        return true;
    },

    next_multiplier_cost: function() {
        return this.game.next_multiplier_cost(this);
    },
    next_power_cost: function() {
        return this.game.next_power_cost(this);
    },
    next_plus_cost: function() {
        return this.game.next_plus_cost(this);
    }
});

Die.colors = ['white', 'red', 'blue', 'green', 'yellow', 'purple', 'pink'];
Die.power_cache = {};
Die.tiers = tiers = {  // -3/6
    0: {name: 'Bronze', color:'#8c7853'}, // bronze 3-8
    1: {name: 'Silver', color:'silver'}, // silver 9-14
    2: {name: 'Gold', color:'gold'}, // gold 15-20
    3: {name: 'Diamond', color:'aqua'}, // diamond 21-26,
    4: {name: 'Mithril', color:'green'}, // mithril 27-32,
    5: {name: 'Adamantium', color:'black'}, //adamantium 33-38,
    6: {name: 'Cobalt', color:'blue'}, //cobalt 39-44,
    7: {name: 'Brimstone', color:'crimson'}, //brimstone, 45-50
    8: {name: 'Crystal', color:'white'}, //brimstone, 45-50
    9: {name: 'Sunstone', color:'orange'}, //brimstone, 45-50
    10: {name: 'Quantium', color:'purple'}, //brimstone, 45-50
    11: {name: 'Macguffinium', color:'crimson'}, //brimstone, 45-50
    12: {name: 'Unobtainium', color:'crimson'} //brimstone, 45-50
};

Die.get_power_cache = function(power) {
    var orig_power = power;
    var cache = Die.power_cache[power];
    if(cache === undefined) {
        // I'm sure there's a cleverer way to do this..
        var tier = 0;
        var sides = 3;
        while(power > 1) {
            if(sides + 1 > 6 + tier) {
                tier += 1;
                sides = 3;
            } else {
                sides += 1;
            }
            power --;
        }
        cache = {sides: sides, tier: tier, magic: tier};
        Die.power_cache[orig_power] = cache;
    }
    return cache;
}