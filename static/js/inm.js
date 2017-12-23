"use strict";
window.inm={
    results: [], can:false, started: false
};
inm.rend=(l,o) => l.map((v, k) => `${o[k]}${v}`).join('').substring((o.charAt(0)==='+')+0);

inm.prove=function(l,r,report,pl,pr,opl,opr,vl,vr){
    pl=pl||0;pr=pr||0;opl=opl||"";opr=opr||"";vl=vl||0;vr=vr||0;
    if(l.length === pl && r.length === pr)
        return vl===vr?(report && report(`${this.rend(l, opl)} == ${this.rend(r, opr)}`),1):0;
    return pl<l.length?(
	    this.prove(r, l, report, pr, pl+1, opr, opl+"+", vr, vl+l[pl])+
	    this.prove(r, l, report, pr, pl+1, opr, opl+"-", vr, vl-l[pl])):
	    this.prove(r,l, report, pr, pl, opr, opl, vr, vl);
}
inm.digest = s => [].map.call(s, x => parseInt(x)).filter(x=>x>=0);
inm.cal=function(sl, sr){
    this.results = [];this.can=false;
    let c = this.prove(...[sl,sr].map(this.digest).map(x => x.length?x:[0]), r => inm.results.push(r));
    this.can=c;
}
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
    inm.started=true;
    inm.cal($("#left").val(), $("#right").val())
    inm.results.push(inm.can?"Q.E.D.":"ん？")
    
}
inm.startExample = function(){
    $("#begin").click()
    $("#left").val("19260817")[0].focus()
    $("#right").val("114514")[0].focus()
    inm.startProve()
}
inm.reset = function(){
    this.results = [], this.can = this.started = false
}
$&&$(function(){
    $(".button-collapse").sideNav();
    $('.parallax').parallax();
    $(window).resize(inm.resizer(),inm.resizer);
    new Vue({
        el: "#main", data: {
            inm
        }
    })
});