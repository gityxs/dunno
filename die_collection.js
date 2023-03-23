
DieCollection = Renderer.$extend('DieCollection', {
    template_html: function() {
        return '<div id="collection" class="collection"></div>';
    },
    __init__: function(chained_obs) {
        this.$super(chained_obs);
        this.game = this.rendered;

        this.dieshop = new DieShop(this.game);
        this.dieshop.appendTo(this.$el);

        this.rendered_dice = {};

    },
    render: function(game, eargs) {
        if(!eargs || eargs === game.dice) {
            this.render_dice();
        }
    },
    render_dice: function(game, eargs) {
        var self = this;

        var rendered = _.map(this.rendered_dice, function(dc) {
            return dc.die().ICEID;
        });

        var owned = _.map(this.game().dice, function(die) {
            return die.ICEID;
        });

        var to_remove = _.difference(rendered, owned);
        var to_add = _.difference(owned, rendered);

        _.each(to_remove, function(i) {
            var dc = self.rendered_dice[i];
            var die = dc.die();
            die.container = null;
            dc.die(null);
            dc.$el.detach();

            delete self.rendered_dice[i];
        });

        _.each(to_add, function(i) {
            var die = _.find(self.game().dice, function(die) {
                return die.ICEID === i;
            });

            var dc = new DieContainer(self.game());
            dc.die(die);
            die.container = dc;

            dc.appendTo(self.$el);

            self.rendered_dice[i] = dc;
        });
        if(to_add.length) {
            this.dieshop.appendTo(this.$el);
        }

    }
});
