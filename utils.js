log10 = Math.log(10);
log100 = Math.log(100);
log1000 = Math.log(1000);
NUMBER_SUFFIXES = ["K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "Nn",
                   "Dc", "UDc", "DDc", "TDc", "QaDc", "QtDc", "SxDc", "SpDc", "ODc", "NDc",
                   "Vi", "UVi", "DVi", "TVi", "QaVi", "QtVi", "SxVi", "SpVi", "OcVi", "NnVi",
                   "Tg", "UTg", "DTg", "TTg", "QaTg", "QtTg", "SxTg", "SpTg", "OcTg", "NnTg",
                   "Qd", "UQd", "DQd", "TQd", "QaQd", "QtQd", "SxQd", "SpQd", "OcQd", "NnQd",
                   "Qq", "UQq", "DQq", "TQq", "QaQq", "QtQq", "SxQq", "SpQq", "OcQq", "NnQq",
                   "Sg"
];
function format_number(num) {
    if(num === 0) {
        return 0;
    }
    if(num < 10 && num % 1) {
        return num.toFixed(2);
    }
    if(num < 1000) {
        return Math.floor(num);
    }
    var digits = Math.floor(Math.log(num) / log10 + 0.1);
    var suffix = NUMBER_SUFFIXES[Math.floor(digits / 3)-1];
    var smaller = (num / Math.pow(10, Math.floor(digits/3)*3));
    var fmted;
    if(smaller >= 100) fmted = smaller.toFixed(0);
    else if(smaller >= 10) fmted = smaller.toFixed(1);
    else fmted = smaller.toFixed(2);
    return fmted + "<span class='suffix'>"+suffix+"</span>";
}

//animateNumber(this.$gold, 'text', this.game().gold(), 1500, 'swing');
function animateNumber($input, attr, num, duration, easing)
{
    var formatter = function(n) {
        return parseInt(n, 10);
    }
    $input
        .data("start", parseInt($input[attr](), 10) || 0)
        .animate({text:parseInt(num, 10)},
        {
            easing: easing === undefined ? "linear" : easing,
            duration: duration === undefined ? 500 : parseInt(duration, 10),
            step: function(now, fx)
            {
                //console.log(now, fx);
                var $this = jQuery(this);
                $this[fx.prop](Math.round(now));
                return;
                $this[attr]
                var start = parseInt($this.data("start"), 10);
                // console.log(fin, obj, start);
                $this[attr](parseInt((fin-start)*obj.state, 10) + start );
            }
        });
}


//animateNumber(this.$gold, 'text', this.game().gold(), 1500, 'swing');
function animateLargeNumber($input, attr, num, duration, easing)
{
    var formatter = function(n) {
        return format_number(parseInt(n, 10));
    }
    $input
        .data("start", parseInt($input.data('val'), 10) || 0)
        .animate({'data-val':parseInt(num, 10)},
        {

            easing: easing === undefined ? "linear" : easing,
            duration: duration === undefined ? 500 : parseInt(duration, 10),
            step: function(now, fx)
            {
                //console.log(now, fx);
                var $this = jQuery(this);
                $this.children('.large_anim').html(format_number(now));
                return;

                $this[fx.prop](Math.round(now));
                return;
                $this[attr]
                var start = parseInt($this.data("start"), 10);
                // console.log(fin, obj, start);
                $this[attr](formatter((fin-start)*obj.state + start) );
            }
        });
}


function poly_path(center, radius, sides) {
    //console.log('poly path: ', center, radius, sides);
    var cmds = [];
    // remember, ys are inversed here.
    var pts = [];
    for(var i=0;i<sides;i++) {

        var angle = Trig.twopi * i / sides - Trig.pi * 0.5;
        //console.log(angle);
        var y = Trig.sin(angle) * radius * -1;
        var x = Trig.cos(angle) * radius;
        pts.push(center.plus(x, y));
    }
    _.each(pts, function(pt) {
        if(!cmds.length) {
            cmds.push('M');
        } else {
            cmds.push('L');
        }
        cmds.push(pt.x);
        cmds.push(pt.y);
    });
    cmds.push('Z');

    var path = cmds.join(' ');
    // console.log(path);
    return path;


}

