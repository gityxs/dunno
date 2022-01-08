ACHIEVEMENTS = {};

Achievement = Ice.$extend('Achievement', {
    __init__: function(opts) {
        this.$super();
        this.name = opts.name;
        this.stat = opts.stat;
        this.at = opts.at;
        this.perk = opts.perk;

        this.earned = false;
        this.pct = 0;

        this.perk.name = this.name;
        this.perk.id = 'Achievement_' + this.stat + '_' + this.at;
        this.perk.reason = DunnoStats.stats[this.stat] + ': ' + this.at;
        ACHIEVEMENTS[this.name] = this;
    },
    test: function(game) {
        if(!game.stats[this.stat]) {
            console.log('Nonexistent stat check: ', this.stat);
        }
        this.earned = (game.stats[this.stat]() >= this.at);
        this.pct = (game.stats[this.stat]() * 1.0 / this.at);
        if(this.pct >= 1) {
            this.pct = 1;
            this.earned = true;
            game.evChanged(game.achievements);
            game.learn_perk(this.perk);
        } else {
            this.earned = false;
        }
    }
});

Achievement({
    name: 'First Step',
    stat: 'dice_rolled',
    at: 1,
    perk: FreeDie()
});

Achievement({
    name: 'Walking',
    stat: 'dice_rolled',
    at: 100,
    perk: FreePower()
});

Achievement({
    name: 'Jogging',
    stat: 'dice_rolled',
    at: 500,
    perk: FreeGold(100)
});

Achievement({
    name: 'Running',
    stat: 'dice_rolled',
    at: 2500,
    perk: FreePower()
});

Achievement({
    name: 'Sprint',
    stat: 'dice_rolled',
    at: 25000,
    perk: FreePower()
});

Achievement({
    name: 'Roll All the Dice!',
    stat: 'dice_rolled',
    at: 250000,
    perk: FreePower()
});

Achievement({
    name: 'Roll ALL The Dice?',
    stat: 'dice_rolled',
    at: 2500000,
    perk: FreePower()
});



Achievement({
    name: 'Pennies',
    stat: 'total_gold_one_game',
    at: 10000,
    perk: FreeGold(100)
});

Achievement({
    name: 'Dimes',
    stat: 'total_gold_one_game',
    at: 100000,
    perk: FreeGold(1000)
});

Achievement({
    name: 'Quarters',
    stat: 'total_gold_one_game',
    at: 250000,
    perk: FreePower()
});

Achievement({
    name: 'Dollars',
    stat: 'total_gold_one_game',
    at: 1000000,
    perk: FreeDie()
});

Achievement({
    name: 'Apprentice',
    stat: 'highest_magic',
    at: 2,
    perk: FreePower()
});

Achievement({
    name: 'Wizard',
    stat: 'highest_magic',
    at: 4,
    perk: FreePower()
});


Achievement({
    name: 'Mage',
    stat: 'highest_magic',
    at: 6,
    perk: FreePower()
});


Achievement({
    name: 'Archmage',
    stat: 'highest_magic',
    at: 8,
    perk: FreePower()
});

Achievement({
    name: 'Minor Diety',
    stat: 'highest_magic',
    at: 10,
    perk: FreePower()
});

Achievement({
    name: 'Magical',
    stat: 'highest_magic',
    at: 25,
    perk: FreePower()
});

Achievement({
    name: 'How?',
    stat: 'highest_magic',
    at: 50,
    perk: FreePower()
});


Achievement({
    name: 'Okay',
    stat: 'highest_gold_turn',
    at: 100,
    perk: FreeGold(25)
});


Achievement({
    name: 'Better',
    stat: 'highest_gold_turn',
    at: 500,
    perk: FreeGold(100)
});


Achievement({
    name: 'Good',
    stat: 'highest_gold_turn',
    at: 1500,
    perk: FreeGold(100)
});


Achievement({
    name: 'Great',
    stat: 'highest_gold_turn',
    at: 3000,
    perk: FreeGold(100)
});


Achievement({
    name: 'Amazing',
    stat: 'highest_gold_turn',
    at: 7500,
    perk: FreeGold(100)
});


Achievement({
    name: 'Awesome',
    stat: 'highest_gold_turn',
    at: 25000,
    perk: FreeGold(100)
});


Achievement({
    name: 'Getting Close',
    stat: 'highest_gold_turn',
    at: 100000,
    perk: FreeGold(100)
});

Achievement({
    name: 'You Win The Game',
    stat: 'highest_gold_turn',
    at: 1000000,
    perk: FreeGold(100)
});


Achievement({
    name: 'You Win The Game More',
    stat: 'highest_gold_turn',
    at: 1000000000,
    perk: FreeGold(100)
});


Achievement({
    name: 'Too Easy?',
    stat: 'highest_gold_turn',
    at: 100000000000,
    perk: FreeGold(100)
});


Achievement({
    name: 'Poor',
    stat: 'total_gold_alltime',
    at: 1000,
    perk: FreeDie()
});


Achievement({
    name: 'Middle Class',
    stat: 'total_gold_alltime',
    at: 10000,
    perk: FreePower()
});

Achievement({
    name: 'Rich',
    stat: 'total_gold_alltime',
    at: 100000,
    perk: FreePower()
});

Achievement({
    name: 'Wealthy',
    stat: 'total_gold_alltime',
    at: 1000000,
    perk: FreePower()
});

Achievement({
    name: 'Gates',
    stat: 'total_gold_alltime',
    at: 10000000,
    perk: FreeDie()
});

Achievement({
    name: 'Ransom Money',
    stat: 'total_gold_alltime',
    at: 1000000000,
    perk: FreeDie()
});
Achievement({
    name: 'Golden Parachute',
    stat: 'total_gold_alltime',
    at: 100000000000,
    perk: FreeDie()
});
Achievement({
    name: 'Wow Such Cash',
    stat: 'total_gold_alltime',
    at: 10000000000000,
    perk: FreeDie()
});
Achievement({
    name: 'Like a Real Incremental',
    stat: 'total_gold_alltime',
    at: 1000000000000000,
    perk: FreeDie()
});
Achievement({
    name: 'Billions of Billions',
    stat: 'total_gold_alltime',
    at: 100000000000000000,
    perk: FreeDie()
});



Achievement({
    name: 'Inefficient',
    stat: 'highest_multiplier',
    at: 4.0,
    perk: FreeMultiplier(1)
});

Achievement({
    name: 'Efficient',
    stat: 'highest_multiplier',
    at: 8.0,
    perk: FreeMultiplier(1)
});

Achievement({
    name: 'Times Tabler',
    stat: 'highest_multiplier',
    at: 16.0,
    perk: FreeMultiplier(1)
});

Achievement({
    name: 'You Love Logistics',
    stat: 'highest_multiplier',
    at: 32.0,
    perk: FreeMultiplier(1)
});

Achievement({
    name: 'Prudent',
    stat: 'highest_multiplier',
    at: 128.0,
    perk: FreeMultiplier(1)
});


Achievement({
    name: 'Weighted Dice',
    stat: 'highest_multiplier',
    at: 512.0,
    perk: FreeMultiplier(1)
});


Achievement({
    name: 'Exponential',
    stat: 'highest_multiplier',
    at: 1024.0,
    perk: FreeMultiplier(1)
});




Achievement({
    name: 'Dawn',
    stat: 'turns_alltime',
    at: 10,
    perk: FreeGold(20)
});


Achievement({
    name: 'Morning',
    stat: 'turns_alltime',
    at: 50,
    perk: FreeGold(50)
});


Achievement({
    name: 'Noon',
    stat: 'turns_alltime',
    at: 100,
    perk: FreePower()
});


Achievement({
    name: 'Midnight',
    stat: 'turns_alltime',
    at: 200,
    perk: FreeDie()
});

Achievement({
    name: 'Roll Up In Da Club?',
    stat: 'turns_alltime',
    at: 800,
    perk: FreeDie()
});


Achievement({
    name: 'Rolls Royce',
    stat: 'turns_alltime',
    at: 2000,
    perk: FreeDie()
});


Achievement({
    name: 'RAWHIDE!',
    stat: 'turns_alltime',
    at: 10000,
    perk: FreeDie()
});


Achievement({
    name: 'Tada',
    stat: 'tricks_performed',
    at: 100,
    perk: LearnTrick('Dueces')
});

Achievement({
    name: 'Voila',
    stat: 'tricks_performed',
    at: 1000,
    perk: LearnTrick('Triple Triad')
});

Achievement({
    name: 'Abracadabra',
    stat: 'tricks_performed',
    at: 2500,
    perk: LearnTrick('Four Wheel Drive')
});

Achievement({
    name: 'Zyzyx',
    stat: 'tricks_performed',
    at: 5000,
    perk: LearnTrick('Ezekiel')
});

Achievement({
    name: 'Alakazam',
    stat: 'tricks_performed',
    at: 50000,
    perk: FreeDie(),
});

Achievement({
    name: 'Shazam',
    stat: 'tricks_performed',
    at: 500000,
    perk: FreeDie(),
});

Achievement({
    name: 'Mecca Lecca Hi',
    stat: 'tricks_performed',
    at: 5000000,
    perk: FreeDie(),
});

Achievement({
    name: 'Sim Sala Bim',
    stat: 'tricks_performed',
    at: 50000000,
    perk: FreeDie(),
});


Achievement({
    name: 'Combo',
    stat: 'most_tricks_turn',
    at: 25,
    perk: LearnTrick('Tasty Pi')
});

Achievement({
    name: 'C-combo',
    stat: 'most_tricks_turn',
    at: 50,
    perk: LearnTrick('Two Slices')
});

Achievement({
    name: 'C-c-combo',
    stat: 'most_tricks_turn',
    at: 100,
    perk: LearnTrick('Lucky 7')
});

Achievement({
    name: 'C-c-combo Breaker!',
    stat: 'most_tricks_turn',
    at: 150,
    perk: LearnTrick('Holy Hand Grenade')
});

Achievement({
    name: 'Endless Combo',
    stat: 'most_tricks_turn',
    at: 250,
    perk: LearnTrick('Holy Hand Grenade')
});

Achievement({
    name: 'Combo of Combos',
    stat: 'most_tricks_turn',
    at: 1000,
    perk: LearnTrick('Holy Hand Grenade')
});

Achievement({
    name: 'Comboception',
    stat: 'most_tricks_turn',
    at: 5000,
    perk: LearnTrick('Holy Hand Grenade')
});


function create_magic_ach(color, ats) {
    var stats = {
        'green': 'green_power',
        'blue': 'blue_bp',
        'red': 'red_multiplier',
        'pink': 'pink_multiplier',
        'yellow': 'yellow_gold',
        'purple': 'purple_xp',
    };
    var ranks = {
        0: 'Apprentice',
        1: 'Journeyman',
        2: 'Master',
        3: 'Grandmaster',
        4: 'Wizard',
        5: 'Mage',
        6: 'Demon',
        7: 'Angel'
    };
    _.each(ats, function(at, r) {
        Achievement({
            name: color[0].toUpperCase() + color.substring(1) + ' ' + ranks[r],
            stat: stats[color],
            'at': at,
            perk: MagicBoost(color, 1)
        });
    });
}
var mil = 1000000;
var k = 1000;
var bil = 1000000000;

create_magic_ach('green', [100, 500, 2500, 10000, 50000, 250000, 1000000, 5000000]);
create_magic_ach('red', [25, 100, 500, 5000, 50000, 500000, 2000000, 8000000]);
create_magic_ach('pink', [25, 50, 250, 2500, 25000, 250*k, 1*mil, 4*mil]);
create_magic_ach('purple', [1000, 50*k, 1*mil, 25*mil, 500*mil, 2.5*bil, 25*bil, 200*bil ])
create_magic_ach('yellow', [1000, 50*k, 1*mil, 25*mil, 500*mil, 2.5*bil, 25*bil, 200*bil ])
create_magic_ach('blue', [1000, 50*k, 1*mil, 25*mil, 500*mil, 2.5*bil, 25*bil, 200*bil ])
