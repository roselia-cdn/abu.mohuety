window.wsp = {};
wsp.quests = {
    questions: ["您是他的粉丝吗？", "以下哪个词语他经常说？", "他星期天做什么的可能性最小？", "扪心自问，明天是谁？", "这是一道送分题", "他何处高就？", "在高中阶段，你对哪个数字印象最深刻？",
    "他的*字真言究竟有几个字？", '他打牌时最喜欢出什么？', "他在2017年的暑假去哪个西方国家提高姿势水平了？", '您能否看到他的说说？', '以下哪个不是或不曾是他的网名？', "他教会了我们什么"],
    options: [["不是，下一题", "谁啊，没听说过", "放肆，敢问这种问题", "明天是你！" , "呵呵"], ['哈哈', '蛤蛤', '呵呵', '嘿嘿'], ['做值日', '罚值', '骑马', '打牌'],
            ['你', '我', '他', '她', '它'], ['十分良心地只有一个选项'], ['北京大学', '清华大学', '复旦大学', '上海交通大学', '浙江大学'], [22, 23, 24, 25, 26, 27], [7,8,9,10,'J', 'Q', 'K'],
            ['炸弹', '对子', '三条', '顺子'], ['美国','英国', '澳大利亚', '新加坡', '苟屁！他根本没有去什么西方国家！'], ['能', '不能'], ['Aniz', 'Ainz', '空虚⭐寂寞', 'vip8sam', 'Ooal Gown'],
            ['骑术和马术', '责任与义务', '责任与担当', '忠诚与奉献', '无可奉告']],
    answers: JSON.parse(window.atob("WzIsMiwxLDEsMCw0LDQsMCwzLDQsMSwyLDJd"))// [2, 2, 1, 1, 0, 4, 4, 0, 3, 4, 1, 2, 2]//
};
wsp.loadQuests = function () {
    let raw_quests = wsp.quests;
    let quests = raw_quests.questions.map(function (q, i) {
        return {
            question: q, options:raw_quests.options[i], answer: raw_quests.answers[i], id: i
        };
    });
    quests.sort(function (a, b) {
        return Math.random()>.5 ? -1 : 1;
    });
    quests.map((q, i) => q.fid = i);
    wsp.fquests = quests;
    wsp.answered = 0;
    wsp.total = quests.length;
    wsp.correct = 0;
    new Vue({
        el: "#quests", data: {
            quests: wsp.fquests, wsp: wsp
        }
    });
};

wsp.answer = function (idx, ans) {
    let to = wsp.fquests[idx];
    let $quest = $(`#quest-${to.id}`);
    $quest.find(".card-action button").addClass("disabled");//.remove();
    $quest.fadeOut();
    wsp.answered++;
    wsp.correct += to.answer === ans;
};

wsp.resizer = function () {
    $('.parallax-container').css({minHeight: (window.innerHeight - $('#mobile-nav').height()) + "px"});
    $('.parall-pic').css({width: window.innerWidth});
};

wsp.addQuest = function () {
    wsp.fquests.push({
        question: "无耻老贼，竟敢口出狂言！谅你做完了所有题目，给你一个做送命题的机会。", options:["放弃吧，没有正确答案的。"], answer: 233, id: wsp.total, fid: wsp.total++
    });

};

wsp.setHref = function () {
    $("#tg-btn").attr('href', wsp.tgChannel());
};

wsp.tgChannel = function () {
    let b64str = "aHR0cHM6Ly90Lm1lL2pvaW5jaGF0L0RyMV90QXVHRkhsLUpxNkN5ZUloRkE=";
    return window.atob(b64str);
};

wsp.colors = ["#1de9b6", "#00695c", "#2e7d32", "#76ff03", "#c6ff00"];
wsp.textColors = ["#00bfa5", "#004d40", "#1b5e20", "#64dd17", "#aeea00"];
wsp.randomColorChange = function () {
    let p = parseInt(Math.random() * wsp.colors.length);
    $(".sp-color").css('background-color', wsp.colors[p]);
    $(".sp-text").css('color', wsp.colors[p]);
};
wsp.taunt = function () {
    console.log("%c 什么？你竟然打开了控制台？", 'font-size: 20px;font-family: "微软雅黑", sans-serif;color: #1de9b6;');
    console.log("%c 果然还是有寂寞如雪的人啊，但是我很欣赏你。如果你有什么想法，请发e-mail至：%cspfans@roselia.moe", 'font-size: 16px;font-family: "微软雅黑", sans-serif;color: #00695c;', 'font-size: 16px;font-family: "微软雅黑", sans-serif;color: #ad1457;');

};

$(document).ready(function () {
    $(".button-collapse").sideNav();
    $('.parallax').parallax();
    wsp.resizer();
    $(window).resize(wsp.resizer);
    wsp.loadQuests();
    $(".disagree").mouseover((e) => {
        $(e.target).remove();
    });
    wsp.randomColorChange();
    wsp.taunt();
});