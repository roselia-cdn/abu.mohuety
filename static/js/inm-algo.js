"use strict";
window.inm = {};
inm.algo = {
    operPrio(c){
        switch (c){
            case "*":
            case "/": return 1;
            case "+":
            case "-": return 2;
            default: return 0;
        }
    },
    treeWithLeavesOf(n, leaves, defRoot, leafP=0){
        let rootC=n-1, res=new NaiveExpr(defRoot), que=[res], queL=0, queH=1;
        while (queL<queH){
            let cur=que[queL++];
            if(rootC){
                cur.insertL(defRoot);
                cur.insertR(defRoot);
                que[queH++]=cur.lch; que[queH++]=cur.rch;
                --rootC;
            }else break;
        }
        (function fill(x) {
            x.lch && fill(x.lch);
            if(!(x.lch||x.rch)) x.val = leaves[leafP++];
            x.rch && fill(x.rch);
        })(res);
        return res;
    },
    enumExpression(xs){
        let res=new Map(), ops="+-*/";
        let calTree = this.treeWithLeavesOf(xs.length, xs, '+');
        for(let p=0;p<1<<(xs.length-1<<1);++p){
            let fops="";
            for(let c=p, i=1;i<xs.length;++i, c>>=2){
                fops += ops.charAt(c&3);
            }
            calTree.fillRootsWith(fops);
            let ans = calTree.calculate();
            if(!isNaN(ans)) {
                if(!res.has(ans)) res.set(ans, []);
                res.get(ans).push(calTree.expression());
            }
        }
        return res;
    }
};
class NaiveExpr{
    constructor(val){
        this.lch = null;
        this.rch = null;
        this.val = val;
    }
    insertL(x){
        this.lch = new NaiveExpr(x);
    }
    insertR(x){
        this.rch = new NaiveExpr(x);
    }
    calculate(){
        let x = parseInt(this.val);
        if(!isNaN(x)){
            return x;
        }
        return (new Function("a", "b", `return a${this.val}b`))(this.lch.calculate(), this.rch.calculate());
    }
    expression(){
        let prio=inm.algo.operPrio;
        let resl="",resr="",prl=0,prr=0,prm=prio(this.val);
        if(this.lch){
            prl=prio(this.lch.val);
            resl = this.lch.expression();
        }
        if(this.rch){
            prr = prio(this.rch.val);
            resr = this.rch.expression();
        }
        if(prm<prl) resl = `(${resl})`;
        if(prm<prr||((this.val==='-'||this.val==='/')&&prio(this.rch.val))) resr = `(${resr})`;
        return resl+this.val+resr;
    }
    fillRootsWith(roots, rootP=0){
        let acc=0;
        if(this.lch||this.rch) {this.val = roots[rootP]; acc=1;}
        this.lch && (acc += this.lch.fillRootsWith(roots, rootP+acc));
        this.rch && (acc += this.rch.fillRootsWith(roots, rootP+acc));
        return acc;
    }
}