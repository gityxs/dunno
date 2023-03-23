/*

 @name    : 锅巴汉化 - Web汉化插件
 @author  : 麦子、JAR、小蓝、好阳光的小锅巴
 @version : V0.6.1 - 2019-07-09
 @website : http://www.g8hh.com

*/

//1.汉化杂项
var cnItems = {
    _OTHER_: [],

    //未分类：
    'Click': '点击',
    'Gold': '黄金',
    'Green': '绿色',
    'Loading...': '加载中...',
    'Play': '开始',
    'I didn\'t know what to call the game.': '我不知道该怎么称呼这个游戏。',
    'Gains some free power every roll.': '每轮获得一些免费的力量',
    'Better': '更好',
    'Blue': '蓝色',
    'Blue Angel': '蓝天使',
    'Experience points': '经验值',
    'experience points': '经验值',
    'Efficient': '高效',
    'First Step': '第一步',
    'Free Die': '免费骰子',
    'From now on you start with an extra die.': '从现在开始，您将从额外的模具开始。',
    'Endless Combo': '无尽的组合',
    'Free Gold': '免费的黄金',
    'The last ones are music and can take awhile!': '最后一个是音乐，可能需要一段时间加载！',
    'The last sounds take a while to load, it\'s the music!': '最后的声音加载需要一段时间，这是音乐！',
    'The logo above is the only image in the game.  I can\'t draw for beans.': '上面的徽标是游戏中唯一的图像。 我不能画豆子。',
    'This is the second game I\'ve ever released, and though it\'s a silly, simple grinder, I\'m really proud of how it turned out.  Please leave a comment if you can!  Positive or negative, I\'ll use it to make my next game even better!': '这是我发布的第二款游戏，尽管它是一款愚蠢而简单的研磨机，但我对它的结果感到非常自豪。 如果可以，请发表评论！ 积极或消极，我会用它来让我的下一款游戏更好！',
    'This game isn\'t in flash.  HTML5 magic!': '这个游戏不是Flash制作的。 是HTML5魔法！',
    'Save Game': '保存游戏',
    'Sprint': '短跑',
    'Too Easy?': '太简单？',
    'Turn': '回合',
    'Yellow': '黄色',
    'Purchase New Die [P]': '购买新骰子 [P]',
    'Quarters': '住处',
    'Roll': '投掷',
    'Rolls Left': '剩余投掷次数',
    'Green Angel': '绿天使',
    'Hide Earned': '隐藏获得',
    'Hide Mastered': '隐藏专精',
    'Highest Magic': '最高魔法',
    'Level': '等级',
    'Yay [R]': '耶 [R]',
    'gold.': '黄金。',
    'Good': '不错',
    'Great': '很好',
    'Game Over!': '游戏结束!',
    'Gates': '大门',
    'Getting Close': '越来越接近',
    'Gold Earned': '赚取的黄金',
    'You are out of turns!  Game over!': '你出局了！ 游戏结束！',
    'You can earn perks by levelling up from experience points, mastering tricks, or completing achievements.': '您可以通过升级经验值，掌握技巧或完成成就来获得额外收入。',
    'You can move this window around at any time.': '您可以随时移动此窗口。',
    'You can start a new game, and keep your levels and perks.': '你可以开始一个新的游戏，并保持你的等级和福利。',
    'You Love Logistics': '你喜欢物流',
    'You keep your XP when you start a new game.\n               ': '当你开始新游戏时，你会保留你的经验值。',
    'You Win The Game': '你赢得了比赛',
    'You Win The Game More': '你赢得了更多比赛',
    'Your dice are on the left, and you can click them to upgrade, once you have some cash.': '你的骰子在左边，一旦你有现金，你可以点击它们升级。',
    'Your highest gold-earning turn was': '你获得的最高收益是',
    'upgrade it': '升级它',
    'Tricks Learned': '学会的技巧',
    'Tricks Mastered: ': '精通的技巧：',
    'Tricks Performed': '演出技巧',
    'Tricks Performed (this game': '演出技巧（本轮游戏',
    'money': '金钱',
    'Morning': '早上',
    'New Game +': '新游戏 +',
    'Okay': '好的',
    'Options': '选项',
    'Game saves automatically after every roll.  This button is for the paranoid.': '每次投掷后游戏都会自动保存。 这个按钮适合偏执狂。',
    'Gold Earned (this game': '赚取的黄金（本轮游戏',
    'Start a new game with all your xp and levels.': '用你所有的经验和等级开始一个新的游戏。',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',

    //原样
    '': '',
    '': '',

}


//需处理的前缀
var cnPrefix = {
    "(-": "(-",
    "(+": "(+",
    "(": "(",
    "-": "-",
    "+": "+",
    " ": " ",
    ": ": "： ",
}

//需处理的后缀
var cnPostfix = {
    ":": "：",
    "：": "：",
    ": ": "： ",
    "： ": "： ",
    " ": "",
    "/s)": "/s)",
    "/s": "/s",
    ")": ")",
    "%": "%",
}

//需排除的，正则匹配
var cnExcludeWhole = [
    /^x?\d+(\.\d+)?[A-Za-z%]{0,2}(\s.C)?\s*$/, //12.34K,23.4 °C
    /^x?\d+(\.\d+)?(e[+\-]?\d+)?\s*$/, //12.34e+4
    /^\s*$/, //纯空格
    /^\d+(\.\d+)?[A-Za-z]{0,2}.?\(?([+\-]?(\d+(\.\d+)?[A-Za-z]{0,2})?)?$/, //12.34M (+34.34K
    /^(\d+(\.\d+)?[A-Za-z]{0,2}\/s)?.?\(?([+\-]?\d+(\.\d+)?[A-Za-z]{0,2})?\/s\stot$/, //2.74M/s (112.4K/s tot
    /^\d+(\.\d+)?(e[+\-]?\d+)?.?\(?([+\-]?(\d+(\.\d+)?(e[+\-]?\d+)?)?)?$/, //2.177e+6 (+4.01+4
    /^(\d+(\.\d+)?(e[+\-]?\d+)?\/s)?.?\(?([+\-]?(\d+(\.\d+)?(e[+\-]?\d+)?)?)?\/s\stot$/, //2.177e+6/s (+4.01+4/s tot
];
var cnExcludePostfix = [
    /:?\s*x?\d+(\.\d+)?(e[+\-]?\d+)?\s*$/, //12.34e+4
    /:?\s*x?\d+(\.\d+)?[A-Za-z]{0,2}$/, //: 12.34K, x1.5
]

//正则替换，带数字的固定格式句子
//纯数字：(\d+)
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
var cnRegReplace = new Map([
    [/^Loading sound \((\d+)\/$/, '加载声音文件 ($1\/'],
    
    [/^From now on you start with an extra \$([\d\.,]+).$/, '从现在开始，您需要额外支付\$$1。'],
    [/^Cost: (\d+) RP$/, '成本：$1 皇家点数'],
    [/^Usages: (\d+)\/$/, '用途：$1\/'],
    [/^workers: (\d+)\/$/, '工人：$1\/'],

]);