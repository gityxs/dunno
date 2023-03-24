

DieContainer = Renderer.$extend('DieContainer', {
    template_html: function() {
        return [
        '<div class="die_container">',
          '<span id="multiplier_line" class="bottom_line multiplier">',
            'x<span id="multiplier"></span>',
          '</span>',
          '<span id="magic_line" class="bottom_line magic">',
            '<span id="stars"></span>',
          '</span>',
        '</div>'
        ].join('\n');
    },
    __init__: function(game) {
        this.$super();
        this.die = this.rendered;
        this.game = game;

        this.diepoly = new DiePoly(this.die);  // Die poly is a the poly renderer for a die.
        this.diepoly.appendTo(this.$el);

    },
    setup_el: function() {
        this.$super();
        this.$el.click(_.bind(this.onClick, this));
    },
    onClick: function(eargs) {
        var sidebar = this.game.scene.sidebar;
        // console.log('eargs is ', eargs);
        var pane = sidebar.upgrade_pane;
        var single = null;
        if(pane.upgrade_targets().length === 1) {
            single = pane.upgrade_targets()[0];
        }
        if(eargs.shiftKey && single) {
            var first = single;
            var second = this.die();

            var from = this.game.dice.indexOf(first);
            var to = this.game.dice.indexOf(second);

            if(from > to) {
                var t = from;
                from = to;
                to = t;
            }

            sidebar.upgrade_pane.select_die(game.dice.slice(from, to+1));

        } else {
            sidebar.upgrade_pane.select_die([this.die()]);
        }
    },
    render: function(die, eargs) {
        var self = this;
        die = die || this.die();

        this.$super();
        if(!eargs || eargs.obs === die.multiplier) {
            this.$multiplier.text(die.multiplier().toFixed(2));
            this.$multiplier_line[die.multiplier() != 1 ? 'show' : 'hide']();
        }
        var mag_obs = _.map(Die.colors, function(color) {
            return die[color];
        });
        if(!eargs || mag_obs.indexOf(eargs.obs) != -1 || eargs.obs === die.magic) {
            this.$el.toggleClass('needs_magic', die.magic() > die.total_color());
            
            this.$stars.empty();
            _.each(Die.colors, function(color) {
                var amt = color === 'white' ?
                        (die.magic() - die.total_color()) :
                        die[color]();

                if(!amt) return;

                if(die.magic() >= 20) {
                    self.$stars.append($('<span class="star_number"> ' +amt + '</span>'));
                    amt = 1; 
                }
                for(var x = 0; x < amt; x++) {
                    var star = $('<i class="icon-star"></i>');
                    star.addClass(color);
                    self.$stars.append(star);
                }
            });
        }
        /*if(!eargs || eargs.obs === die.magic) {
            this.$magic.text(die.magic());
            this.$magic_line[die.magic() ? 'show' : 'hide']();
        }*/
    },
    sleep: function( ){
        this.diepoly.sleep();
    },
    wake: function() {
        this.diepoly.wake();
    }

});

DiePoly = Renderer.$extend('DiePoly', {
    template_html: function() {
        return [
        '<div class="die_poly">',
        '   <div id="roll" class="overlay"></div>',
        '</div>'
        ].join('\n');
    },
    __init__: function(chain_obs) {
        this.$super(chain_obs);
        this.die = this.rendered;
    },
    setup_el: function() {
        var dim = this.dim = new Point(70, 70);
        // console.group('DiePoly.setup_el');
        this.$super();
        //console.log(this.$el[0]);
        this.raph = Raphael(this.$el[0], dim.x, dim.y);
        this.center = dim.center();
        this.radius = dim.x / 2;
        this.poly = this.raph.path();
        this.poly.attr('stroke', 'red');
        this.sides_text = this.raph.text(this.center.x, this.center.y, 'abcdef\nghijkl');
        this.sides_text.attr('stroke', 'red');
        this.sides_text.attr('font-size', 12);
        this.sides_text.hide();

        /*-- This appear super inefficient.
        this.roll_text = this.raph.text(50, 50, '0');
        this.roll_text.attr({
            'stroke': 'red',
            'fill': 'red',
            'font-size': 25,
        })
        this.roll_text.hide();
        */
        // console.groupEnd();
    },
    onAttach: function() {
        // console.group('DiePoly.onAttach');
        var self=this;
        window.setTimeout(function() {
            self.sides_text.attr('y', self.dim.x * 0.25);
            self.sides_text.show();
            //self.roll_text.attr('y', 50);
            //self.roll_text.show();
        });
        //this.sides_text.attr('y', 50);
        // console.groupEnd();
    },
    render: function(die, eargs) {
        //console.log("DiePoly render, ", die, eargs);
        if(!eargs || eargs.obs === die.sides || eargs.obs === die.plus || eargs.obs == die.color || eargs.obs == die.tier) {
            var polysides = this.die().sides(); //Math.round(this.die().sides() / 3);
            //if(polysides < 3) polysides = 3;
            polysides = 3 + (polysides-3) % 18;
            var polypath;
            if(polysides != 3) {
                polypath = poly_path(this.center, this.radius, polysides);
            } else {
                polypath = poly_path(this.center.plus(0, -15), this.radius + 6, polysides);
            }
            var tier = Die.tiers[this.die().tier()] || Die.tiers[12];

            this.poly.attr('stroke', tier.color);
            this.poly.attr('path', polypath);
            this.poly.attr('fill', this.die().color());

            var text_colors = {
                red: 'white',
                blue: 'white',
                white: 'red',
                pink: 'black',
                green: 'white',
                yellow: 'black',
                purple: 'white'
            };

            this.sides_text.attr('stroke', text_colors[this.die().color()]);
            this.poly.attr('stroke-width', 4);
            var sides_text = 'd' + this.die().sides();
            if(this.die().plus()) {
                sides_text += '+' + this.die().plus();
            }
            this.sides_text.attr('text', sides_text);

        }
        if(!eargs || eargs.obs === die.display_value) {
            //console.log("Setting roll text");
            //this.roll_text.attr('text', this.die().display_value());
            //$('#rollnum').text(this.die().display_value());
            var val = eargs ? eargs.val : this.die().display_value();
            //console.log("Setting display,", this.$roll, val, eargs);
            this.$roll.text(val);
        }
    }
});
