KeyBindings = Ice.$extend('KeyBindings', {
    __init__: function(game) {
        this.game = game;

        var self = this;
        function buyColor(c) {
            function _buyColor() {
                self.buyColor(c);
            }
            return _buyColor;
        }
        function buy(what) {
            function _buy() {
                self.buy(what);
            }
            return _buy;
        }

        var binds = {
            'space': this.roll,
            'r': this.roll,

            'd': this.nextDie,
            'a': this.prevDie,
            's': this.currentDie,

            //'q': buy('side'),
            //'w': buy('plus'),
            'q': buy('power'),
            'w': buy('toMagic'),
            'e': buy('toMaxSides'),
            't': buy('multiplier'),
            //'m': buy('magic'),
            'p': function() { game.purchase_die(); }
            
        };

        var colorkeys = ['none', 'z','x','c','v','b','n'];
        _.each(Die.colors, function(v, i) {
            if(v === 'white') {
                return;
            }
            binds[colorkeys[i]] = buyColor(v);
        });

        _.each(binds, function(fn, key) {
            //console.log("Binding ", key, fn);
            Mousetrap.bind(key, _.bind(fn, self));
        });

    },
    nextDie: function() {
        var selected = this.game.sidebar.upgrade_pane.upgrade_targets();
        selected = selected[selected.length - 1];

        var pos = this.game.dice.indexOf(selected);
        pos = (pos + 1) % this.game.dice.length;
        this.game.sidebar.upgrade_pane.select_die([this.game.dice[pos]]);
    },
    prevDie: function() {
        var selected = this.game.sidebar.upgrade_pane.upgrade_targets();
        selected = selected[0];
        var pos = this.game.dice.indexOf(selected);
        if(pos == -1) pos = 1;
        else if(pos === 0) pos = this.game.dice.length;

        pos = (pos - 1);

        this.game.sidebar.upgrade_pane.select_die([this.game.dice[pos]]);
    },
    currentDie: function() {
        var pane = this.game.sidebar.upgrade_pane;
        pane.select_die(pane.die());
    },
    buy: function(what) {
        var pane = this.game.sidebar.upgrade_pane;
        if(!pane.upgrade_targets().length) {
            return;
        }
        this.game.sidebar.set_pane(pane);

        pane.upgrader['onBuy' + what[0].toUpperCase() + what.slice(1)]();
    },
    buyColor: function(color) {
        var pane = this.game.sidebar.upgrade_pane;
        if(!pane.upgrade_targets().length) {
            return;
        }

        this.game.sidebar.set_pane(pane);
        
        pane.upgrader.color_rows[color].buy_color();
        //console.log("pretending to click for ", color);
        //pane.upgrader.onColorClick(color);
    },
    roll: function() {
        if(this.game.scene.banner.follower) {
            this.game.scene.banner.follower.dismiss();
            return;
        }

        var pane = this.game.sidebar.round_pane;
        var okay_panes = [
            this.game.sidebar.round_pane,
            this.game.sidebar.trick_pane,
            this.game.sidebar.stats_pane,
            this.game.sidebar.achievement_pane
        ];

        if(!_.contains(okay_panes, this.game.sidebar.current_pane)) {
            this.game.sidebar.set_pane(pane);
        }
        pane.$roll_button.click();
    }
});