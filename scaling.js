Scaling = Ice.$extend({
    __init__: function() {
        this.$super();
    },
    next_level_at: function() {
        var level = this.level();

        //return 10 * (level * (level));
        return Math.round(7 * Math.pow(level, 3.2));

    },
    next_bonus_at: function() {
        var n = this.bonus_rolls();
        //return Math.floor(5 + 2 * n * Math.sqrt(n) * 0.1)
        //return Math.floor(5 + 6 * Math.floor(bonus / 1));
        //return 5 + Math.floor((n+1) * (n) / 15);
        //var next  = 2 + 3 * Math.floor((n+1)*n*n/2);
        var next = Math.floor(20 * Math.pow(1.3, n));
        //console.log("next bonus at: ", next);
        return next;
        //return 20+ 2 * Math.max(n-3, 1) *Math.max(n-5, 1) * Math.max(n-30)*n)/2), 0);
    },
    next_side_cost: function(die) {
        var sides = die.purchased_sides();
        return 20 * (sides + 1);
    },
    next_plus_cost: function(die) {
        var plus = die.purchased_plus();
        return Math.floor(Math.pow(plus + 1, 1.5)) * 25;
    },
    next_multiplier_cost: function(die) {
        var mult = die.purchased_multiplier();
        return Math.floor(Math.pow(mult+1, 2.7)) * 50;
    },
    next_magic_cost: function(die) {
        return 10 * Math.pow(5, die.purchased_magic() + 1);
    },
    next_die_cost: function() {
        var die_costs = [
            25,
            50,
            100,
            150,
            250,
            500,
            1000,
            1500,
            2500,
            5000,
            10000,
            15000,
            25000,
            50000,
            100000,
            150000,
            250000,
            500000,
            1000000
        ];

        var purchased_die = this.purchased_die();
        var next_die_cost = die_costs[purchased_die];
        if(next_die_cost === undefined) {
            next_die_cost = _.max(die_costs) * Math.pow(1.5, purchased_die - die_costs.length);
        }
        return next_die_cost;
    },
    next_power_cost: function(die) {
        var power = die;
        if(Ice.isa(die, Die)) {
            power = die.purchased_power();
        }
        return 2 * (power) * (power + 1) / 2;
    },
    tier_from_power: function(power) {
        for(var tier = 0; power >= this.power_from_tier(tier+1); tier++) {

        }
        return tier;
    },
    power_from_tier: function(tier) {
        tier += 3;
        return (tier ) * (tier + 1) / 2 - 5;
    },

    next_magic_at: function(die) {
        var power = die;
        if(Ice.isa(die, Die)) {
            power = die.power();
        }
        var current_tier = this.tier_from_power(power);
        return this.power_from_tier(current_tier + 1);
    },
    white_power: function(magic) {
        return magic + 1;
    },

    red_power: function(magic) {
        return (0.02 + 0.005 * this.magic_boost.red) * magic;
    },
    green_power: function(magic) {
        return 0.25 * magic * (1 + 0.2 * this.magic_boost.green);
    },
    blue_power: function(magic) {
        return 0 + (1 + 0.1 * this.magic_boost.blue) * magic;
    },
    yellow_power: function(magic) {
        return (1 + 0.2 * this.magic_boost.yellow) * magic;
    },
    purple_power: function(magic) {

        return (1 + 0.1 * this.magic_boost.purple) * magic;
    },
    pink_power: function(magic) {
        return (0.25 + 0.1 * this.magic_boost.pink) * magic;
    }

});

