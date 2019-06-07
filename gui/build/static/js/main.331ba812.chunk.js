(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{40:function(t,e,n){t.exports=n(78)},78:function(t,e,n){"use strict";n.r(e);var a=n(0),r=n.n(a),s=n(22),o=n.n(s),i=n(82),c=n(83),u=n(84),l=n(79),p=function(t){return r.a.createElement(r.a.Fragment,null,r.a.createElement(u.a,{bg:"dark",variant:"dark"},r.a.createElement(u.a.Brand,{href:""},r.a.createElement("img",{alt:"",src:"./logo.png",width:"30",height:"30",className:"d-inline-block align-top mr-4"}),"High kick")),r.a.createElement(l.a,null,t.children))},d=n(2),h=n.n(d),f=n(6),m=n(8),b=n(9),v=n(14),y=n(13),j=n(15),w=function(){function t(e){Object(m.a)(this,t),this.id=0,this.type="",this.path="",this.sid="",this.input="",this.output="",this.status="initial",this.createdAt="",this.childs=[],e.id&&(this.id=e.id),e.type&&(this.type=e.type),e.path&&(this.path=e.path),e.sid&&(this.sid=e.sid),e.input&&(this.input=e.input),e.output&&(this.output=e.output),e.status&&(this.status=e.status),e.createdAt&&(this.createdAt=e.createdAt),e.childs&&(this.childs=e.childs)}return Object(b.a)(t,[{key:"isRoot",value:function(){return""===this.path}},{key:"parentID",value:function(){if(this.isRoot())return null;var t=this.path.split("/").map(function(t){return parseInt(t)});return t[t.length-1]}}],[{key:"deserialize",value:function(e){return new t(e)}}]),t}(),g=window.location,k=g.protocol,O=g.hostname,x="".concat(k,"//").concat(O,":8000/highkick"),E={URLS:{jobs:{job:function(t){return"".concat(x,"/jobs/").concat(t)},retry:function(t){return"".concat(x,"/jobs/").concat(t,"/retry")},subtree:function(t){return"".concat(x,"/jobs/").concat(t,"/subtree")}},jobRoots:{index:"".concat(x,"/job_roots")},jobLogs:{index:function(t){return"".concat(x,"/jobs/").concat(t,"/logs")}}}},L=n(39),S=n.n(L),N={Accept:"application/json","Content-Type":"application/json"};function I(t,e){return R.apply(this,arguments)}function R(){return(R=Object(f.a)(h.a.mark(function t(e,n){var a,r,s,o,i,c,u,l,p,d=arguments;return h.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(a=d.length>2&&void 0!==d[2]?d[2]:null,r=Object.assign({},N),s=Object.assign({},a),Object.values(s).some(function(t){return t instanceof File})){for(r["Content-Type"]="multipart/form-data",o=new FormData,i=0,c=Object.keys(s);i<c.length;i++)u=c[i],o.append(u,s[u]);s=o}return t.prev=5,t.next=8,S.a.request({method:e,url:n,data:s,headers:r,responseType:"json",params:"get"===e?s:void 0});case 8:l=t.sent,t.next=20;break;case 11:if(t.prev=11,t.t0=t.catch(5),t.t0.response){t.next=15;break}throw t.t0;case 15:if(422!==t.t0.response.status){t.next=19;break}throw(p=new Error("422 response")).__SERVER_SIDE_ERRORS__=t.t0.response.data.errors,p;case 19:throw t.t0;case 20:return t.abrupt("return",l.data);case 21:case"end":return t.stop()}},t,null,[[5,11]])}))).apply(this,arguments)}function U(){return(U=Object(f.a)(h.a.mark(function t(e){var n,a=arguments;return h.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=a.length>1&&void 0!==a[1]?a[1]:{},t.abrupt("return",I("get",e,n));case 2:case"end":return t.stop()}},t)}))).apply(this,arguments)}function C(){return(C=Object(f.a)(h.a.mark(function t(e){var n,a=arguments;return h.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=a.length>1&&void 0!==a[1]?a[1]:null,t.abrupt("return",I("post",e,n));case 2:case"end":return t.stop()}},t)}))).apply(this,arguments)}function z(){return(z=Object(f.a)(h.a.mark(function t(e){var n,a=arguments;return h.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=a.length>1&&void 0!==a[1]?a[1]:null,t.abrupt("return",I("put",e,n));case 2:case"end":return t.stop()}},t)}))).apply(this,arguments)}function A(){return(A=Object(f.a)(h.a.mark(function t(e){var n,a=arguments;return h.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=a.length>1&&void 0!==a[1]?a[1]:null,t.abrupt("return",I("delete",e,n));case 2:case"end":return t.stop()}},t)}))).apply(this,arguments)}var D={get:function(t){return U.apply(this,arguments)},post:function(t){return C.apply(this,arguments)},put:function(t){return z.apply(this,arguments)},del:function(t){return A.apply(this,arguments)}};var _={compose:function(t){var e=t.rootId,n=t.items,a=n.find(function(t){return t.id===e});if(!a)throw new Error("No root found");return function t(e){e.childs=n.filter(function(t){return t.parentID()===e.id});var a=!0,r=!1,s=void 0;try{for(var o,i=e.childs[Symbol.iterator]();!(a=(o=i.next()).done);a=!0)t(o.value)}catch(c){r=!0,s=c}finally{try{a||null==i.return||i.return()}finally{if(r)throw s}}}(a),a}};function J(){return(J=Object(f.a)(h.a.mark(function t(){var e,n;return h.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,D.get(E.URLS.jobRoots.index);case 2:return e=t.sent,n=e.map(w.deserialize),t.abrupt("return",n);case 5:case"end":return t.stop()}},t)}))).apply(this,arguments)}function T(){return(T=Object(f.a)(h.a.mark(function t(e){var n,a,r;return h.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,D.get(E.URLS.jobs.subtree(e.id));case 2:return n=t.sent,a=n.map(w.deserialize),r=_.compose({items:a,rootId:e.id}),t.abrupt("return",r);case 6:case"end":return t.stop()}},t)}))).apply(this,arguments)}function F(){return(F=Object(f.a)(h.a.mark(function t(e){return h.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,D.post(E.URLS.jobs.retry(e.id));case 2:case"end":return t.stop()}},t)}))).apply(this,arguments)}function B(){return(B=Object(f.a)(h.a.mark(function t(e){return h.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,D.del(E.URLS.jobs.job(e.id));case 2:case"end":return t.stop()}},t)}))).apply(this,arguments)}var W={loadRoots:function(){return J.apply(this,arguments)},updateJob:function(t){return T.apply(this,arguments)},retry:function(t){return F.apply(this,arguments)},destroy:function(t){return B.apply(this,arguments)}},q=n(12),H=n(24),M=n.n(H),V=n(80),Y=n(86),$=n(81),G=n(85),K=function(){function t(e){Object(m.a)(this,t),this.id=0,this.content="",this.createdAt="",e.id&&(this.id=e.id),e.content&&(this.content=e.content),e.createdAt&&(this.createdAt=e.createdAt)}return Object(b.a)(t,null,[{key:"deserialize",value:function(e){return new t(e)}}]),t}();function P(){return(P=Object(f.a)(h.a.mark(function t(e){var n,a;return h.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,D.get(E.URLS.jobLogs.index(e.id));case 2:return n=t.sent,a=n.map(K.deserialize).reverse(),t.abrupt("return",a);case 5:case"end":return t.stop()}},t)}))).apply(this,arguments)}var Q={loadLogs:function(t){return P.apply(this,arguments)}},X=function(t){function e(t){var n;return Object(m.a)(this,e),(n=Object(v.a)(this,Object(y.a)(e).call(this,t))).state={showLogs:!1,jobLogs:[]},n.updateItem=n.updateItem.bind(Object(q.a)(n)),n.showLogs=n.showLogs.bind(Object(q.a)(n)),n.retry=n.retry.bind(Object(q.a)(n)),n.destroy=n.destroy.bind(Object(q.a)(n)),n}return Object(j.a)(e,t),Object(b.a)(e,[{key:"render",value:function(){var t=this.props.job,e=""!==t.input?JSON.parse(t.input):{},n=""!==t.output?JSON.parse(t.output):{};return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"d-flex"},r.a.createElement("div",{className:"mr-2"},t.id),r.a.createElement("div",{className:"font-italic",style:{fontSize:"12px",maxWidth:"150px",overflow:"scroll"}},t.type),r.a.createElement("div",{className:"flex-fill d-flex flex-column"},r.a.createElement(M.a,{src:e,collapsed:!0,displayDataTypes:!1,enableClipboard:!1,style:{fontSize:10}}),r.a.createElement(M.a,{src:n,collapsed:!0,displayDataTypes:!1,enableClipboard:!1,style:{fontSize:10}})),r.a.createElement("div",{className:"mr-1"},this.renderStatus()),r.a.createElement("div",null,r.a.createElement(V.a,{size:"sm"},r.a.createElement(Y.a,{variant:"light",onClick:this.updateItem},"\ud83d\udc41"),r.a.createElement(Y.a,{variant:"light",className:"text-muted",onClick:this.showLogs},"Logs"),r.a.createElement(Y.a,{variant:"light",className:"text-success",onClick:this.retry},"\u21bb"),r.a.createElement(Y.a,{variant:"light",onClick:this.destroy},"\ud83d\uddd1")))),this.renderLogs())}},{key:"renderStatus",value:function(){var t=this.props.job.status;return r.a.createElement($.a,{variant:"failed"===t?"danger":"info"},t)}},{key:"renderLogs",value:function(){var t=this.state,e=t.showLogs,n=t.jobLogs;return e?r.a.createElement(G.a,{className:"mt-2 mb-2 bg-light",style:{fontSize:"12px",overflowY:"scroll"}},n.map(function(t){return r.a.createElement("div",{className:"d-flex",key:t.id},r.a.createElement("div",{style:{width:150}},t.createdAt),r.a.createElement("div",{className:"flex-fill"},t.content))})):null}},{key:"updateItem",value:function(){var t=this,e=this.props.job;Object(f.a)(h.a.mark(function n(){var a;return h.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,W.updateJob(e);case 2:a=n.sent,t.props.onItemUpdate(a);case 4:case"end":return n.stop()}},n)}))()}},{key:"showLogs",value:function(){var t=this,e=this.props.job,n=this.state.showLogs;n?this.setState({showLogs:!1}):Object(f.a)(h.a.mark(function n(){var a;return h.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,Q.loadLogs(e);case 2:a=n.sent,t.setState({showLogs:!0,jobLogs:a});case 4:case"end":return n.stop()}},n)}))()}},{key:"retry",value:function(){var t=this.props.job;!1!==window.confirm("Do you wanna to retry this job?")&&Object(f.a)(h.a.mark(function e(){return h.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,W.retry(t);case 2:case"end":return e.stop()}},e)}))()}},{key:"destroy",value:function(){var t=this.props.job;!1!==window.confirm("Do you wanna to destroy this job?")&&Object(f.a)(h.a.mark(function e(){return h.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,W.destroy(t);case 2:case"end":return e.stop()}},e)}))()}}]),e}(r.a.Component),Z={builder:function(t){return r.a.createElement(X,{job:t.item,onItemUpdate:t.onItemUpdate})}},tt=n(3),et=n.n(tt),nt=function(t){function e(t){var n;return Object(m.a)(this,e),(n=Object(v.a)(this,Object(y.a)(e).call(this,t))).state={item:t.item,opened:!t.item.isRoot()},n.toggle=n.toggle.bind(Object(q.a)(n)),n.onItemUpdate=n.onItemUpdate.bind(Object(q.a)(n)),n}return Object(j.a)(e,t),Object(b.a)(e,[{key:"render",value:function(){var t=this.props.builder,e=this.state,n=e.item,a=e.opened;return r.a.createElement("div",{className:"d-flex"},r.a.createElement("div",{style:{width:45}},r.a.createElement(Y.a,{variant:"light",size:"sm",onClick:this.toggle},a?"\u2198":"\u2197")),r.a.createElement("div",{className:"flex-fill"},t({item:n,onItemUpdate:this.onItemUpdate}),r.a.createElement("div",{className:et()({"d-none":!a})},r.a.createElement(at,{items:n.childs,builder:t}))))}},{key:"toggle",value:function(){this.setState({opened:!this.state.opened})}},{key:"onItemUpdate",value:function(t){this.setState({item:t,opened:!0})}}]),e}(r.a.Component),at=function(t){function e(){return Object(m.a)(this,e),Object(v.a)(this,Object(y.a)(e).apply(this,arguments))}return Object(j.a)(e,t),Object(b.a)(e,[{key:"render",value:function(){var t=this.props,e=t.items,n=t.builder;return r.a.createElement("ul",{className:et()("list-group","p-0")},e.map(function(t){return r.a.createElement("li",{className:"list-group-item p-0",key:t.id},r.a.createElement(nt,{item:t,builder:n}))}))}}]),e}(r.a.Component),rt=function(t){function e(t){var n;return Object(m.a)(this,e),(n=Object(v.a)(this,Object(y.a)(e).call(this,t))).state={loading:!0,roots:[]},n}return Object(j.a)(e,t),Object(b.a)(e,[{key:"componentDidMount",value:function(){var t=this;Object(f.a)(h.a.mark(function e(){var n;return h.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,W.loadRoots();case 2:n=e.sent,t.setState({loading:!1,roots:n});case 4:case"end":return e.stop()}},e)}))()}},{key:"render",value:function(){var t=this.state,e=t.loading,n=t.roots;return e?r.a.createElement("div",{className:"d-flex w-100 h-100"},r.a.createElement("div",{className:"m-auto"},"Loading")):r.a.createElement(at,{items:n,builder:Z.builder})}}]),e}(r.a.Component),st=function(){return r.a.createElement(p,null,r.a.createElement(i.a,null,r.a.createElement(c.a,{md:12,className:"pt-4"},r.a.createElement(rt,null))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(st,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})}},[[40,1,2]]]);
//# sourceMappingURL=main.331ba812.chunk.js.map