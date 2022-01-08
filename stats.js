DunnoStats = Ice.$extend('DunnoStats', {
    __init__: function(blob) {
        this.$super();
        var self = this;

        _.each(this.stats_tracked(), function(label, key) {
            self[key] = IceObservable(self, 0);
        });

        _.each(DunnoStats.chains, function(one_game, this_game) {
            self[this_game].subChanged(function() {
                self[one_game].higher(self[this_game]());
            }, self);
        });

        this.load_blob(blob);
    },
    stats_tracked: function() {
        return DunnoStats.stats;

    },
    load_blob: function(blob) {
        blob = blob || {};
        var self = this;
        _.each(self.stats_tracked(), function(label, key) {
            self[key](blob[key] || 0);
        });
    },
    save_blob: function() {
        var self = this;
        var blob = {};
        _.each(self.stats_tracked(), function(label, key) {
            blob[key] = self[key]();
        });

        return blob;
    },
    new_game: function() {
        var self = this;
        _.each(this.stats_tracked(), function(label, key) {
            if(key.indexOf('_this_game') != -1)
                self[key](0);
        });

    }
});

DunnoStats.stats = {
    'highest_gold_turn': 'Most Gold in One Turn',
    'total_gold_alltime': 'Gold Earned',
    'tricks_performed': 'Tricks Performed',
    'dice_rolled': 'Dice Rolled',
    'largest_die_rolled': 'Largest Die Rolled',
    'most_dice_rolled': 'Most dice rolled',
    'dice_purchased': 'Dice Purchased',
    'highest_magic': 'Highest Magic',
    'highest_multiplier': 'Highest Multiplier',
    'most_tricks_turn': 'Most Tricks in One Turn',
    'turns_alltime': 'Turns Taken',

    'green_power': 'Green Power Gained',
    'blue_bp': 'Blue BPs Earned',
    'free_multiplier': 'Red/Pink Multiplier Gained',
    'red_multiplier': 'Red Multiplier Gained',
    'pink_multiplier': 'Pink Multiplier Gained',
    'yellow_gold': 'Yellow Bonus Gold',
    'purple_xp': 'Purple XP Earned',
    'white_xp': 'White XP Earned',


    'turns_one_game': 'Most Turns Taken (one game)',
    'total_gold_one_game': 'Most Gold Earned (one game)',
    'dice_rolled_one_game': 'Most Dice Rolled (one game)',
    'tricks_performed_one_game': 'Most Tricks Performed (one game)',

    'turns_this_game': 'Turns Taken (this game)',
    'total_gold_this_game': 'Gold Earned (this game)',
    'dice_rolled_this_game': 'Dice Rolled (this game)',
    'tricks_performed_this_game': 'Tricks Performed (this game)',

};

DunnoStats.chains = {
    'turns_this_game': 'turns_one_game',
    'total_gold_this_game': 'total_gold_one_game',
    'dice_rolled_this_game': 'dice_rolled_one_game',
    'tricks_performed_this_game': 'tricks_performed_one_game',
};
