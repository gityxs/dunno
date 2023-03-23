PerkPane = SidebarPane.$extend('PerkPane', {
    template_html: function() {
        return '' +
            '<div id="perk_pane" class="pane">This is a pane for perks.' +
                '<div id="perks"></div>' +
            '</div>';
    },
    __init__: function(chained_obs, sidebar) {
        this.name= "perks";
        this.icon = 'icon-level-up';
        this.$super(chained_obs, sidebar);

        this.rendered_perks = [];

    },
    setup_el: function() {
        this.$super();

    },
    render: function(game, eargs) {
        if(!eargs || eargs === game.perks) {
            this.render_perks();
        }
    },
    render_perks: function() {
        var self=this;
        var game = this.game();

        var applied = _.map(game.perks, function(perk) {
            return perk;
        });
        var rendered = _.map(this.rendered_perks, function(block) {
            return block.perk();
        });


        var to_remove = _.difference(rendered, applied);
        var to_add = _.difference(applied, rendered);
        _.each(to_remove, function(perk) {
            var block = _.find(self.rendered_perks, function(block) {
                return block.perk() === perk;
            });

            block.$el.detach();
            self.rendered_perks.splice(self.rendered_perks.indexOf(block), 1);
            //delete self.rendered_perks[name];
        });

        _.each(to_add, function(perk) {
            var block = new PerkBlock();
            block.perk(perk);

            block.appendTo(self.$perks);
            self.rendered_perks.push(block);
        });
    }

});
