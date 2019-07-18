Help = Ice.$extend('Help', {
    __init__: function() {
        this.$el = TEMPLATES.clone('tutorial', this);
        this.step = 0;

    },
    open: function() {
        this.show_step();
        this.open_dialog();
    },
    show_step: function() {
        var content = this['$step' + this.step].html();
        this.$step_holder.html(content);
    },
    open_dialog: function() {
        this.$el.dialog({
            //modal: true,
            title: 'Welcome to Dunno',
            buttons: {
                Next: _.bind(this.next_step, this),
                Back: _.bind(this.back_step, this)
                //'Skip Tutorial': _.bind(this.skip, this)
            }
        });
    },
    skip: function() {
        this.$el.dialog('close');
    },
    next_step: function() {
        var next = this['$step' + (this.step + 1)];
        if(!next) {
            this.skip();
            return;
        }
        this.step ++;
        this.show_step();
    },
    back_step: function() {
        var next = this['$step' + (this.step -1)];
        if(!next) {
            this.skip();
        }
        this.step --;
        this.show_step();
    },

});