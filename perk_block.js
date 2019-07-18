PerkBlock = Renderer.$extend('PerkBlock', {
    template_html: function() {
        return '<div class="perk_block">' +
                    '<div class="title pbline">' +
                        '<span id="perk_name"></span>' +
                        ' (<span id="perk_type"></span>)' +
                    '</div>' +
                    '<div class="pbline"><p id="description"></p></div>' +
                    '<div class="pbline"><p id="reason"></p></div>' +
                '</div>' ;
    },
    __init__: function() {
        this.$super();
        this.perk = this.rendered;
        this.evClicked = IceEvent(this);
    },
    setup_el: function() {
        this.$super();
        this.$el.click(_.bind(this.onClick, this));
    },
    onClick: function() {
        this.evClicked();
    },
    render: function(perk, eargs) {
        perk = perk || this.perk();

        var self = this;
        this.$perk_name.html(this.perk().name_html());
        this.$perk_type.text(this.perk().perk_type);
        this.$description.text( this.perk().description);
        this.$reason.text(this.perk().reason);
    }
});


PerkFlyer = Flyer.$extend({
    template_html: function() {
        return '' +
        '<div class="perk_flyer flyer">' +
            '<div class="line name">' +
                '<span id="perk_name"></span>!' +
            '</div>' +
            '<div class="line perk_type">' +
                '<span id="perk_type"></span>' +
            '</div>' +
            '<div class="line reason">' +
                '<span id="reason"></span>' +
            '</div>' +
            '<div class="line description">' +
                '<span id="description"></span>' +
            '</div>' +
            '<div class="line description2">' +
                '<span id="description2"></span>' +
            '</div>' +
            '<div class="line button">' +
               '<button id="dismiss">Yay [R]</button>' +
            '</div>' +
        '</div>';
    },
    __init__: function(perk, auto_dismiss) {
        this.$super();

        this.perk = this.rendered;
        this.perk(perk);

        this.auto_dismiss = auto_dismiss;

    },
    render: function() {
        this.$perk_name.html(this.perk().name_html());
        this.$perk_type.text(this.perk().perk_type);
        this.$reason.text(this.perk().reason);
        this.$description.text(this.perk().get_description());
        this.$description2.text(this.perk().get_description2() || '');
        if(this.auto_dismiss !== undefined) {
            this.$dismiss.hide();
        }
    },
    onCenter: function(resume_callback) {
        this.perk().apply_perk(game);

        this.resume_callback = resume_callback;

        if(this.auto_dismiss === undefined) {
            audio.channels.sounds.sounds.levelup.play();
            this.subClick(this.$dismiss, this.dismiss);
        } else {
            _.delay(resume_callback, this.center_delay);
        }
    },
    dismiss: function() {
        this.resume_callback();
    }

});
