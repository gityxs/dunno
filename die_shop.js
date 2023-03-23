DieShop = Renderer.$extend('DieShop', {
    template_html: function() {
        return '<div class="die_shop">' +
                    '<div id="cost_label"></div>' +
                    '<div class="button_holder">' +
                        '<button id="buy_button">Purchase New Die [P]</button>' +
                    '</div>' +
                '</div>';
    },
    __init__: function(chained_obs) {
        this.$super(chained_obs);
        this.game = this.rendered;
    },
    render: function(game, eargs) {
        game = game || this.game();

        if(!eargs || eargs.obs === game.purchased_die) {
            this.$cost_label.html('$' + format_number(game.next_die_cost()));
        }
    },
    setup_el: function() {
        this.$super();
        this.$buy_button.click(_.bind(this.onButtonClick, this));
    },
    onButtonClick: function() {
        if(this.game().rolling) return;

        var res = this.game().purchase_die();
        if(res === false) {
            this.$el.effect({
                color: 'red',
                effect: 'highlight'
            });
        }
    }
});
