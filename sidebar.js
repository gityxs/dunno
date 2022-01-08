
Sidebar = Renderer.$extend('Sidebar', {
    __init__: function(chained_obs) {
        var self = this;
        this.template_manager = TEMPLATES;
        this.template_name = 'sidebar';
        this.$super(chained_obs);

        this.game = this.rendered;

        this.round_pane = RoundPane(this.game, this);
        this.trick_pane = TrickPane(this.game, this);
        //this.shop_pane = ShopPane(this.game, this);
        this.perk_pane = PerkPane(this.game, this);
        this.upgrade_pane = UpgradePane(this.game, this);
        this.options_pane = OptionsPane(this.game, this);
        this.stats_pane = StatsPane(this.game, this);
        this.achievement_pane = AchievementPane(this.game, this);

        this.panes = [
            this.round_pane,
            this.trick_pane,
            //this.shop_pane,
            this.perk_pane,
            this.stats_pane,
            this.achievement_pane,
            this.upgrade_pane,
            this.options_pane
        ];

        this.panes_by_name = _.indexBy(this.panes, 'name');

        this.tabs = [];

        this.current_pane = this.panes[1];

        //var tab_width = Math.floor(100 / this.panes.length)-1 + '%';

        _.each(this.panes, function(pane) {
            if(pane.show_tab) {
                self.tabs.push(pane.$tab);
                self.$tabs_holder.append(pane.$tab);
            }
            //pane.$tab.css({width: tab_width});

            pane.appendTo(self.$inner_panes_holder);
            //self.$inner_panes_holder.append(pane.$el);
        });

        this.rendered_tricks = {};

        settings.evChanged.sub(this.onSettingsChanged, this);
        this.onSettingsChanged();


    },
    setup_el: function() {
        this.$super();

        this.$xpbar.progressbar({
            value:12
        });
        this.$bpbar.progressbar({
        });

        this.$help.click(_.bind(this.onHelpClicked, this));
        this.$sounds.click(_.bind(this.onSoundsClicked, this));
        this.$music.click(_.bind(this.onMusicClicked, this));

    },
    onSettingsChanged: function() {
        this.$sounds.toggleClass('muted', settings.mute_sounds());
        this.$music.toggleClass('muted', settings.mute_music());
    },
    onSoundsClicked: function() {
        console.log("Muting sound.");
        settings.mute_sounds(!settings.mute_sounds());
    },
    onMusicClicked: function() {
        settings.mute_music(!settings.mute_music());
    },
    onHelpClicked: function() {
        help.open();
    },
    pane_size: function() {
        return Point(this.$el.width() - this.$tabs_holder.position().left * 4,
                     this.$el.height() - (
                        this.$tabs_holder.position().top +
                        this.$tabs_holder.height())
                     );
    },
    refresh_layout: function() {
        var self = this;

        var sidebar_size = new Point(this.$el.parent().width()-17, this.$el.parent().height() - 17);

        this.$el.css(sidebar_size.size());

        var pane_size = new Point(sidebar_size.x - 4,
                                  sidebar_size.y - (
                                    this.$tabs_holder.position().top +
                                    this.$tabs_holder.height())
                                 );

        var bars_dim = {
            top: 0,
            width: pane_size.x / 2,
            left: pane_size.x / 2
        };
        this.$xpbar.css(bars_dim);
        this.$bpbar.css(bars_dim);
        //this.$xpbar.css({top: 0, left: pane_size.x / 2 - 11});
        //this.$bpbar.css({top: 0, left: pane_size.x / 2 - 11});

        var pane_size = this.pane_size();

        var tabs_width = pane_size.x;
        this.$tabs_holder.css({
            width: tabs_width
        });

        var tab_width = Math.floor(tabs_width / this.tabs.length) - 2;

        this.$panes_holder.css(pane_size.size());

        for(var i = 0; i < this.panes.length; i++) {
            var pane = this.panes[i];
            pane.$el.css({
                width: pane_size.x,
                height: pane_size.y,
                left: i * pane_size.x
            });
            pane.$tab.css({
                width: tab_width
            });
        }

        this.set_pane(this.current_pane, true);
    },
    set_pane: function(pane, skip_anim) {
        if(!skip_anim && this.game().rolling) {
            return;
        }

        var old_pane = this.current_pane;

        if(!Ice.isa(pane, SidebarPane)) {
            pane = this.panes_by_name[pane];
        }

        if(pane === this.current_pane) {
            return;
        }
        this.current_pane = pane;

        var target_index = this.panes.indexOf(this.current_pane);

        var pane_size = this.pane_size();

        var target_left = -1 * pane_size.x * target_index;
        this.$inner_panes_holder.stop();
        if(!skip_anim) {
            this.$inner_panes_holder.animate({
                left: target_left
            }, 200, 'linear');
        } else {
            this.$inner_panes_holder.css({
                left: target_left
            });
        }
        if(old_pane) {
            old_pane.$tab.removeClass('active');
        }
        if(this.current_pane) {
            this.current_pane.$tab.addClass('active');
        }

    },

    render: function(game, eargs) {
        var pct;
        game = game || this.game();
        //this.$gold.text(this.game().gold());
        if(!eargs || eargs.obs === game.level) {
            this.$level.text(game.level());
        }
        if(!eargs || eargs.obs === game.rolls_remaining) {
            this.$rolls_remaining.text(game.rolls_remaining());
        }
        if(!eargs || eargs.obs === game.total_rolls) {
            this.$total_rolls.text(game.total_rolls());
        }
        if(!eargs || eargs.obs === game.gold) {
            this.$gold.stop();
            animateLargeNumber(this.$gold, 'data-val', this.game().gold(), 2500, 'easeOutQuint');
        }
        if(!eargs || eargs.obs === game.bp) {
            this.$bp.stop();
            animateLargeNumber(this.$bp, 'data-bal', this.game().bp(), 2500, 'easeOutQuint');
        }
        if(!eargs || eargs.obs === game.bp || eargs.obs === game.bonus_rolls) {
            pct = Math.floor(game.bp() * 100 / game.next_bonus_at());
            this.$bpbar.progressbar({value: pct});
            this.$bpbar_label.html(format_number(game.bp()) + ' / ' + format_number(game.next_bonus_at()));
        }
        if(!eargs || eargs.obs === game.xp) {
            pct = Math.floor(game.xp() * 100 / game.next_level_at());
            this.$xpbar.progressbar({value: pct});
            this.$xpbar_label.html(format_number(game.xp()) + ' / ' + format_number(game.next_level_at()));

            this.$xp.stop();
            animateLargeNumber(this.$xp, 'data-val', this.game().xp(), 2500, 'easeOutQuint');
        }
    }

});


SidebarPane = Renderer.$extend('SidebarPane', {
    __init__: function(chained_obs, sidebar) {
        this.$super(chained_obs);

        this.game = this.rendered;
        this.sidebar = IceObservable(this, null);

        this.sidebar(sidebar);
        this.show_tab = true;
    },
    setup_el: function() {
        this.$super();
        this.$tab = TemplateManager.clone_from_html(
            '<div class="tab">' +
                '<i class="tab_icon"></i>' +
            '</div>'
        );
        this.$tab.attr('id', this.name + '_tab');
        this.$tab.find('.tab_icon').addClass(this.icon);

        this.$tab.click(_.bind(this.onClick, this));

    },
    onClick: function() {
        this.sidebar().set_pane(this);
    }
});



PotatoPane = SidebarPane.$extend('PotatoPane', {
    template_html: function() {
        return '' +
            '<div id="trick_pane" class="pane">This is a pane for potatoes.' +
                '<div id="owned_tricks"></div>' +
            '</div>';
    },
    __init__: function(chained_obs) {
        this.name= "potato";
        this.icon = 'icon-hospital';
        this.$super(chained_obs);

    },
    setup_el: function() {
        this.$super();

    }
});

