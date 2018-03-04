"use strict";
window.inm=$.extend(window.inm||{}, {
    results: [], can:false, started: false, eqL:"", eqR: "114514", eqLim: "114",
    showAll: true
});
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
    let mergeFunc = [this.dpBriefProve, this.dpProve][this.showAll+0].bind(this);
    this.results = [];this.can=0;
    return (new Promise((resolve, reject) =>
        resolve([sl, sr].map(this.digest).map(x => x.length?x:[0]).map(xs => this.algo.enumExpression(xs)))
    )).then(lr => mergeFunc(...lr));
    //this.dpProve(...[sl, sr].map(this.digest).map(x => x.length?x:[0]).map(this.split))
}
inm.dpProve = (l, r) => l.forEach((val,k)=>(inm.can < inm.eqLim || 0 == inm.eqLim)&&r.has(k)&&val.forEach(v => r.get(k).forEach(x=>{if(inm.can < inm.eqLim || 0 == inm.eqLim){++inm.can; inm.results.push(`${v} == ${x}`)}})));
inm.dpBriefProve = (l, r) => l.forEach((val, k) => {
    if(r.has(k)){
        let x = r.get(k);
        inm.results.push(`${val[0]} == ${x[0]} == ${parseInt(k) == k?k:k.toFixed(2)}`);
        inm.can += val.length * x.length;
    }
})
inm.digest = s => [].map.call(s, x => parseInt(x)).filter(x=>x>=0);
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
inm.zeroModal = () => $("#modal-zero").modal().modal("open");
inm.startProve = function(skipLim){
    if(!skipLim && inm.eqLim == 0 && this.showAll){
        return this.zeroModal();
    }
    let sl=inm.eqL, sr=inm.eqR;
    this.setArgs(sl, sr, inm.showAll && inm.eqLim);
    this.timedProve(sl, sr);
}
inm.forceProve = function(l, r, m){
    if(l.l){
        r=l.r;l=l.l;
    }
    this.eqL = l;this.eqR=r;
    m=="brief"?(this.showAll=false):(this.eqLim=m, this.showAll = true);
    Materialize.updateTextFields();
    if(m==0) return this.zeroModal();
    this.timedProve(l, r);
};
inm.timedProve = function(sl, sr){
    inm.started=true;
    console.time("Algorithm Time");
    this.calculate(sl, sr)
        .then(_ => inm.results.push(inm.can?"Q.E.D.":"ん？"))
        .then(_ => console.timeEnd("Algorithm Time"));
}
inm.startExample = function(){
    inm.setArgs("19260817", "114514", "114");
    $("#begin").click();
    inm.forceProve("19260817", "114514", "114");
    Materialize.updateTextFields();
}
inm.reset = function(){
    this.results = [], this.can = this.started = false
}
inm.setArgs = function(l, r, m){
    [l, r, m] = [l, r, m].slice(0, 3 - (m == false)).map(s => this.translate(s, 1));
    m = m || "brief";
    history.pushState({l,r}, "", `#prove/${l}/${r}/${m}`);
}
inm.getArgs = function(tar){
    let ptn = /#prove\/(\d+)\/(\d+)\/(brief|\d+)/i, res=ptn.exec(this.translate(tar||location.hash));
    return res && res.length === 4 && res.slice(1);
}
$&&$(function(){
    $(".button-collapse").sideNav();
    $(window).resize(inm.resizer(),inm.resizer);
    addEventListener("popstate", e => {
        let args = inm.getArgs();
        args && ($("#begin").click(), inm.forceProve(...args));
    });
    inm.mainVue = new Vue({
        el: "#prove", data: {
            inm
        }
    });
    inm.mainVue.$nextTick(() => (new Promise(function(resolve, reject){
        let args = inm.getArgs();
        args ? resolve(args):reject(args);
    })).then(a =>inm.forceProve(...a)).then(() => $("#begin").click(), _=>_));
});