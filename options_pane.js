OptionsPane = SidebarPane.$extend('OptionsPane', {
    template_html: function() {
        return '' +
            '<div id="options_pane" class="pane">Options' +
                '<div class="game_options">' +
                    '<div class="button_line">' +
                        '<button id="new_game_plus">New Game +</button>' +
                        'Start a new game with all your xp and levels.' +
                    '</div>' +
                    '<div class="button_line">' +
                        '<button id="save_game">Save Game</button>' +
                        'Game saves automatically after every roll.  This button is for the paranoid.' +
                    '</div>' +
                    '<div class="button_line">' +
                        '<button id="new_game">START COMPLETELY OVER</button>' +
                    '</div>' +
                '</div>' +
            '</div>';
    },
    __init__: function(chained_obs, sidebar) {
        this.name= "options";
        this.icon = 'icon-cogs';
        this.$super(chained_obs, sidebar);

    },
    setup_el: function() {
        this.$super();

        this.subClick(this.$new_game_plus, this.onNewGamePlus);
        this.subClick(this.$new_game, this.onNewGame);
        this.subClick(this.$save_game, this.onSaveGame);
    },
    render: function(game, eargs) {
    },
    onNewGamePlus: function() {
        this.sidebar().set_pane(this.sidebar().round_pane);
        this.sidebar().round_pane.$round_log.empty();

        this.game().new_game_plus();
    },
    onNewGame: function() {
        if(!window.confirm("Are you sure?  This IS NOT NEW GAME PLUS.  You're going to lose everything.  Press OK to wipe everything, Cancel to stop.")) {
            return;
        }

        this.sidebar().round_pane.$round_log.empty();
        this.sidebar().set_pane(this.sidebar().round_pane);
        _.each(TRICKS, function(trick) {
            trick.performances(0);
        });
        this.game().load_game(Dunno.new_game_blob);
    },
    onSaveGame: function() {
        this.sidebar().set_pane(this.sidebar().round_pane);
        this.game().save_game();
    }
});
