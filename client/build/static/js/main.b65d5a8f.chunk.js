(this.webpackJsonpclient2=this.webpackJsonpclient2||[]).push([[0],{61:function(e,t,n){e.exports=n(91)},91:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),i=n(20),o=n.n(i),s=n(8),c=n(10),u=n(12),l=n(13),p=n(16),d=n(4),f=n.n(d),h=n(7),m=function(){function e(t){for(var n in Object(s.a)(this,e),this.SID=void 0,this.Title=void 0,this.InputJSONSchema=void 0,t)this[n]=t[n]}return Object(c.a)(e,null,[{key:"deserialize",value:function(t){return new e(t)}}]),e}(),b=window.location,v=b.protocol,y=b.hostname,j=["".concat(v,"//").concat(y,":8000"),window.location.origin,window.location.origin][1],g="".concat(j,"/highkick"),E={URLS:{ws:"ws".concat("https:"===window.location.protocol?"s":"","://").concat(g.split("//")[1],"/ws"),jobs:{job:function(e){return"".concat(g,"/jobs/show/").concat(e)},retry:function(e){return"".concat(g,"/jobs/retry/").concat(e)},retryFailedLeaves:function(e){return"".concat(g,"/jobs/retry_failed_leaves/").concat(e)},subtree:function(e){return"".concat(g,"/jobs/subtree/").concat(e)},input:function(e){return"".concat(g,"/jobs/input/").concat(e)},run:"".concat(g,"/jobs/run"),destroy:function(e){return"".concat(g,"/jobs/delete/").concat(e)}},jobRoots:{index:"".concat(g,"/job_roots/index")},jobLogs:{index:function(e){return"".concat(g,"/job_logs/index/").concat(e)}},jobMetas:{index:"".concat(g,"/job_metas/index")}}},O=n(50),w=n.n(O),x={Accept:"application/json","Content-Type":"application/json"};function k(e,t){return S.apply(this,arguments)}function S(){return(S=Object(h.a)(f.a.mark((function e(t,n){var a,r,i,o,s,c,u,l,p,d=arguments;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a=d.length>2&&void 0!==d[2]?d[2]:null,r=Object.assign({},x),i=Object.assign({},a),Object.values(i).some((function(e){return e instanceof File}))){for(r["Content-Type"]="multipart/form-data",o=new FormData,s=0,c=Object.keys(i);s<c.length;s++)u=c[s],o.append(u,i[u]);i=o}return e.prev=5,e.next=8,w.a.request({method:t,url:n,data:i,headers:r,responseType:"json",params:"get"===t?i:void 0});case 8:l=e.sent,e.next=20;break;case 11:if(e.prev=11,e.t0=e.catch(5),e.t0.response){e.next=15;break}throw e.t0;case 15:if(422!==e.t0.response.status){e.next=19;break}throw(p=new Error("422 response")).__SERVER_SIDE_ERRORS__=e.t0.response.data.errors,p;case 19:throw e.t0;case 20:return e.abrupt("return",l.data);case 21:case"end":return e.stop()}}),e,null,[[5,11]])})))).apply(this,arguments)}function N(){return(N=Object(h.a)(f.a.mark((function e(t){var n,a=arguments;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=a.length>1&&void 0!==a[1]?a[1]:{},e.abrupt("return",k("get",t,n));case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function I(){return(I=Object(h.a)(f.a.mark((function e(t){var n,a=arguments;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=a.length>1&&void 0!==a[1]?a[1]:null,e.abrupt("return",k("post",t,n));case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function C(){return(C=Object(h.a)(f.a.mark((function e(t){var n,a=arguments;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=a.length>1&&void 0!==a[1]?a[1]:null,e.abrupt("return",k("put",t,n));case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function L(){return(L=Object(h.a)(f.a.mark((function e(t){var n,a=arguments;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=a.length>1&&void 0!==a[1]?a[1]:null,e.abrupt("return",k("delete",t,n));case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var _={get:function(e){return N.apply(this,arguments)},post:function(e){return I.apply(this,arguments)},put:function(e){return C.apply(this,arguments)},del:function(e){return L.apply(this,arguments)}};function D(){return(D=Object(h.a)(f.a.mark((function e(){var t,n,a;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=E.URLS.jobMetas.index,e.next=3,_.get(t,{});case 3:return n=e.sent,a=n.items.map(m.deserialize),e.abrupt("return",a);case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var P={index:function(){return D.apply(this,arguments)}},J="JOB_METAS/INDEX",R=function e(t){Object(s.a)(this,e),this.items=t,this.type=J};var T={index:function(){return function(){var e=Object(h.a)(f.a.mark((function e(t,n){var a;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,P.index();case 2:a=e.sent,t(new R(a));case 4:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()}},M=n(108),F=n(55),A=n(110),U=n(93),z=function(e){var t=e.widget||!1;return r.a.createElement(r.a.Fragment,null,r.a.createElement(A.a,{bg:"light",variant:"light",className:"border-dark border-bottom"},r.a.createElement(A.a.Brand,{href:"",className:"p-0"},r.a.createElement("img",{src:"favicon.ico",height:"32",width:"32"}),"\xa0",r.a.createElement("a",{href:"/",className:"text-dark"},"Highkick"))),r.a.createElement(U.a,{className:t?"m-0 p-0":void 0},e.children))},B=n(9),V=n(11),X=function(){function e(t){for(var n in Object(s.a)(this,e),this.id=0,this.type="",this.path="",this.sid="",this.input="",this.output="",this.status="initial",this.treeStatus=void 0,this.createdAt="",this.cron=void 0,this.logsCount=0,this.childs=[],t)this[n]=t[n]}return Object(c.a)(e,[{key:"isRoot",value:function(){return""===this.path}},{key:"isPeriodical",value:function(){return void 0!==this.cron}},{key:"parentID",value:function(){if(this.isRoot())return null;var e=this.path.split("/").map((function(e){return parseInt(e)}));return e[e.length-1]}},{key:"digest",value:function(){var e=this.childs.map((function(e){return e.digest()})).join();return"".concat(this.id).concat(this.status).concat(this.treeStatus).concat(e)}}],[{key:"deserialize",value:function(t){return new e(t)}}]),e}(),q=n(58);var Y={compose:function(e){var t=e.rootId,n=e.items,a=n.find((function(e){return e.id===t}));if(!a)throw new Error("No root found");return function e(t){t.childs=n.filter((function(e){return e.parentID()===t.id}));var a,r=Object(q.a)(t.childs);try{for(r.s();!(a=r.n()).done;){e(a.value)}}catch(i){r.e(i)}finally{r.f()}}(a),a}};function G(){return(G=Object(h.a)(f.a.mark((function e(t,n){var a,r,i,o;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=Object.assign({},n,{filters:t}),r=E.URLS.jobRoots.index,e.next=4,_.get(r,a);case 4:return i=e.sent,o=i.map(X.deserialize),e.abrupt("return",o);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function H(){return(H=Object(h.a)(f.a.mark((function e(t){var n,a,r;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,_.get(E.URLS.jobs.subtree(t.id));case 2:return n=e.sent,a=n.map(X.deserialize),r=Y.compose({items:a,rootId:t.id}),e.abrupt("return",r);case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function W(){return(W=Object(h.a)(f.a.mark((function e(t){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,_.post(E.URLS.jobs.retry(t.id));case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function $(){return($=Object(h.a)(f.a.mark((function e(t){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,_.post(E.URLS.jobs.retryFailedLeaves(t.id));case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function K(){return(K=Object(h.a)(f.a.mark((function e(t){var n;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=E.URLS.jobs.destroy(t.id),e.next=3,_.del(n);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function Q(){return(Q=Object(h.a)(f.a.mark((function e(t){var n,a;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=E.URLS.jobs.input(t.id),e.next=3,_.get(n);case 3:return a=e.sent,e.abrupt("return",a);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function Z(){return(Z=Object(h.a)(f.a.mark((function e(t,n){var a,r;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=E.URLS.jobs.run,e.next=3,_.post(a,{SID:t,Input:n});case 3:return r=e.sent,e.abrupt("return",r);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var ee={loadRoots:function(e,t){return G.apply(this,arguments)},loadSubtree:function(e){return H.apply(this,arguments)},retry:function(e){return W.apply(this,arguments)},retryFailedLeaves:function(e){return $.apply(this,arguments)},destroy:function(e){return K.apply(this,arguments)},treeStatus:function e(t){var n=t.childs.map(e);return n.push(t.status),t.treeStatus&&n.push(t.treeStatus),n.some((function(e){return"processing"===e}))?"processing":n.some((function(e){return"failed"===e}))?"failed":n.every((function(e){return"completed"===e}))?"completed":n.every((function(e){return"initial"===e}))?"initial":"processing"},getInput:function(e){return Q.apply(this,arguments)},runJob:function(e,t){return Z.apply(this,arguments)}},te=function e(t){Object(s.a)(this,e),this.job=t,this.type="JOBS/UPDATE"},ne=function e(t){Object(s.a)(this,e),this.jobs=t,this.type="JOBS/INDEX"},ae=function e(t){Object(s.a)(this,e),this.job=t,this.type="JOBS/DESTROY"};var re={index:function(e,t){return function(){var n=Object(h.a)(f.a.mark((function n(a,r){var i;return f.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,ee.loadRoots(e,t);case 2:i=n.sent,a(new ne(i));case 4:case"end":return n.stop()}}),n)})));return function(e,t){return n.apply(this,arguments)}}()},loadSubtree:function(e){return function(){var t=Object(h.a)(f.a.mark((function t(n,a){var r;return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,ee.loadSubtree(e);case 2:r=t.sent,n(new te(r));case 4:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()},destroy:function(e){return function(){var t=Object(h.a)(f.a.mark((function t(n,a){return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,ee.destroy(e);case 2:n(new ae(e));case 3:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()},getInput:function(e){return function(){var t=Object(h.a)(f.a.mark((function t(n,a){var r;return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,ee.getInput(e);case 2:return r=t.sent,t.abrupt("return",r);case 4:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()},run:function(e,t){return function(){var n=Object(h.a)(f.a.mark((function n(a,r){var i;return f.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,ee.runJob(e,t);case 2:return i=n.sent,n.abrupt("return",i);case 4:case"end":return n.stop()}}),n)})));return function(e,t){return n.apply(this,arguments)}}()}},ie=n(53),oe=n.n(ie),se=n(111),ce=n(98),ue=n(99),le=n(100),pe=n(101),de=n(102),fe=n(103),he=n(104),me=n(105),be=n(94),ve=n(95),ye=n(96),je=n(97),ge=function(e){switch(e.status){case"initial":return r.a.createElement(be.a,null);case"processing":return r.a.createElement(ve.a,null);case"failed":return r.a.createElement(ye.a,null);case"completed":return r.a.createElement(je.a,null)}},Ee=function(){function e(t){Object(s.a)(this,e),this.id=0,this.content="",this.createdAt="",t.id&&(this.id=t.id),t.content&&(this.content=t.content),t.createdAt&&(this.createdAt=t.createdAt)}return Object(c.a)(e,null,[{key:"deserialize",value:function(t){return new e(t)}}]),e}();function Oe(){return(Oe=Object(h.a)(f.a.mark((function e(t){var n,a;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,_.get(E.URLS.jobLogs.index(t.id));case 2:return n=e.sent,a=n.map(Ee.deserialize).reverse(),e.abrupt("return",a);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var we={loadLogs:function(e){return Oe.apply(this,arguments)}},xe=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(s.a)(this,n),(a=t.call(this,e)).state={showLogs:!1,jobLogs:[],input:null,showInputOutput:!1},a.loadItem=a.loadItem.bind(Object(V.a)(a)),a.showLogs=a.showLogs.bind(Object(V.a)(a)),a.retry=a.retry.bind(Object(V.a)(a)),a.retryFailedLeaves=a.retryFailedLeaves.bind(Object(V.a)(a)),a.destroy=a.destroy.bind(Object(V.a)(a)),a.showInputOutput=a.showInputOutput.bind(Object(V.a)(a)),a}return Object(c.a)(n,[{key:"render",value:function(){var e=this,t=this.props,n=t.item,a=t.expanded,i=t.jobMetas,o=this.state,s=o.input,c=o.jobLogs,u=""!==n.output?JSON.parse(n.output):{},l=(i||[]).find((function(e){return e.SID===n.type})),p=ee.treeStatus(n);return r.a.createElement("div",{className:"p-0 m-0",style:{display:"grid",gridTemplateAreas:"'header actions' 'details details'",gridTemplateColumns:"1fr 170px",gridGap:"2px",background:"failed"===p?"#fcede8":"processing"===p?"#e8f4fc":"#f8f9fa"},key:JSON.stringify(l)},r.a.createElement("div",{style:{gridArea:"header",cursor:"pointer"},onClick:this.loadItem,className:"d-flex align-items-center"},this.renderStatus(),r.a.createElement("span",{className:"ml-1 mr-1"},(null===l||void 0===l?void 0:l.Title)||n.sid),r.a.createElement("small",{className:"text-muted ml-2 mr-2"},n.id),r.a.createElement("span",{className:"flex-fill"},a?r.a.createElement(ce.a,null):r.a.createElement(ue.a,null)),r.a.createElement("small",{className:"text-muted"},oe()(n.createdAt).fromNow())),r.a.createElement("div",{style:{gridArea:"actions"},className:"btn-group btn-group-sm"},r.a.createElement(se.a,{variant:"light",className:this.state.showInputOutput?void 0:"text-muted",onClick:function(){return e.showInputOutput(!e.state.showInputOutput)}},r.a.createElement(le.a,null)),n.logsCount>0&&r.a.createElement(se.a,{variant:"light",className:this.state.showLogs?void 0:"text-muted",onClick:function(){return e.showLogs(!e.state.showLogs)}},r.a.createElement(pe.a,null)),r.a.createElement(se.a,{variant:"light",onClick:this.retry},r.a.createElement(de.a,null)),r.a.createElement(se.a,{variant:"light",onClick:this.destroy},r.a.createElement(fe.a,null))),r.a.createElement("div",{style:{gridArea:"details"},className:"d-flex flex-column"},r.a.createElement("div",{style:{display:this.state.showInputOutput?"flex":"none"}},r.a.createElement("div",{className:"d-flex align-items-center"},r.a.createElement(he.a,{className:"m-2",style:{zoom:1.5}}),r.a.createElement("code",{style:{fontSize:10}},JSON.stringify(s,null,2))),r.a.createElement("div",{className:"d-flex align-items-center"},r.a.createElement(me.a,{className:"m-2",style:{zoom:1.5}}),r.a.createElement("code",{style:{fontSize:10}},JSON.stringify(u,null,2)))),r.a.createElement("div",{style:{display:this.state.showLogs?"block":"none"}},c.map((function(e){return r.a.createElement("div",{className:"alert alert-primary p-0 d-flex",key:e.id},r.a.createElement("small",{className:"text-muted mr-2"},e.createdAt),r.a.createElement("code",{className:"flex-fill"},e.content))})))))}},{key:"renderStatus",value:function(){var e=this.props.item,t=ee.treeStatus(e);return e.status===t?r.a.createElement(ge,{status:e.status}):[r.a.createElement(ge,{status:t}),r.a.createElement(ge,{status:e.status})]}},{key:"loadItem",value:function(){var e=Object(h.a)(f.a.mark((function e(){var t,n;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=this.props,n=t.item,t.expanded){e.next=7;break}return e.next=4,this.props.loadSubtree(n);case 4:this.props.onExpand(!0),e.next=8;break;case 7:this.props.onExpand(!1);case 8:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"showLogs",value:function(){var e=Object(h.a)(f.a.mark((function e(t){var n,a;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=this.props.item,!t){e.next=8;break}return e.next=4,we.loadLogs(n);case 4:a=e.sent,this.setState({showLogs:t,jobLogs:a}),e.next=9;break;case 8:this.setState({showLogs:t});case 9:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"retry",value:function(){var e=this.props.item;!1!==window.confirm("Do you wanna to retry this job?")&&Object(h.a)(f.a.mark((function t(){return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,ee.retry(e);case 2:case"end":return t.stop()}}),t)})))()}},{key:"retryFailedLeaves",value:function(){var e=this.props.item;!1!==window.confirm("Do you wanna to retry failed children of this job?")&&Object(h.a)(f.a.mark((function t(){return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,ee.retryFailedLeaves(e);case 2:case"end":return t.stop()}}),t)})))()}},{key:"destroy",value:function(){!1!==window.confirm("Do you wanna to destroy this job?")&&this.props.destroy()}},{key:"showInputOutput",value:function(){var e=Object(h.a)(f.a.mark((function e(t){var n;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!0!==t){e.next=5;break}return e.next=3,this.props.getInput();case 3:n=e.sent,this.setState({input:n});case 5:this.setState({showInputOutput:t});case 6:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()}]),n}(r.a.Component),ke=p.c((function(e,t){return{jobMetas:e.jobMetas}}),(function(e,t){var n=t.item;return{loadSubtree:function(t){return e(re.loadSubtree(t))},destroy:function(){return e(re.destroy(n))},getInput:function(){return e(re.getInput(n))}}}))(xe),Se=n(5),Ne=n.n(Se),Ie=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(s.a)(this,n),(a=t.call(this,e)).state={expanded:!1},a.onExpand=a.onExpand.bind(Object(V.a)(a)),a}return Object(c.a)(n,[{key:"render",value:function(){var e=this.props,t=e.item,n=e.builder,a=this.state.expanded;return r.a.createElement("li",{className:"list-group-item p-0 border-0 m-0 mb-1",key:t.digest()},r.a.createElement(n,{item:t,onExpand:this.onExpand,expanded:a}),r.a.createElement("div",{className:Ne()({"d-none":!a,"mt-1 ml-4":!0})},r.a.createElement(Ce,{items:t.childs,builder:n})))}},{key:"onExpand",value:function(e){this.setState({expanded:e})}}]),n}(r.a.Component),Ce=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(){return Object(s.a)(this,n),t.apply(this,arguments)}return Object(c.a)(n,[{key:"render",value:function(){var e=this.props,t=e.items,n=e.builder;return r.a.createElement("ul",{className:Ne()("list-group","list-group-flush","p-0")},t.map((function(e){return r.a.createElement(Ie,{key:e.id,item:e,builder:n})})))}}]),n}(r.a.Component),Le=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(s.a)(this,n),(a=t.call(this,e)).onPageLinkClick=a.onPageLinkClick.bind(Object(V.a)(a)),a}return Object(c.a)(n,[{key:"render",value:function(){var e=this,t=this.props.maxPage;return r.a.createElement("nav",null,r.a.createElement("ul",{className:"pagination pagination-sm justify-content-center m-1"},Array.apply(null,Array(t)).map((function(t,n){return e.renderPageLink(n+1)}))))}},{key:"renderPageLink",value:function(e){var t=this,n=this.props.page===e;return r.a.createElement("li",{className:"page-item",key:e,style:{cursor:"pointer"}},n&&r.a.createElement("span",{className:"page-link text-muted",style:{border:"none"}},e),!n&&r.a.createElement("a",{className:"page-link",style:{border:"none"},href:"#",onClick:function(n){return t.onPageLinkClick(n,e)}},e))}},{key:"onPageLinkClick",value:function(e,t){e.preventDefault(),this.props.onPageChange(t)}}]),n}(r.a.Component),_e=n(54),De=n(106),Pe=n(107),Je=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(s.a)(this,n),(a=t.call(this,e)).onChange=a.onChange.bind(Object(V.a)(a)),a}return Object(c.a)(n,[{key:"render",value:function(){var e=this.props.value;return r.a.createElement("form",{onChange:this.onChange,className:"jumbotron p-2 m-1"},r.a.createElement("div",{className:"form-row"},r.a.createElement("div",{className:"col-1"},r.a.createElement(De.a,null)),r.a.createElement("div",{className:"col-6"},r.a.createElement("div",{className:"form-check form-check-inline"},r.a.createElement("input",{className:"form-check-input",type:"radio",name:"IsPeriodical",id:"IsPeriodicalTrue",value:"1",defaultChecked:!0===e.IsPeriodical}),r.a.createElement("label",{className:"form-check-label",htmlFor:"IsPeriodicalTrue"},"Periodical")),r.a.createElement("div",{className:"form-check form-check-inline"},r.a.createElement("input",{className:"form-check-input",type:"radio",name:"IsPeriodical",id:"IsPeriodicalFalse",value:"0",defaultChecked:!1===e.IsPeriodical}),r.a.createElement("label",{className:"form-check-label",htmlFor:"IsPeriodicalFalse"},"Non periodical"))),r.a.createElement("div",{className:"col-4"},r.a.createElement("input",{type:"text",className:"form-control form-control-sm",name:"Type",placeholder:"Job",value:e.Type})),r.a.createElement("div",{className:"col-1"},r.a.createElement(_e.a,{to:"/new",className:"btn btn-light"},r.a.createElement(Pe.a,null)))))}},{key:"onChange",value:function(e){var t=new FormData(e.currentTarget),n={};"1"===t.get("IsPeriodical")&&(n.IsPeriodical=!0),"0"===t.get("IsPeriodical")&&(n.IsPeriodical=!1),""!==t.get("Type")&&(n.Type=t.get("Type")),this.props.onChange(n)}}]),n}(r.a.Component),Re=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(s.a)(this,n),(a=t.call(this,e)).state={loading:!0,page:1,maxPage:1,filters:{IsPeriodical:!1}},a.onPageChange=a.onPageChange.bind(Object(V.a)(a)),a.onFiltersChange=a.onFiltersChange.bind(Object(V.a)(a)),a}return Object(c.a)(n,[{key:"componentDidMount",value:function(){this.loadItems(1).then((function(){}))}},{key:"render",value:function(){var e=this.props.roots,t=this.state,n=t.loading,a=t.page,i=t.maxPage;return n?r.a.createElement("div",{className:"d-flex w-100 h-100"},r.a.createElement("div",{className:"m-auto"},"Loading")):r.a.createElement(r.a.Fragment,null,r.a.createElement(Je,{value:this.state.filters,onChange:this.onFiltersChange}),r.a.createElement(Ce,{items:e||[],builder:ke}),r.a.createElement(Le,{page:a,maxPage:i,onPageChange:this.onPageChange}))}},{key:"onPageChange",value:function(e){this.loadItems(e).then((function(){}))}},{key:"loadItems",value:function(){var e=Object(h.a)(f.a.mark((function e(t){var n,a,r;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=this.state,a=n.filters,r=n.maxPage,e.next=3,this.props.index(a,{page:t});case 3:this.setState({loading:!1,page:t,maxPage:Math.max(r,t+1)});case 4:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"onFiltersChange",value:function(e){var t=this;this.setState({filters:e},(function(){t.loadItems(1).then((function(){}))}))}}]),n}(r.a.Component),Te=p.c((function(e,t){return{roots:e.jobs,jobMetas:e.jobMetas}}),(function(e,t){return{index:function(t,n){return e(re.index(t,n))}}}))(Re),Me=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(){return Object(s.a)(this,n),t.apply(this,arguments)}return Object(c.a)(n,[{key:"render",value:function(){return r.a.createElement(Te,null)}}]),n}(r.a.Component),Fe=p.c((function(e,t){return{}}),(function(e,t){return{}}))(Me),Ae=n(109),Ue=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(s.a)(this,n),(a=t.call(this,e)).elRef=r.a.createRef(),a.jsonEditor=void 0,a.onChange=a.onChange.bind(Object(V.a)(a)),a}return Object(c.a)(n,[{key:"componentDidMount",value:function(){this.jsonEditor=new window.JSONEditor(this.elRef.current,{theme:"bootstrap4",schema:this.props.jsonSchema,disable_array_reorder:!0,array_controls_top:!0,form_name_root:this.props.label,no_additional_properties:!0,show_errors:"always",object_layout:"table",remove_empty_properties:!1}),this.jsonEditor.setValue(this.props.defaultValue),this.jsonEditor.on("change",this.onChange)}},{key:"render",value:function(){return r.a.createElement("div",{ref:this.elRef})}},{key:"onChange",value:function(){var e=this.jsonEditor.getValue();this.props.onChange(e)}}]),n}(r.a.Component),ze=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(s.a)(this,n),(a=t.call(this,e)).state={},a.onJobSIDChange=a.onJobSIDChange.bind(Object(V.a)(a)),a.onSubmit=a.onSubmit.bind(Object(V.a)(a)),a}return Object(c.a)(n,[{key:"render",value:function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("h3",null,"Run new job"),r.a.createElement(Ae.a,{onSubmit:this.onSubmit},r.a.createElement(Ae.a.Group,null,r.a.createElement(Ae.a.Label,null,"SID"),r.a.createElement(Ae.a.Control,{as:"select",custom:!0,onChange:this.onJobSIDChange},r.a.createElement("option",{className:"text-muted",value:""},"Choose job to create"),(this.props.jobMetas||[]).map((function(e){return r.a.createElement("option",{value:e.SID},e.Title)})))),r.a.createElement(Ae.a.Group,null,this.renderInputEditor(),r.a.createElement("blockquote",{className:"blockquote"},r.a.createElement("p",{className:"mb-0"},JSON.stringify(this.state.input)),r.a.createElement("footer",{className:"blockquote-footer"},"would be sent as job input"))),r.a.createElement(se.a,{variant:"light",type:"submit",className:"w-100"},"Submit")))}},{key:"renderInputEditor",value:function(){var e=this,t=this.state.jobSID,n=(this.props.jobMetas||[]).find((function(e){return e.SID===t}));if(n){if(!n.InputJSONSchema)return r.a.createElement("div",{className:"alert alert-primary"},"No input JSON schema defined for this Job");var a=JSON.parse(n.InputJSONSchema);return r.a.createElement(Ue,{label:"Input",jsonSchema:a,defaultValue:this.state.input,onChange:function(t){e.setState({input:t})}})}}},{key:"onSubmit",value:function(){var e=Object(h.a)(f.a.mark((function e(t){var n;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),e.next=3,this.props.runJob(this.state.jobSID,this.state.input);case 3:return n=e.sent,alert(JSON.stringify(n)),window.location.reload(),e.abrupt("return",!1);case 7:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"onJobSIDChange",value:function(e){var t=e.target.value;""===t?this.setState({jobSID:void 0}):this.setState({jobSID:t})}}]),n}(r.a.Component),Be=p.c((function(e,t){return{jobMetas:e.jobMetas}}),(function(e,t){return{runJob:function(t,n){return e(re.run(t,n))}}}))(ze);var Ve=function(){return r.a.createElement(B.c,null,r.a.createElement(B.a,{path:"/index",exact:!0,component:Fe}),r.a.createElement(B.a,{path:"/new",exact:!0,component:Be}),r.a.createElement(B.a,{component:Fe}))},Xe=n(23),qe=n(21),Ye=n(56),Ge=n(17),He=n(48),We=[];function $e(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:We,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"JOBS/INDEX":var n=t;return n.jobs;case"JOBS/UPDATE":var a=t,r=a.job,i=e.find((function(e){return e.id===a.job.id}));if(!i&&r.isRoot())return e.unshift(r),e.slice(0);if(i){var o=e.indexOf(i);return e[o]=r,e.slice(0)}return e;case"JOBS/DESTROY":var s=t;return e.filter((function(e){return e.id!==s.job.id}))}return e}var Ke=[];function Qe(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Ke,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case J:var n=t;return n.items}return e}var Ze=function(e){return Object(qe.c)({router:Object(Xe.b)(e),jobs:$e,jobMetas:Qe})},et=n(60),tt=function(e){return function(e){return function(t){return void 0!==(n=t)&&null!==n&&"object"===typeof n?e(Object(et.a)({},t)):e(t);var n}}},nt=qe.d,at=window.__USE_MEMORY_HISTORY__?Ge.d():Ge.b();window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__&&(nt=window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__);var rt=nt(qe.a(Object(He.a)(at),Ye.a,tt));var it=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Ze(at),n=qe.e(t,e,rt);return n}(),ot=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(){return Object(s.a)(this,n),t.apply(this,arguments)}return Object(c.a)(n,[{key:"componentDidMount",value:function(){this.props.indexJobMetas()}},{key:"render",value:function(){return r.a.createElement(Xe.a,{history:at},r.a.createElement(z,null,r.a.createElement(M.a,null,r.a.createElement(F.a,{md:12,className:"pt-2"},r.a.createElement(Ve,null)))))}}]),n}(r.a.Component),st=p.c((function(e,t){return{}}),(function(e,t){return{indexJobMetas:function(){return e(T.index())}}}))(ot);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(p.a,{store:it},r.a.createElement(st,null))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[61,1,2]]]);
//# sourceMappingURL=main.b65d5a8f.chunk.js.map