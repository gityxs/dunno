LEVELUPS = [];

var lvl = 2;
LevelUp = Ice.$extend('LevelUp', {
    __init__: function(perk) {
        this.$super();
        this.level = lvl;
        lvl ++;
        this.perk = perk;
        perk.name = 'Level ' + this.level;
        perk.id = 'LevelUp.' + this.level;

        LEVELUPS.push(this);
    }
});




// Subtract 20 for level
LevelUp(FreeGold(50));
LevelUp(LearnTrick('Ace'));
LevelUp(FreeMultiplier(0.25));
LevelUp(FreePower());
LevelUp(LearnTrick('Plank'));
LevelUp(FreePower());
LevelUp(LearnTrick('Three in a Row'));
LevelUp(FreeGold(250));
LevelUp(FreePower());
LevelUp(LearnTrick('Three of a Kind'));
LevelUp(FreeDie());
LevelUp(FreePower());
LevelUp(FreeGold(500));
LevelUp(LearnTrick('Easy As'));
LevelUp(FreeDie());
LevelUp(FreeMultiplier(0.25));
LevelUp(LearnTrick('Patriot'));
LevelUp(FreeDie());
LevelUp(FreePower());
LevelUp(LearnTrick('Evil'));

var levelup_tricks = [
'Lucky 7',
'Information',
'Hup!',
'Five and Dime',
'Primer',
'Frightened Six',
'Unlucky',
'Cursed',
'Natural',
'Long Haul',
'Do You Feel Lucky?',
'Travis Combo 11 3 1',
'Eeyore',
'Auld Lang Syne',
'Toll Free',
'On the Clock',
'Dynamite',
'Jaybirds',
'Ladies',
'Cowboys',
'Snake Eyes',
'Australian Yo',
'Easy Four',
'Little Phoebe',
'Sixie From Dixie',
'The Devil',
'Ballerina',
'OJ',
'Jimmie Hicks',
'Benny Blue',
'Easy Eight',
'Big Red',
'Eighter from Decatur',
'Nina from Pasadena',
'Square Pair',
'Railroad Nine',
'Tennessee',
'Puppy Paws',
'No Jive',
'Boxcars',
'3 Straight Pairs',
'Get Even',
'Three by Three',
'Five by Five',
'Still Lucky',
'Skipping Fours',
'Byte',
'Bitwise',
'Pascal',
'If You Leave',
'Diary',
'B-52s',
'Baby Got Back',
'Tommy Tutone',
];

_.each(levelup_tricks, function(name) {
	LevelUp(FreePower());
	LevelUp(FreeGold(500));
	LevelUp(FreeMultiplier(0.25));
	LevelUp(FreeDie());
	LevelUp(FreePower());
	LevelUp(FreeGold(500));
	LevelUp(FreeMultiplier(0.25));
    LevelUp(LearnTrick(name));
});
