"use strict";
window.inm={
    results: [], can:false, started: false, eqL:"", eqR: "114514"
};
inm.rend=(l,o) => l.map((v, k) => `${o[k]}${v}`).join('').substring((o.charAt(0)==='+')+0);
inm.digest = s => [].map.call(s, x => parseInt(x)).filter(x=>x>=0);
inm.split=l=>{
    let res=new Map(), opec="+-";
    for(let p=0;p<(1<<l.length);p++){
        const acc = l.reduce((x, v, i)=>x+v*(((p>>i)&1)?-1:1), 0),
            ops = l.reduce((x,_v,i)=>x+opec.charAt((p>>i)&1), "")
        if(!res.has(acc)) res.set(acc, []);
        res.get(acc).push(inm.rend(l, ops));
    }
    return res;
}
inm.translationDict = {
    "BigPrime": "19260817",
    "OK!": "114",
    "Koishi": "514",
    "LetMeSee": "364",
    "Go!": "19",
    "Baka": "9"
}
inm.translate = function(s, pos=0){//Not effective
    return $.map(this.translationDict, (v, k) => [[k, v]]).reduce((x, a) => x.replace(new RegExp(a[0^pos], "gi"), a[1^pos]), s);
}
inm.calculate = function(sl, sr) {
    this.results = [];this.can=0;
    return (new Promise((resolve, reject) =>
        resolve([sl, sr].map(this.digest).map(x => x.length?x:[0]).map(this.split))
    )).then(lr => this.dpProve(...lr));
}
inm.dpProve = (l, r) => l.forEach((val,k)=>r.has(k)&&val.forEach(v => r.get(k).forEach(x=>{++inm.can; inm.results.push(`${v} == ${x}`)})))
inm.selectText = function(text){
    if (document.body.createTextRange) {
        let range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        let selection = window.getSelection();
        let range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
inm.resizer = function () {
    $('.parallax-container').css({minHeight: (window.innerHeight - $('#mobile-nav').height()) + "px"});
    $('.parall-pic').css({width: window.innerWidth});
};
inm.startProve = function(){
    let sl=inm.eqL, sr=inm.eqR;
    this.setArgs(sl, sr);
    this.timedProve(sl, sr);
}
inm.forceProve = function(l, r){
    if(l.l){
        r=l.r;l=l.l;
    }
    [this.eqL, this.eqR] = [l, r];
    $("#left")[0].focus();
    $("#right")[0].focus();
    this.timedProve(l, r);
}
inm.timedProve = function(sl, sr){
    inm.started=true;
    console.time("DP Time");
    this.calculate(sl, sr)
    .then(_ => inm.results.push(inm.can?"Q.E.D.":"ん？"))
    .then(_ => console.timeEnd("DP Time"));
}
inm.startExample = function(){
    $("#begin").click()
    inm.setArgs("19260817", "114514");
    inm.forceProve("19260817", "114514")
}
inm.reset = function(){
    this.results = [], this.can = this.started = false
}
inm.setArgs = function(l, r){
    [l, r] = [l, r].map(s => this.translate(s, 1));
    history.pushState({l,r}, "", `#prove/${l}/${r}`);
}
inm.getArgs = function(tar){
    let ptn = /#prove\/(\d+)\/(\d+)/i, res=ptn.exec(this.translate(tar||location.hash));
    return res && res.length === 3 && res.slice(1);
}
$&&$(function(){
    $(".button-collapse").sideNav();
    $(window).resize(inm.resizer(),inm.resizer);
    addEventListener("popstate", e => {
        let args = inm.getArgs();
        args && inm.forceProve(...args);
    });
    inm.mainVue = new Vue({
        el: "#prove", data: {
            inm
        }
    });
    inm.mainVue.$nextTick(() => (new Promise(function(resolve, reject){
        let args = inm.getArgs();
        args ? resolve(args):reject(args);
    })).then(a =>inm.forceProve(...a)).then(() => $("#begin").click()), x=>x);
});