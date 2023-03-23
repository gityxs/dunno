TrickBlock = Renderer.$extend('TrickBlock', {
    template_html: function() {
        return '<div class="trick_block">' +
                    '<div class="title tbline">' +
                        '<span id="trick_name"></span>' +
                        '<div class="trick_progress">' +
                          '<span id="performances"></span> / ' +
                          '<span id="next_at"></span>  ' +
                          '<span id="stars"></span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="tbline"><p id="description"></p></div>' +
                    '<div class="tbline" id="reward_description_holder"></div>' +
                '</div>' ;
    },
    __init__: function() {
        this.$super();
        this.trick = this.rendered;
        this.evClicked = IceEvent(this);
    },
    setup_el: function() {
        this.$super();
        this.$el.click(_.bind(this.onClick, this));
    },
    onClick: function() {
        this.evClicked();
    },
    listen: function(trick) {
        this.$super(trick);
        trick.evPerformed.sub(this.performed, this);
    },
    render: function(trick, eargs) {
        trick = trick || this.trick();

        // console.log("TrickBlock.render");
        var self = this;
        // console.log("Trick's phase is ", self.trick().test.phase);
        _.each(['streak', 'combo', 'meta'], function(phase) {
            // console.log("Toggling class ", phase, " with ", phase==self.trick().test.phase);
            self.$el.toggleClass(phase, phase==self.trick().test.phase);
        });

        this.$trick_name.text(this.trick().name);
        this.$description.text( this.trick().get_description());
        this.$reward_description_holder.empty();
        _.each(this.trick().rewards, function(reward) {
            var $line = reward.make_reward_description();
            self.$reward_description_holder.append($line);
        });

        if(!eargs || eargs.obs === trick.level) {
            this.$stars.empty();
            for(var x=0; x < trick.level(); x++) {
                this.$stars.append($('<i class="icon-star"></i>'));
            }
            var next_level = trick.levels[trick.level() + 1];
            if(next_level) {
                this.$next_at.text(next_level.at);
            } else {
                this.$next_at.text('MAX');
            }
        }
        if(!eargs || eargs.obs === trick.performances) {
            this.$performances.text(trick.performances());
        }

    },
    performed: function() {
        if(game.sidebar.trick_pane === game.sidebar.current_pane) {
            this.flash('green');
        }
    }
});