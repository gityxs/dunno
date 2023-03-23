ShopPane = SidebarPane.$extend('ShopPane', {
    template_html: function() {
        return '' +
            '<div id="shop_pane" class="pane">' +
                'This is a pane for shopping.' +
                '<div id="available_tricks"></div>' +
            '</div>';
    },
    __init__: function(chained_obs, sidebar) {
        this.name= "shop";
        this.icon = 'icon-shopping-cart';
        this.$super(chained_obs, sidebar);

        this.rendered_tricks = {};

    },
    setup_el: function() {
        this.$super();

    },
    render: function(game, eargs) {
        if(!eargs || eargs === game.available_tricks) {
            this.render_available_tricks();
        }
    },
    render_available_tricks: function() {
        var self=this;
        var game = this.game();

        var available = _.map(game.available_tricks, function(trick) {
            return trick.name;
        });
        var rendered = _.map(this.rendered_tricks, function(block) {
            return block.trick().name;
        });

        var to_remove = _.difference(rendered, available);
        var to_add = _.difference(available, rendered);
        to_add = _.sortBy(to_add, function(name) {
            return self.game().available_tricks[name].cost.gold;
        });

        _.each(to_remove, function(name) {
            var block = self.rendered_tricks[name];
            block.evClicked.unsub(this);
            if(game.owned_tricks[block.trick().name]) {
                block.$el.effect({
                    effect: 'highlight',
                    color: 'green'
                });
            }
            block.$el.toggle('drop');
            //block.$el.detach();
            delete self.rendered_tricks[name];
        });

        _.each(to_add, function(name) {
            var block = new TrickBlock();
            block.trick(self.game().available_tricks[name]);

            self.rendered_tricks[name] = block;

            block.evClicked.sub(self.onTrickClick, self);
        });
        if(to_add.length) {
            var sorted = _.sortBy(self.rendered_tricks, function(block) {
                return block.trick().cost.gold;
            });
            _.each(sorted, function(block, name) {
                block.appendTo(self.$available_tricks);
            });
        }
    },
    onTrickClick: function(block) {
        if(!_.contains(this.rendered_tricks, block)) {
            return;
        }
        var ok = this.game().purchase_trick(block.trick());
        if(ok !== false) {
            //block.$el.effect({effect: 'highlight', color: 'green'});
        } else {
            block.$el.effect({effect: 'highlight', color: 'red'});
        }

    }


});
