
GameOverFlyer = Flyer.$extend({
    template_html: function() {
        return '' +
        '<div class="go_flyer flyer">' +
            '<div class="line gameover">' +
                '<span>Game Over!</span>!' +
            '</div>' +
            '<div class="line message">' +
                '<em>You ran out of turns!</em>  But you can start again, <strong>keeping all your perks and achievements</strong>.' +
            '</div>' +
            '<div class="line progress">' +
                '<div>Your highest gold-earning turn was:</div>' +
                '<div id="mostgoldbar" class="mostgoldbar">' +
                    '<div id="mostgoldbar_label" class="bar_label"></div>' +
                '</div>' +
                '<div id="progress_tease"></div>' +
            '</div>' +
            '<div class="line achievement">' +
                '<div>You were pretty close to getting:</div>' +
                '<div id="ach_holder"></div>' +
            '</div>' +
            '<div class="line buttons">' +
               '<button id="new_game_plus">New Game +</button>' +
               '<button id="dismiss">Not yet</button>' +
            '</div>' +
        '</div>';
    },
    __init__: function(game) {


        var unearned = _.filter(game.achievements, function(ach) {
            return !ach.earned;
        });
        this.ach = _.max(unearned, function(ach) {
            return ach.pct;
        });

        this.$super();

        this.game = this.rendered;
        this.game(game);


        this.auto_dismiss = false;



    },
    setup_el: function() {
        this.$super();
        this.$mostgoldbar.progressbar({});

        this.ach_block = AchievementBlock(this.rendered, this.ach);
        this.ach_block.appendTo(this.$ach_holder);

        this.subClick(this.$new_game_plus, this.onClickNewGamePlus);
        this.subClick(this.$dismiss, this.dismiss);

    },
    render: function() {
        var hgt = this.game().stats.highest_gold_turn();
        this.$mostgoldbar_label.text(hgt + ' / 1000000');

        this.$mostgoldbar.progressbar({
            value: hgt / 1000000 * 100
        });
        var pt;
        if(hgt >= 0) pt = "Don't worry, it gets easier quick.";
        if(hgt >= 100) pt = "More dice is usually better than more power, early on.";
        if(hgt >= 500) pt = "The first point in green is most important!";
        if(hgt >= 1000) pt = "Pink is better than red if you're not putting it on lots of dice.";
        if(hgt >= 5000) pt = "You're getting the hang of this.  Might want to try some purple dice to get higher levels for later runs!";
        if(hgt >= 10000) pt = "It's most efficient to upgrade dice if they have some green magic and you wait until they're close to the next star!";
        if(hgt >= 50000) pt = "Yellow magic scales VERY well, especially stacking with red.";
        if(hgt >= 100000) pt = "Focus on unlocking all of the tricks (by buying a lot of dice).  The end is closer than you think!";

        this.$progress_tease.text(pt);

    },
    onCenter: function(resume_callback) {

        //this.$super(resume_callback);

        this.resume_callback = resume_callback;

        if(!this.auto_dismiss) {

        } else {
            console.log("Autodismissing because autodismiss is ", this.auto_dismiss);
          _.delay(resume_callback, this.center_delay);
        }
    },
    dismiss: function() {
        this.resume_callback();
    },
    onClickNewGamePlus: function() {
        if(this.lock) return;
        this.lock = true;
        var self = this;

        this.dismiss();
        this.banner.play_complete_callback = function() {
            self.game().sidebar.options_pane.onNewGamePlus();
        };
        //this.game().new_game_plus();
    }


});



YouWinFlyer = Flyer.$extend({
    template_html: function() {
        return '' +
        '<div class="go_flyer flyer">' +
            '<div class="line youwin">' +
                '<i class="icon-star"></i>' +
                '<i class="icon-star"></i>' +
                '<i class="icon-star"></i>' +
                '<span>YOU WIN!!</span>!' +
                '<i class="icon-star"></i>' +
                '<i class="icon-star"></i>' +
                '<i class="icon-star"></i>' +
            '</div>' +
            '<div class="line message">' +
                '(This screen can be printed as a diagnosis for OCD.)' +
            '</div>' +
            '<div class="line message2">' +
                'Thank you for playing my game.  I hope you had fun, or ' +
                'at least had a pleasant waste of time. ' +
                '<strong>Please leave me a comment!</strong> ' +
                'Your comments will help me to make my next games even better.' +
            '</div>' +
            '<div class="line achievement">' +
                '<div>Of course, you COULD keep going.  You were pretty close to getting:</div>' +
                '<div id="ach_holder"></div>' +
            '</div>' +
            '<div class="line buttons">' +
               '<button id="new_game_plus">New Game +</button>' +
               '<button id="dismiss">Fin</button>' +
            '</div>' +
        '</div>';
    },
    __init__: function(game) {


        var unearned = _.filter(game.achievements, function(ach) {
            return !ach.earned;
        });
        this.ach = _.max(unearned, function(ach) {
            return ach.pct;
        });

        this.$super();

        this.game = this.rendered;
        this.game(game);


        this.auto_dismiss = false;



    },
    onAttach: function() {
        this.$super();
        _.delay(_.bind(this.cycle_colors, this), 500);
    },
    cycle_colors: function() {
        if(!this.on_dom()) {
            return;
        }
        _.each(this.$el.find('.icon-star'), function($star) {
            $star = $($star);
            $star.attr('class', 'icon-star');
            $star.addClass(Rand.choose(Die.colors));
        });
        _.delay(_.bind(this.cycle_colors, this), 500);

    },
    setup_el: function() {
        this.$super();

        this.ach_block = AchievementBlock(this.rendered, this.ach);
        this.ach_block.appendTo(this.$ach_holder);

        this.subClick(this.$new_game_plus, this.onClickNewGamePlus);
        this.subClick(this.$dismiss, this.dismiss);

    },
    render: function() {
        if(this.game().rolls_remaining()) {
            this.$new_game_plus.hide();
        }

    },
    onCenter: function(resume_callback) {

        //this.$super(resume_callback);

        this.resume_callback = resume_callback;

        if(!this.auto_dismiss) {

        } else {
            console.log("Autodismissing because autodismiss is ", this.auto_dismiss);
          _.delay(resume_callback, this.center_delay);
        }
    },
    dismiss: function() {
        this.resume_callback();
    },
    onClickNewGamePlus: function() {
        if(this.lock) return;
        this.lock = true;
        var self = this;

        this.dismiss();
        this.banner.play_complete_callback = function() {
            self.game().sidebar.options_pane.onNewGamePlus();
        };
        //this.game().new_game_plus();
    }


});
