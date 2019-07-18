$(function(){
    TEMPLATES = new TemplateManager('#html_templates');

    audio = new DunnoAudio();

    audio.evSoundLoaded.sub(update_sound_load_progress);

    blurb_index = 0;
    update_sound_load_progress();
    cycle_blurbs();

});

function cycle_blurbs() {
    if(window.game) {
        return;
    }
    var blurbs = [
        "I didn't know what to call the game.",
        "This game isn't in flash.  HTML5 magic!",
        "The logo above is the only image in the game.  I can't draw for beans.",
        "Inspired by jmtb02.",
        "The last sounds take a while to load, it's the music!"

    ];

    $('#loading_blurb').text(blurbs[blurb_index]);

    blurb_index = (blurb_index + 1) % blurbs.length;

    _.delay(cycle_blurbs, 4000);
}

function update_sound_load_progress() {
    var count = audio.sounds.length;
    var loaded = _.filter(audio.sounds, function(snd) {
        return snd.loaded();
    }).length;
    $('#loading_message').text('Loading sound (' + loaded + '/' + count + ')');

    if(count === loaded) {
        $('#play_button').show();
        $('#play_button').click(startup);
    }
}

function startup() {
    $('.loading').hide();

    audio.start_bgm('eventually');

    settings = new Settings();
    settings.load();


    game = Dunno.start_game();
    //game = new Dunno();
    scene = new Scene();
    scene.game(game);
    game.scene = scene;
    //scene.game = game;
    game.sidebar = scene.sidebar;

    var body = $('body');
    body.on('mousewheel', function(event) {
        console.log("Eating mousewheel.");
        //event.stopPropagation();
        event.preventDefault();
        //return false;
    });
    // console.log(body, scene.$el);
    scene.prependTo(body);
    //body.prepend(scene.$el);

    help = Help();
    if(settings.show_tutorial_on_start()) {
        settings.show_tutorial_on_start(false);
        help.open();
    }

};

