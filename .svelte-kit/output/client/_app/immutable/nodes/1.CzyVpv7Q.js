import{s as S,e as _,t as f,a as x,c as d,b as g,u as h,f as u,d as j,i as m,j as v,v as $,n as E,D as q}from"../chunks/scheduler.Bt1ZmQP3.js";import{S as y,i as C}from"../chunks/index.BTw-nfef.js";import{s as D}from"../chunks/entry.C5NOW2QF.js";const H=()=>{const s=D;return{page:{subscribe:s.page.subscribe},navigating:{subscribe:s.navigating.subscribe},updated:s.updated}},P={subscribe(s){return H().page.subscribe(s)}};function k(s){var b;let t,r=s[0].status+"",o,n,i,c=((b=s[0].error)==null?void 0:b.message)+"",l;return{c(){t=_("h1"),o=f(r),n=x(),i=_("p"),l=f(c)},l(e){t=d(e,"H1",{});var a=g(t);o=h(a,r),a.forEach(u),n=j(e),i=d(e,"P",{});var p=g(i);l=h(p,c),p.forEach(u)},m(e,a){m(e,t,a),v(t,o),m(e,n,a),m(e,i,a),v(i,l)},p(e,[a]){var p;a&1&&r!==(r=e[0].status+"")&&$(o,r),a&1&&c!==(c=((p=e[0].error)==null?void 0:p.message)+"")&&$(l,c)},i:E,o:E,d(e){e&&(u(t),u(n),u(i))}}}function w(s,t,r){let o;return q(s,P,n=>r(0,o=n)),[o]}let F=class extends y{constructor(t){super(),C(this,t,w,k,S,{})}};export{F as component};
