Perk = Ice.$extend('Perk', {
    __init__: function() {
        this.$super();
        this.reapply = false;
        this.name = 'Unnamed Perk';
        this.perk_type = 'BasePerk';
        this.description = 'Yay!';
        this.description2 = '';
        this.reason = '';
    },
    get_description: function() {
        return this.description;
    },
    get_description2: function() {
        return this.description2;
    },
    name_html: function() {
        return this.name.replace(/\*/g, '<i class="icon-star"></i>');
    },
    apply_perk: function(game) {
    }
});

FreeDie = Perk.$extend('FreeDie', {
    __init__: function() {
        this.$super();
        this.reapply = true;
        this.perk_type = 'Free Die';
        this.description = 'From now on you start with an extra die.';
    },
    apply_perk: function(game) {
        this.$super(game);
        game.purchase_die(true);
    }
});

FreeGold = Perk.$extend('FreeGold', {
    __init__: function(gold) {
        this.$super();
        this.reapply = true;
        this.gold = gold;
        this.perk_type = 'Free Gold';
        this.description = 'From now on you start with an extra $' + this.gold + '.';
    },
    apply_perk: function(game) {
        this.$super(game);
        game.gold.inc(this.gold);
    }
});

FreePower = Perk.$extend('FreePower', {
    __init__: function() {
        this.$super();
        this.reapply = true;
        this.perk_type = 'Free Power';
        this.description = 'From now on your dice start with 1 extra power point.';
    },
    apply_perk: function(game) {
        this.$super(game);

        game.new_dice_blob().power += 1;
        //game.new_dice_blob().purchased_power += 1;
        _.each(game.dice, function(die) {
            die.power.inc(1);
            //die.purchased_power.inc(1);
        });
    }
});

FreeMultiplier = Perk.$extend('FreeMultiplier', {
    __init__: function(mult) {
        this.$super();
        this.reapply = true;
        this.mult = mult || 0.5;
        this.perk_type = 'Free Multiplier';
        this.description = 'From now on your dice start with ' + mult.toFixed(2) + ' extra multiplier.';
    },
    apply_perk: function(game) {
        this.$super(game);
        var mult = this.mult;

        game.new_dice_blob().multiplier += mult;
        _.each(game.dice, function(die) {
            die.multiplier.inc(mult);
        });
    }
});



LearnTrick = Perk.$extend('LearnTrick', {
    __init__: function(trick_name) {
        this.$super();
        this.perk_type = trick_name;
        this.trick_name = trick_name;
        this.reapply = true;
        
        this.description = 'You have learned the ' + trick_name + ' trick.';

    },
    get_description2: function() {
        var trick = TRICKS[this.trick_name];
        return trick.get_description();
    },
    apply_perk: function(game) {
        this.$super(game);

        var trick = TRICKS[this.trick_name];
        game.learn_trick(trick);
        //game.tricks[this.trick_name] = trick;
        //game.evChanged(game.tricks);
    }
});

MagicBoost = Perk.$extend('MagicBoost', {
    __init__: function(color, amt) {
        this.$super();
        this.reapply = true;
        this.color = color;
        this.amt = amt;


        this.perk_type = color[0].toUpperCase() + color.substring(1) + ' Boost';
        this.description = 'Your ' + color + ' magic is slightly boosted.';
    },
    apply_perk: function(game) {
        this.$super(game);

        game.magic_boost[this.color] += this.amt;
    }
});

