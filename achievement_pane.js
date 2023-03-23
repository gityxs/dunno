AchievementPane = SidebarPane.$extend('AchievementPane', {
    template_html: function() {
        return '' +
            '<div id="achievement_pane" class="pane">' +
                '<div>' +
                    '<label><input type="checkbox" id="hide_mastered" /> Hide Earned</label>' +
                '</div>' +
                '<div>Achievements Earned: ' +
                    '<span id="earned_count"></span> / ' +
                    '<span id="achievement_count"></span>' +
                '</div>' +
                '<div id="achievements"></div>' +
            '</div>';
    },
    __init__: function(chained_obs, sidebar) {
        this.name= "achievements";
        this.icon = 'icon-trophy';
        this.$super(chained_obs, sidebar);

        this.rendered_achievements = {};

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
        if(!eargs || eargs === game.achievements) {
            this.render_achivements();
        }
    },
    render_achivements: function() {
        var self=this;
        var game = this.game();

        var already_earned = _.filter(game.achievements, function(ach) {
            return ach.earned;
        });

        this.$earned_count.text(already_earned.length);
        this.$achievement_count.text(_.values(game.achievements).length);


        var available = _.difference(game.achievements, self.hide_mastered ? already_earned : []);
        available = _.map(available, function(achievement) {
            return achievement.name;
        });

        //available = _.difference(available, already_earned);


        var rendered = _.map(this.rendered_achievements, function(block) {
            return block.achievement.name;
        });


        var to_remove = _.difference(rendered, available);
        var to_add = _.difference(available, rendered);
        _.each(to_remove, function(name) {
            var block = self.rendered_achievements[name];
            block.$el.detach();
            delete self.rendered_achievements[name];
        });

        _.each(to_add, function(name) {
            var ach = self.game().achievements[name];
            var block = new AchievementBlock(self.game, ach);

            block.appendTo(self.$achievements);
            self.rendered_achievements[name] = block;
        });
    }

});
