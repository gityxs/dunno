TrickPane = SidebarPane.$extend('TrickPane', {
    template_html: function() {
        return '' +
            '<div id="trick_pane" class="pane">' +

                '<div>' +
                    '<label><input type="checkbox" id="hide_mastered" /> Hide Mastered</label>' +
                '</div>' +
                '<div>Tricks Learned: ' +
                    '<span id="learned_count" class="learned_count"></span> / ' +
                    '<span id="trick_count"></span>' +
                '</div>' +
                '<div>Tricks Mastered:  ' +
                    '<span id="mastered_count"></span> / ' +
                    '<span id="learned_count" class="learned_count"></span>' +
                '</div>' +
                '<div id="owned_tricks"></div>' +
            '</div>';
    },
    __init__: function(chained_obs, sidebar) {
        this.name= "tricks";
        this.icon = 'icon-bolt';
        this.$super(chained_obs, sidebar);

        this.rendered_tricks = {};

    },
    setup_el: function() {
        this.$super();

        this.$hide_mastered.change(_.bind(this.hide_changed, this));
    },
    hide_changed: function() {
        var self = this
        self.hide_mastered = self.$hide_mastered.is(':checked');

        self.render();
    },
    render: function(game, eargs) {
        game = game || this.game();

        if(!eargs || eargs === game.owned_tricks) {
            var learned = _.keys(game.owned_tricks).length;
            var count = _.keys(TRICKS).length;
            var mastered = _.filter(game.owned_tricks, function(trick) {
                return trick.mastered();
            }).length;
            this.$el.find('.learned_count').text(learned);
            this.$mastered_count.text(mastered);
            this.$trick_count.text(count);

            this.render_owned_tricks();
        }
    },
    render_owned_tricks: function() {
        // console.log("TrickPane.render_owned_tricks");
        var self=this;
        var game = this.game();

        var available = [];
        _.each(game.owned_tricks, function(trick) {
            if(self.hide_mastered && trick.mastered()) return;
            available.push(trick.name);
        });
        
        var rendered = _.map(this.rendered_tricks, function(block) {
            return block.trick().name;
        });

        // console.log("Available: ", available);
        // console.log("Rendered: ", rendered);

        var to_remove = _.difference(rendered, available);
        var to_add = _.difference(available, rendered);
        _.each(to_remove, function(name) {
            // console.log("Removing ", name , " for some reason.");
            var block = self.rendered_tricks[name];
            block.$el.detach();
            delete self.rendered_tricks[name];
        });

        _.each(to_add, function(name) {
            var block = new TrickBlock();
            block.trick(self.game().owned_tricks[name]);

            // console.log("Appending to ", self.$owned_tricks);
            block.appendTo(self.$owned_tricks);
            self.rendered_tricks[name] = block;
        });
    }

});
