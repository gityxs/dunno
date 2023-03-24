RoundPane = SidebarPane.$extend('RoundPane', {
    template_html: function() {
        return '' +
            '<div id="roll_pane" class="pane">' +
                '<div id="turn" class="turn">' +
                    '<button id="roll_button">' +
                        '<i class="icon-play"></i> Roll!' +
                    '</button> (R)' +
                '</div>' +
                '<div id="game_over" class="game_over">' +
                    '<p>You are out of turns!  Game over!</p>' +
                    '<p>You can start a new game, and keep your levels and perks.</p>' +
                    '<button id="new_game_plus">New Game +</button>' +
                '</div>' +
                '<div id="round_log"></div>' +
            '</div>';
    },
    __init__: function(chained_obs, sidebar) {
        this.name= "round";
        this.icon = 'icon-play';
        this.$super(chained_obs, sidebar);
        this.game = this.rendered;

    },
    setup_el: function() {
        this.$super();
        this.$roll_button.click(_.bind(this.onRollClick, this));
        this.subClick(this.$new_game_plus, this.onNewGamePlus);
    },
    render: function(game, eargs) {
        game = game || this.game();
        if(!eargs || eargs.obs === game.rolls_remaining) {
            if(game.rolls_remaining() === 0) {
                this.$game_over.show();
                this.$turn.hide();
                this.sidebar().set_pane(this);
            } else {
                this.$turn.show();
                this.$game_over.hide();
            }
        }
    },
    onRollClick: function() {
        console.log('Button clicked');
        this.game().roll();
    },
    onNewGamePlus: function() {
        console.log("Triggering new game plus");
        this.$round_log.empty();
        this.game().new_game_plus();
    }

});
