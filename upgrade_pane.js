UpgradePane = SidebarPane.$extend('UpgradePane', {
    template_html: function() {
        return '' +
            '<div id="upgrade_pane" class="pane">' +
            '</div>';
    },
    __init__: function(chained_obs, sidebar) {
        this.name= "upgrade";
        this.icon = 'icon-wrench';
        this.$super(chained_obs, sidebar);

        this.show_tab = false;

        this.upgrade_targets = IceObservable(this, []);
        this.upgrader = DieUpgrader(this.upgrade_targets, this);

    },
    select_die: function(targets) {
        var self = this;
        _.each(self.upgrade_targets(), function(t) {
            if(t.container) {
                t.container.$el.removeClass('active');
            }
        });

        this.upgrade_targets(targets);

        if(self.upgrade_targets().length) {
            _.each(self.upgrade_targets(), function(t) {
                t.container.$el.addClass('active');
            });
            this.upgrader.appendTo(this.$el);
            //this.$el.append(this.upgrader.$el);
            this.sidebar().set_pane(this);
        } else {
            this.upgrader.detach();
        }
    },
    setup_el: function() {
        this.$super();

    },
    render: function(game, eargs) {

    }

});

DieUpgrader = Renderer.$extend('DieUpgrader', {
    template_html: function() {
        return '' +
        '<div id="upgrade_options">' +
            '<table borders="0">' +
                '<tr id="power_line">' +
                    '<td class="shortcut">Q</td>' +
                    '<td class="label">Power</td>' +
                    '<td class="value" id="power"></td>' +
                    '<td><button id="buy_power"></button></td>' +
                '</tr>' +
                '<tr id="multi_power_line">' +
                    '<td class="shortcut">W</td>' +
                    '<td class="label">Next <i class="icon-star"></i></td>' +
                    '<td class="value" id="next_star"></td>' +
                    '<td><button id="buy_to_magic"></button></td>' +
                '</tr>' + 
                '<tr id="max_sides_line">' +
                    '<td class="shortcut">E</td>' +
                    '<td class="label">Sides</i></td>' +
                    '<td><span class="value" id="sides"></span> / <span class="value" id="max_sides"></span></td>' +
                    '<td><button id="buy_to_max_sides"></button></td>' +
                '</tr>' +
/*                '<tr id="plus_line">' +
                    '<td class="shortcut">W</td>' +
                    '<td class="label">Plus</td>' +
                    '<td class="value" id="plus"></td>' +
                    '<td><button id="buy_plus"></button></td>' +
                '</tr>' +*/
                '<tr id="multiplier_line">' +
                    '<td class="shortcut">T</td>' +
                    '<td class="label">Multiplier</td>' +
                    '<td class="value" id="multiplier"></td>' +
                    '<td><button id="buy_multiplier"></button></td>' +
                '</tr>' +
                /*'<tr id="magic_line">' +
                    '<td class="shortcut">M</td>' +
                    '<td class="label">Magic</td>' +
                    '<td class="value" id="magic"></td>' +
                '</tr>' +*/
            '</table>' +

            '<div id="magic">'+
              '<p>' +
                'Magic:  ' +
                '<i class="icon-star"></i>  ' +
                '<span id="available_magic"></span> / <span id="total_magic"></span>' +
                '  <em> -- Gain <i class="icon-star"></i> by increasing Power.</em>' +
              '</p>' +
            '</div>' +
            '<div class="shortcut_help">' +
                '<p><span class="shortcut">A</span> Prev die</p> ' +
                '<p><span class="shortcut">D</span> Next die</p> ' +
                '<p><span class="shortcut">Shift-click</span> to select a range of dice.</p>'+
        
            '</div>' +
        '</div>';
    },
    __init__: function(chained_obs, pane) {
        //this.color_tabs = {};
        //this.color_descs = {};
        this.color_rows = {};

        this.$super(chained_obs);
        this.upgrade_targets = this.rendered;
        this.pane = pane;


    },
    setup_el: function() {
        this.$super();
        //this.subClick(this.$buy_plus, this.onBuyPlus);
        this.subClick(this.$buy_power, this.onBuyPower);
        this.subClick(this.$buy_multiplier, this.onBuyMultiplier);
        this.subClick(this.$buy_to_magic, this.onBuyToMagic);
        this.subClick(this.$buy_to_max_sides, this.onBuyToMaxSides);

        var self = this;
        /*var hotkey = 0;
        _.each(Die.colors, function(color) {
            var $tab = $('<div class="color_tab"></div>');
            $tab.text(hotkey);
            hotkey ++;
            //$tab.text(color);

            $tab.addClass(color);
            self.color_tabs[color] = $tab;
            self.color_descs[color] = self.$el.find('div#'+color+'_desc');

            self.$color_tabs.append($tab);

            self.subClick($tab, _.partial(_.bind(self.onColorClick, self), color));

        });*/

        _.each(Die.colors, function(color) {
            if(color === 'white') {
                return;
            }
            var color_row = ColorRow(self.rendered, color);
            self.color_rows[color] = color_row;
            color_row.appendTo(self.$magic);
        });

    },
    onAttach: function() {
        _.each(this.color_rows, function(cr) {
            cr.on_dom(true);
            cr.onAttach();
        });
    },
    onDetach: function() {
        _.each(this.color_rows, function(cr) {
            cr.on_dom(false);
            cr.onDetach();
        });
    },
    single: function() {
        var self = this;
        if(self.upgrade_targets().length === 1) {
            return self.upgrade_targets()[0];
        }
        return null;
    },
    render: function(die, eargs) {
        var self = this;

        if(self.single()) {

            die = die || this.single();
            this.$sides.text(die.sides());
        
        

            var mult_display = die.multiplier().toFixed(2);
            this.$multiplier.text('x' + mult_display);
            this.$buy_multiplier.html("+0.5 for $" + format_number(die.next_multiplier_cost()));
            
            var power_display = die.power();
            if(die.partial_power()) {
                power_display = (die.power() + die.partial_power()).toFixed(2);
            }
            this.$power.text(power_display);
            this.$buy_power.html('+1 for $' + format_number(die.next_power_cost()));

            var total_cost = 0;
            var next_star = die.game.next_magic_at(die);
            var needed_points = next_star - die.power();
            for(var x=0; x < needed_points; x++) {
                total_cost += die.game.next_power_cost(die.purchased_power() + x);
            }
            this.$next_star.text(next_star);
            this.$buy_to_magic.html('+' + needed_points + ' for $' + format_number(total_cost) );

            var cache = Die.get_power_cache(next_star-1);
            this.$max_sides.text(cache.sides);

            var max_sides_cost = 0;
            for(var x=0; x < needed_points - 1; x++) {
                max_sides_cost += die.game.next_power_cost(die.purchased_power() + x);
            }
            this.$buy_to_max_sides.html('+' + (needed_points - 1) + ' for $' + format_number(max_sides_cost));
            

            this.$total_magic.text(die.magic());
            this.$available_magic.text(die.magic() - die.total_color());

        } else if(self.upgrade_targets().length) {
            
            var side_range = get_range(self.upgrade_targets(), function(d) {
                return d.sides();
            });

            this.$sides.text(side_range[0] + '-' + side_range[1]);

            var mult_range = get_range(self.upgrade_targets(), function(d) {
                return d.multiplier();
            });
            this.$multiplier.text(mult_range[0].toFixed(2) + 'x-' + mult_range[1].toFixed(2) + 'x');

            var mult_cost = 0;
            _.each(self.upgrade_targets(), function(d) {
                mult_cost += d.next_multiplier_cost();
            });
            this.$buy_multiplier.html('+0.5 for $' + format_number(mult_cost));

            var power_range = get_range(self.upgrade_targets(), function(d) {
                return d.power();
            });
            self.$power.text(power_range[0] + '-' + power_range[1]);

            var power_cost = 0;
            _.each(self.upgrade_targets(), function(d) {
                power_cost += d.next_power_cost();
            });
            self.$buy_power.html('+1 for $' + format_number(power_cost));

            var total_cost = 0;
            var total_next = 0;
            _.each(self.upgrade_targets(), function(die) {
                var next_star = die.game.next_magic_at(die);
                var needed_points = next_star - die.power();
                total_next += needed_points;
                for(var x=0; x < needed_points; x++) {
                    total_cost += die.game.next_power_cost(die.purchased_power() + x);
                }
            });
            this.$next_star.text('Multiple Selected');
            this.$buy_to_magic.html('+' + total_next + ' for $' + format_number(total_cost) );


            var total_max_needed = 0;
            var total_max_cost = 0;
            _.each(self.upgrade_targets(), function(die) {
                var next_star = die.game.next_magic_at(die);
                var needed_points = next_star - die.power() - 1;
                total_max_needed += needed_points;
                for(var x=0; x < needed_points; x++) {
                    total_max_cost += die.game.next_power_cost(die.purchased_power() + x);
                }
            });
            this.$max_sides.text('Multiple Selected');
            this.$buy_to_max_sides.html('+' + total_max_needed + ' for $' + format_number(total_max_cost));


            var magic_range = get_range(self.upgrade_targets(), function(d) {
                return d.magic();
            });

            this.$total_magic.text(magic_range[0] + '-' + magic_range[1]);

            var avail_range = get_range(self.upgrade_targets(), function(d) {
                return d.magic() - d.total_color();
            });
            this.$available_magic.text(avail_range[0] + '-' + avail_range[1]);

        }
        _.each(self.color_rows, function(cr) {
            cr.render();
        });
        /*
        if(!eargs || eargs.obs == die.magic) {
            this.$magic.text(die.magic());
            this.$buy_magic.text("+1 for $" + die.next_magic_cost());

            _.each(Die.colors, function(color) {
                var val = die.game[color+'_power'](die.magic());
                if(Math.floor(val) !== val) {
                    val = val.toFixed(2);
                }
                var $power = self['$' + color + '_power'];
                if($power) {
                    $power.text(val);
                }
            });

            var hide = die.magic() === 0;
            //console.log("Going to hide: ", hide);
            if(hide) {
                this.$color_description.hide();
                this.$color_tabs.hide();
            } else {
                this.$color_description.show();
                this.$color_tabs.show();
            }
        }
        if(!eargs || eargs.obs == die.color) {
            _.each(Die.colors, function(color) {
                var $tab = self.color_tabs[color];
                var $desc = self.color_descs[color];
                $tab.toggleClass('active', color === die.color());
                $desc[color === die.color() ? 'show' : 'hide']();
            });
        }*/

    },
    flash: function(ok, $which, die) {
        var $sel = $which;

        this.$super(ok ? 'green' : 'red', $sel);
    },
    onBuySide: function() {
        var self = this;
        var ok = false;
        _.each(self.upgrade_targets(), function(die) {

            if(!die) return;

            if(die.game.rolling) return;

            if(die.purchase_side()) {
                ok = true;
                self.flash(ok, die.container.$el);
            };
        });

        this.flash(ok, this.$sides_line);
        self.render();
    },
    onBuyPlus: function() {
        var self = this;
        var ok = false;
        _.each(self.upgrade_targets(), function(die) {

            if(!die) return;

            if(die.game.rolling) return;

            if(die.purchase_plus()) {
                ok = true;
                self.flash(ok, die.container.$el);
            };
        });

        this.flash(ok, this.$plus_line);
        self.render();
    },
    onBuyPower: function() {
        var self = this;
        var ok = false;
        _.each(self.upgrade_targets(), function(die) {

            if(!die) return;

            if(die.game.rolling) return;
            if(die.purchase_power()) {
                ok = true;
                self.flash(ok, die.container.$el);
            };

        });

        this.flash(ok, this.$power_line);
        self.render();
    },
    onBuyToMagic: function() {
        var self = this;
        var ok = false;
        _.each(self.upgrade_targets(), function(die) {
            if(die.game.rolling) return;
            var total_cost = 0;
            var next_star = die.game.next_magic_at(die);
            var needed_points = next_star - die.power();
            for(var x=0; x < needed_points; x++) {
                total_cost += die.game.next_power_cost(die.purchased_power() + x);
            }

            if(total_cost > die.game.gold()) {
                //this.flash(false, this.$multi_power_line);
                return;
            }
            self.flash(true, die.container.$el);

            ok = true;
            for(x=0;x < needed_points;x++) {
                die.purchase_power();
            }
    
        });
        this.flash(ok, this.$multi_power_line);
        self.render();
    },
    onBuyToMaxSides: function() {
        var self = this;
        var ok = false;
        _.each(self.upgrade_targets(), function(die) {
            if(die.game.rolling) return;
            var total_cost = 0;
            var next_star = die.game.next_magic_at(die);
            var needed_points = next_star - die.power() - 1;
            for(var x=0; x < needed_points; x++) {
                total_cost += die.game.next_power_cost(die.purchased_power() + x);
            }

            if(total_cost > die.game.gold()) {
                //this.flash(false, this.$multi_power_line);
                return;
            }
            self.flash(true, die.container.$el);

            ok = true;
            for(x=0;x < needed_points;x++) {
                die.purchase_power();
            }
    
        });
        this.flash(ok, this.$max_sides_line);
        self.render();
    },
    onBuyMultiplier: function() {
        var self = this;
        var ok = false;
        _.each(self.upgrade_targets(), function(die) {

            if(!die) return;

            if(die.game.rolling) return;

            if(die.purchase_multiplier()) {
                ok = true;
                self.flash(ok, die.container.$el);
            };
        });

        this.flash(ok, this.$multiplier_line);
        self.render();
    },
    onBuyMagic: function() {
        var self = this;
        var ok = false;
        _.each(self.upgrade_targets(), function(die) {

            if(!die) return;

            if(die.game.rolling) return;

            if(die.purchase_magic()) {
                ok = true;
                self.flash(ok, die.container.$el);
            };
        });

        this.flash(ok, this.$magic_line);
        self.render();
    }

});

function fmt_range(dice, pluck, fmt) {
    if(!fmt) {
        fmt = function(x) { return x; };
    }

    var low = undefined, high = undefined;
    _.each(dice, function(d) {
        var val = pluck(d);
        if(low===undefined || val < low) low = val;
        if(high === undefined || val > high) high = val;
    });
    return fmt(low) + '-' + fmt(high);
    
}
get_range = function(dice, pluck) {
    var low = undefined, high = undefined;
    _.each(dice, function(d) {
        var val = pluck(d);
        if(low===undefined || val < low) low = val;
        if(high === undefined || val > high) high = val;
    });
    return [low, high];
}


ColorRow = Renderer.$extend('ColorRow', {
    __init__: function(die_obs, color) {
        this.color = color;
        this.$super(die_obs);
        this.upgrade_targets = this.rendered;
    },
    template_html: function() {
        return '' +
            '<div class="color_row">' +
                '<p class="header">' +
                    /*'<span id="color_name"></span> : <span id="stars"></span>  ' +
                    '<button id="buy_color">Buy for <i class="icon-star"></i></button>' +*/
                    '<span id="shortcut" class="shortcut"></span>  ' +
                    '<span id="stars"></span> <i class="icon-star-empty" id="buy_color"></i>'+
                '</p>' +
                '<p class="description" id="description"></p>' +
            '</div>';
    },
    setup_el: function() {
        this.$super();
        this.subClick(this.$el, this.buy_color);

        this.$el.addClass(this.color);
        var colorkeys = ['none', 'z','x','c','v','b','n'];
        this.$shortcut.text(colorkeys[Die.colors.indexOf(this.color)].toUpperCase());
    },
    render: function(die, eargs) {
        var self = this;
        // die = die || this.die();
        //this.$color_name.text(this.color);
        var color_range = get_range(self.upgrade_targets(), function(die) {
            return die[self.color]();
        });

        this.$stars.empty();

        for(var x = 0; x < color_range[0]; x++) {
            this.$stars.append($('<i class="icon-star"></i>'));
        }
        for(var x = 0; x< color_range[1] - color_range[0]; x++) {
            this.$stars.append($('<i class="icon-star-half-empty"></i>'));
        }
        if(self.upgrade_targets().length === 1) {
            this.$description.html(this.getDescription(this.color, color_range[0], self.upgrade_targets()[0].game));
        } else {
            this.$description.text('Multiple selected');
        }
   

    },
    buy_color: function() {
        var ok = false;
        var self = this;
        _.each(self.upgrade_targets(), function(die) {
            if(!die) return;

            if(die.game.rolling) return;

            if(die.spend_magic(self.color)) {
                ok = true;
                self.flash('green', die.container.$el);
            }
        });
        self.flash((ok ? 'green' : 'red'), self.$el);
        self.render();
    },

    getDescription: function(color, mag) {
        if(color === 'red') {
            if(!mag) {
                return 'Increases the multiplier of all other dice each turn.';
            } else {
                return '' +
                    'Increases the multiplier of all other dice by ' +
                    '<span class="magic_highlight">' +
                    game.red_power(mag).toFixed(3) +
                    '</span> each turn.';
            }
        }
        if(color === 'yellow') {
            if(!mag) {
                return 'Earns extra gold.';
            } else {
                return '' +
                    'Earns ' +
                    '<span class="magic_highlight">' +
                    Math.floor(game.yellow_power(mag) * 100) +
                    '</span>% extra gold.';
            }
        }
        if(color === 'blue') {
            if(!mag) {
                return 'Earns bonus points (for extra turns).';
            } else {
                return '' +
                    'Earns ' +
                    '<span class="magic_highlight">' +
                    Math.floor(game.blue_power(mag) * 100) +
                    '</span>% of face value as bonus points (for extra turns).';
            }
        }
        if(color === 'green') {
            if(!mag) {
                return 'Gains power every turn.';
            } else {
                return '' +
                    'Gains <span class="magic_highlight">' +
                    game.green_power(mag).toFixed(2) +
                    '</span> power/turn.  (Partial power points carry over.)';
            }
        }
        if(color === 'purple') {
            if(!mag) {
                return 'Earns experience points.';
            } else {
                return '' +
                    'Earns ' +
                    '<span class="magic_highlight">' +
                    Math.floor(game.purple_power(mag) * 100) +
                    '</span>% of face value as experience points.';
            }
        }
        if(color === 'pink') {
            if(!mag) {
                return 'Increases the multiplier of this die each turn.';
            } else {
                return '' +
                    'Increases the multiplier of this die by ' +
                    '<span class="magic_highlight">' +
                    game.pink_power(mag).toFixed(2) +
                    '</span> each turn.';
            }
        }
    }
});