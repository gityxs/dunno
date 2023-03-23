
Scene = Renderer.$extend('Scene', {
    template_html: function() {
        return [
    '<div class="game">',
        '<div id="collection_holder" class="collection_holder">',
        '</div>',
        '<div id="sidebar_holder" class="sidebar_holder">',
        '</div>',
    '</div>'
        ].join('');
    },
    __init__: function() {
        this.$super();

        this.game = this.rendered;

        this.collection = new DieCollection(this.game);
        this.collection.appendTo(this.$collection_holder);
        //this.$collection_holder.append(this.collection.$el);

        this.sidebar = new Sidebar(this.game);
        this.sidebar.appendTo(this.$sidebar_holder);
        //this.sidebar.$el.appendTo(this.$sidebar_holder);

        this.banner = new Banner(this.game, this);
        this.banner.appendTo(this.$el);

    },

    onAttach: function() {
        this.$super();
        console.log("Attached.");
        var self = this;

        this.on_resize = function() {
            //self.$accordion_holder.css('height', self.$el.height() - self.$status_block.height()-15);
            //self.$accordion.accordion('refresh');
            //self.$tab_holder_holder.css('height', self.$el.height() - self.$status_block.height()-15);
            self.refresh_layout();
            //self.$tabs_holder.tabs('refresh');
        };
        this.on_resize();
        $(window).on('resize', this.on_resize);
        //window.setInterval(function() {

        //},0);
    },
    onDetach: function() {
        if(this.on_resize) {
            $(window.off('resize', this.on_resize));
            this.on_resize = null;
        }
    },
    refresh_layout: function() {
        this.sidebar.refresh_layout();
        this.banner.refresh_layout();
    },
    render: function(game, eargs) {

    }

});
/*
Banner = Renderer.$extend({
    template_html: function() {
        return '<div class="banner"></div>';
    },
    __init__: function(chained_obs, scene) {
        this.$super(chained_obs);
        this.game = this.rendered;
        this.scene = scene;
    },
    refresh_layout: function() {
        this.$el.css({width: this.scene.$el.width()});
        var top = (this.scene.$el.height() - this.$el.height()) / 2;
        this.$el.css({top: top});
    },
    slide_on: function(callback) {
        console.log("Moving to the right.");
        this.$el.css({
            left: this.scene.$el.width()
        });
        this.$el.show();

        callback = callback || function(){};

        console.log("Animating.");
        this.$el.animate({
            left: 0
        }, 400, 'linear', callback);
    },
    slide_off: function(callback) {
        var self = this;
        this.$el.css({
            left: 0
        });

        function after() {
            self.hide();
            if(callback) {
                callback();
            }
        }

        this.$el.animate({
            left: -1 * (this.scene.$el.width())
        }, 400, 'linear', after);
    },
    hide: function() {
        this.$el.hide();
    },
    play_flyers: function(flyers, callback) {
        this.flyers = flyers;
        this.flyer_index = 0;
        this.play_complete_callback = callback;

        this.slide_on(_.bind(this.resume, this));
    },
    resume: function() {
        if(this.leader) {
            this.leader.$el.detach();
        }
        // Follower is now leading.
        this.leader = this.follower;
        this.follower = null;

        // Put on a new follower if we can.
        if(this.flyer_index < this.flyers.length) {
            this.follower = this.flyers[this.flyer_index++];
        }

        //Animate the leader off the page
        if(this.leader) {
            var target_left = -1 * this.leader.$el.width();
            this.leader.$el.animate({
                left: target_left
            }, 400, 'linear');
        }

        // Animate the follower onto the page
        if(this.follower) {
            this.$el.append(this.follower.$el);
            this.follower.$el.css({
                top: (this.$el.height() - this.follower.$el.height())/2,
                left: this.$el.width()
            });
            var target_left = (this.$el.width() - this.follower.$el.width()) / 2;
            this.follower.$el.animate({
                left: target_left
            }, 400, 'linear');
        }

        if(this.leader || this.follower) {
            _.delay(_.bind(this.onStepComplete, this), 400);
        } else {
            var cb = this.play_complete_callback;
            this.play_complete_callback = null;

            this.slide_off(cb);
        }
    },
    onStepComplete: function() {
        if(this.follower) {
            this.follower.onCenter(_.bind(this.resume, this));
        } else {
            this.resume();
        }
    }
});

Flyer = Renderer.$extend({
    __init__: function(chained_obs){
        this.$super(chained_obs);

    },
    onCenter: function(resume_callback) {
        resume_callback();
    }

});
*/