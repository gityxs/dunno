
TrickTest = Ice.$extend('TrickTest', {
    __init__: function(phase) {
        this.$super();

        // Phases: streak, combo, meta, passive
        this.phase = phase;
    },
    get_matches: function(trick, dice) {
        // Copy the array, because we're gonna mutate it all over the place.
        dice = dice.slice();
        var matches = [];

        var match = true;
        while(match && dice.length) {
            var anal = DiceAnalysis(dice);
            // console.log("dice is ", dice);
            match = this.get_match(trick, anal);
            if(match) {
                matches.push(match);
                // console.log("Dice length was ", dice.length);
                // console.log("match", match);
                dice = _.difference(dice, match.dice);
                // console.log("Dice length is now ", dice.length);
                //fthrow "potato";
            }

        }
        return matches;
    }

});

TrickMatch = Ice.$extend('TrickMatch', {
    __init__: function(trick, dice) {
        var self = this;
        this.dice = dice;
        this.trick = trick;
        this.trick_name = trick.name;
        this.earnings = Earnings();

        _.each(this.trick.rewards, function(reward) {
            self.earnings.plus_equals(reward.get_earnings(dice));
        });

    },
    play_match: function(game) {
        var self = this;

        var es = {};
        var $log = TemplateManager.clone_from_html(
            '<div class="trick_log"><div id="name_holder"><p><span id="name"></span>  (<span id="numbers"></span>)</p></div></div>',
        es);

        es.$name.text(this.trick.name);
        // console.log("Playing trick: ", this.trick.name, this.dice);
        if(self.dice.length && self.dice[0].isa(Die) && this.trick.test.phase != 'salary') {
            var nums = _.map(self.dice, function(die) {
                return die.value();
            });
            es.$numbers.text(nums.join(', '));
        } else {
            es.$numbers.text('All');
        }

        $log.append(self.earnings.make_reward_line());
        self.earnings.apply_earnings(game);
        self.trick.performances.inc(1);

        return $log;
    }

});

MergeMatch = Ice.$extend('TrickMatch', {
    __init__: function(matches) {
        var self = this;
        this.sub_matches = matches;
        this.trick = matches[0].trick;
        this.trick_name = matches[0].trick_name;
        self.earnings = Earnings();

        _.each(this.sub_matches, function(submatch) {
            self.earnings.plus_equals(submatch.earnings);
        });
    },
    play_match: function(game) {
        var self = this;

        var es = {};
        var $log = TemplateManager.clone_from_html(
            '<div class="trick_log"><div id="name_holder"><p><span id="name"></span>  x<span id="times"></span></p></div></div>',
        es);

        es.$name.text(this.trick.name);
        // console.log("Playing trick: ", this.trick.name, this.dice);
        es.$times.text(this.sub_matches.length);

        self.trick.performances.inc(self.sub_matches.length);


        self.earnings.apply_earnings(game);

        $log.append(self.earnings.make_reward_line());

        return $log;
    }
});


MergeAnyMatch = Ice.$extend('TrickMatch', {
    __init__: function(matches) {
        var self = this;
        this.sub_matches = matches;
        self.earnings = Earnings();

        _.each(this.sub_matches, function(submatch) {
            self.earnings.plus_equals(submatch.earnings);
        });
    },
    play_match: function(game) {
        var self = this;

        var es = {};
        var $log = TemplateManager.clone_from_html(
            '<div class="trick_log"><div id="name_holder"><p><span id="name"><span id="times"></span> More Tricks</span></p></div></div>',
        es);

        // console.log("Playing trick: ", this.trick.name, this.dice);
        es.$times.text(this.sub_matches.length);



        self.earnings.apply_earnings(game);
        _.each(self.sub_matches, function(m) {
            if(m.sub_matches) {
                m.trick.performances.inc(m.sub_matches.length);
            } else {
                m.trick.performances.inc(1);
            }
        });

        $log.append(self.earnings.make_reward_line());

        return $log;
    }
});


_.mixin({
    remove: function(array, item) {
        var i = array.indexOf(item);
        if(i !== -1) {
            array.splice(i, 1);
        }
    },
    random_items: function(array, count) {
        return _.first(_.shuffle(array), count||1);
    }
});

DiceAnalysis = Ice.$extend('DiceAnalysis', {
    __init__: function(dice) {
        this.$super();

        this.dice = dice;
        this.shuffled = _.shuffle(dice);

        this.asc = _.sortBy(dice, function(d) {
            return d.value();
        });
        this.desc = this.asc.slice().reverse();


        this.groups = _.groupBy(dice, function(d) {
           return d.value();
        });

        this.asc_unique = _.sortBy(_.keys(this.groups), function(num) {
            return parseInt(num, 10);
        });
        this.desc_unique = this.asc_unique.slice().reverse();

    },
    has: function(num, cnt) {
        cnt = cnt || 1;
        var g = this.groups[num];
        return g ? g.length >= cnt : false;
    },
    take: function(what, cnt) {
        var dice, num;
        cnt = cnt || 1;

        if(typeof(what) === 'number' || typeof(what) === 'string') {
            dice = _.random_items(this.groups[what]).slice(0, cnt);
            if(!dice.length) return null;
            num = what;
        } else {
            // console.log("type of wat is ", typeof(what));
            dice = [what];
            num = what.value();
        }

        for(var x = 0; x <= cnt; x++) {
            var die = dice[0];
            _.remove(this.groups[num], die);
            _.remove(this.dice, die);
            _.remove(this.asc, die);
            _.remove(this.desc, die);
            _.remove(this.shuffled, die);
         
        }
        // If there are no more of this number
        if(!this.groups[num].length) {
            _.remove(this.asc_unique, num);
            _.remove(this.desc_unique, num);
        }

        if(dice.length == 1) return dice[0];

        return dice;

    }
});

StreakSame = TrickTest.$extend('StreakSame', {
    __init__: function(opts) {
        this.$super('streak');
        this.in_a_row = opts.in_a_row || 3;
    },
    get_description: function() {
        return 'Roll the same thing ' + this.in_a_row +' times in a row on a single die.';
    },
    get_match: function(trick, anal) {
        var self = this;
        _.each(anal.dice, function(die) {
            if(die.history.length < in_a_row) {
                return false;
            }

            // Get the first number.
            var num = die.history[die.history.length -1];
            var repeats = 0;
            for(var i = die.history.length - 1; i >= 0; i--) {
                if(die.history[i] === num) {
                    repeats ++;
                } else {
                    break;
                }
            }
            if(repeats >= num) {
                return TrickMatch(trick, [die]);
            }
        });
        return null;
    }
});

StreakSequence = TrickTest.$extend('StreakSequence', {
    __init__: function(opts) {
        this.$super('streak');
        this.seq = opts.seq || [];
        if(!this.seq.length) this.seq = [1,2,3];
    },
    get_description: function() {
        return 'Roll ' + this.seq.join(', ') + ' consecutively in any order on a single die.';
    },
    get_match: function(trick, anal) {
        var self = this;
        var seq = self.seq;
        _.each(anal.dice, function(die) {
            if(die.history.length < seq.length) {
                return false;
            }
            var recent = die.history.slice(die.history.length-seq.length);
            if(_.difference(seq, recent).length === 0) {
                return new TrickMatch(trick, [die]);
            }
        });

        return null;
    }
});


ComboSequence = TrickTest.$extend('ComboSequence', {
    __init__: function(opts) {
        this.$super('combo');
        this.seq = opts.seq || [1,2,3];
    },
    get_description: function() {
        return 'Roll ' +this.seq.join(', ');
    },
    get_match: function(trick, anal) {
        var self = this;
        var res = [];

        var take = [];
        _.each(this.seq, function(num) {
            var die = anal.take(num);
            if(die) {
                take.push(die);
            }
        });

        if(take.length !== this.seq.length) {
            return null;
        }
        return TrickMatch(trick, take);
    }
});


ComboSets = TrickTest.$extend('ComboPairs', {
    __init__: function(opts) {
        this.$super('combo');
        this.of_a_kind = opts.of_a_kind || 2;
        this.sets = opts.sets || 1;
    },
    get_description: function() {
        return 'Roll ' +
                (this.sets == 1? '' : this.sets + ' sets of ') +
                 this.of_a_kind + ' of a kind.';
    },
    get_match: function(trick, anal) {
        var self = this;
        var sets = this.sets || 1;
        var taken = [];

        _.find(anal.desc_unique, function(i) {
            if(!sets) return true;  // If I need no more sets, exit out.

            // console.log("Checking ", i, "length is ", anal.has(i), "ofakind: ", self.of_a_kind);
            if(anal.has(i, self.of_a_kind)) {
                for(var t = 0; t< self.of_a_kind; t++) {
                    taken.push(anal.take(i));
                }
                sets --;
                // console.log("Yes, sets is now ", sets);
            }
        });
        if(sets === 0) {
            return new TrickMatch(trick, taken);
        }
        return null;
    }
});

ComboStraight = TrickTest.$extend('ComboStraight', {
    __init__: function(opts) {
        this.$super('combo');
        this.in_a_row = opts.in_a_row || 3;
        this.multiple = opts.multiple || 1;
        this.of_a_kind = opts.of_a_kind || 1;
    },
    get_description: function() {
        var desc = 'Roll a straight of ' + this.in_a_row;
        if(this.of_a_kind > 1) {
            desc += ' ' + this.of_a_kind + ' of-a-kind';
        }
        if(this.multiple > 1) {
            desc += ' multiples of ' + this.multiple;
        }
        desc += ' in a row.';
        return desc;
    },
    get_match: function(trick, anal) {
        var self = this;
        var taken = null;
        var nums;
        _.find(anal.desc_unique, function(i) {
            if(i % self.multiple) {
                return false;
            }

            nums = [];
            for(var x =0; x< self.in_a_row; x++) {
                nums.push(i - x - self.multiple);
            }

            if(_.all(nums, function(num) {
                return anal.has(num, self.of_a_kind);
            })) {
                taken = _.map(nums, function(num) {
                    return anal.take(num, self.of_a_kind);
                });
                taken = _.flatten(taken);
                return true;
            }
        });
        if(taken) {
            return TrickMatch(trick, taken);
        }
        return null;

    }
});


ComboStraightMutliples = TrickTest.$extend('ComboStraight', {
    __init__: function(opts) {
        this.$super('combo');
        this.in_a_row = opts.in_a_row || 3;
        this.multiple = opts.multiple || 2;
    },
    get_description: function() {
        return 'Roll a straight of ' + this.in_a_row + ' in a row.';
    },
    get_match: function(trick, anal) {
        var self = this;
        var taken = null;
        var nums;
        _.find(anal.desc_unique, function(i) {
            nums = [];
            if(i % self.multiple) {
                return false;
            }
            for(var x =0; x< self.in_a_row; x++) {
                nums.push(i - x * self.mutliple);
            }
            if(_.all(nums, function(num) {
                return anal.has(num);
            })) {
                taken = _.map(nums, function(num) {
                    return anal.take(num);
                });
                return true;
            }
        });
        if(taken) {
            return TrickMatch(trick, _.flatten(taken));
        }
        return null;

    }
});

ComboStraightPairs = TrickTest.$extend('ComboStraight', {
    __init__: function(opts) {
        this.$super('combo');
        this.in_a_row = opts.in_a_row || 3;
        this.multiple = opts.multiple || 2;
        this.of_a_kind = opts.multiple || 1;
    },
    get_description: function() {
        return 'Roll a straight of ' + this.in_a_row + ' in a row.';
    },
    get_match: function(trick, anal) {
        var self = this;
        var taken = null;
        var nums;
        _.find(anal.desc_unique, function(i) {
            nums = [];
            if(i % self.multiple) {
                return false;
            }
            for(var x =0; x< self.in_a_row; x++) {
                nums.push(i - x * self.mutliple);
            }
            if(_.all(nums, function(num) {
                return anal.has(num);
            })) {
                taken = _.map(nums, function(num) {
                    return anal.take(num);
                });
                return true;
            }
        });
        if(taken) {
            return TrickMatch(trick, _.flatten(taken));
        }
        return null;

    }
});



SalaryTest = TrickTest.$extend('SalaryTest', {
    __init__: function(opts) {
        this.$super('salary');
    },
    get_description: function() {
        return 'Earn a little gold, experience, and bp from your die rolls.';
    },
    get_match: function(trick, anal) {
        return TrickMatch(trick, anal.dice);
    }
});