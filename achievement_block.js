AchievementBlock = Renderer.$extend('AchievementBlock', {
    template_html: function() {
        return '<div class="achievement_block">' +
                    '<div id="progress_underlay"></div>' +
                    '<div class="title abline">' +
                        '<span id="ach_name"></span>' +
                    '</div>' +
                    '<div class="abline"><p id="description">' +
                        '<span id="stat"></span>: ' +
                        '<span id="current"></span> / ' +
                        '<span id="at"></span>' +
                    '</p></div>' +
                    '<div class="abline"><p id="perk_description">' +

                    '</p></div>' +

                    //'<div class="abline" id="reward_description_holder"></div>' +
                '</div>' ;
    },
    __init__: function(chained_obs, achievement) {
        this.achievement = achievement;
        this.$super(chained_obs);
        this.game = this.rendered;
        this.stats = null;
    },
    setup_el: function() {
        this.$super();
        this.$ach_name.text(this.achievement.name);
        this.$stat.text(DunnoStats.stats[this.achievement.stat]);
        this.$at.html(format_number(this.achievement.at));
        if(this.achievement.earned)
            this.$perk_description.text(this.achievement.perk.get_description());
        else
            this.$perk_description.text('');
    },
    listen: function(game) {
        this.$super(game);

        this.stats = game.stats;
        this.stats.evChanged.sub(this.render, this);

    },
    unlisten: function(game) {
        this.$super(game);
        if(this.stats) {
            this.stats.unsub(this);
            this.stats = null;
        }
    },
    render: function(obj, eargs) {
        if(obj && !Ice.isa(obj, DunnoStats)) {
            return;
        }

        var stats = obj || this.game().stats;
        var self = this;

        if(!eargs || eargs.obs == stats[this.achievement.stat]) {
            var val = stats[this.achievement.stat]();
            var at = this.achievement.at;
            var pct = Math.min(val * 100.0 / at, 100);

            this.$progress_underlay.css({
                width: pct + '%'
            });
            if(val >= at) {
                val = at;
            }
            if(Math.floor(val) !== val) {
                val = val.toFixed(2);
            } else {
                val = format_number(val);
            }
            this.$current.html(val);
        }
    }
});