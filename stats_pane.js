StatsPane = SidebarPane.$extend('StatsPane', {
    template_html: function() {
        return '' +
            '<div id="stats_pane" class="pane">' +
                '<div id="stats" class="stats">' +
                    '<table class="stats_table" id="stats_table">' +
                    '</table>' +
                '</div>' +
            '</div>';
    },
    __init__: function(chained_obs, sidebar) {
        this.name= "stats";
        this.icon = 'icon-bar-chart';
        this.$super(chained_obs, sidebar);
        this.game = this.rendered;

        this.stats = null;

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
    setup_el: function() {
        this.$super();

        var self = this;
        this.slots = {};
        _.each(new DunnoStats().stats_tracked(), function(l, key) {
            var $line = $('<tr><td class="label" id="label"></td><td id="'+key+'" class="value"></td></tr>');
            $line.find('#label').text(l + ':');
            self.slots[key] = $line.find('#' + key);
            self.$stats_table.append($line);
        });

    },
    render: function(obj, eargs) {
        if(obj && !Ice.isa(obj, DunnoStats)) {
            return;
        }

        var stats = obj || this.game().stats;
        var self = this;

        _.each(stats.stats_tracked(), function(label, key) {
            if(!eargs || eargs.obs === stats[key]) {
                var val = stats[key]();
                if(val !== Math.floor(val)) {
                    val = val.toFixed(2);
                }
                self.slots[key].text(val);
                self.slots[key].stop(true, true);
                if(self.game().sidebar.current_pane === this) {
                    self.slots[key].effect({
                        'effect': 'highlight',
                        'color': 'green'
                    });
                }
            }
        });


    },

});
