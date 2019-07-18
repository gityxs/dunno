
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
        }, this.flytime, 'linear', callback);
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
        }, this.flytime, 'linear', after);
    },
    hide: function() {
        this.$el.hide();
    },
    play_flyers: function(flyers, flytime, callback) {
        this.flyers = flyers;
        this.flytime = flytime === undefined ? 400 : flytime;
        this.flyer_index = 0;
        this.play_complete_callback = callback;

        this.slide_on(_.bind(this.resume, this));
    },
    resume: function() {
        var self = this;

        if(this.leader) {
            this.leader.$el.detach();
        }
        // Follower is now leading.
        this.leader = this.follower;
        this.follower = null;

        // Put on a new follower if we can.
        if(this.flyer_index < this.flyers.length) {
            this.follower = this.flyers[this.flyer_index++];
            this.follower.banner = this;
        }

        //Animate the leader off the page
        if(this.leader) {
            var target_left = -1 * this.leader.$el.width();
            this.leader.$el.animate({
                left: target_left
            }, this.flytime, 'linear');
        }

        // Animate the follower onto the page
        if(this.follower) {
            this.follower.appendTo(this.$el);
            this.follower.$el.css({
                //top: (this.$el.height() - this.follower.$el.height())/2,
                left: this.$el.width()
            });
            var target_left = (this.$el.width() - this.follower.$el.width()) / 2;
            this.follower.$el.animate({
                left: target_left
            }, this.flytime, 'linear');

            // Move the top.
            _.delay(function() {
                self.follower.$el.css({
                    top: (self.$el.height() - self.follower.$el.height())/2,
                });
            }, 0 );
        }
        if(this.leader || this.follower) {
            _.delay(_.bind(this.onStepComplete, this), this.flytime);
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
