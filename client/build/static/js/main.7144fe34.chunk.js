(this.webpackJsonpgui=this.webpackJsonpgui||[]).push([[0],{107:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(16),i=n.n(o),s=n(112),c=n(113),u=n(114),l=n(109),p=function(e){var t=e.widget||!1;return r.a.createElement(r.a.Fragment,null,r.a.createElement(u.a,{bg:"dark",variant:"dark"},r.a.createElement(u.a.Brand,{href:""},"\ud83e\udd4b High kick")),r.a.createElement(l.a,{className:t?"m-0 p-0":void 0},e.children))},d=n(2),f=n.n(d),h=n(6),m=n(7),v=n(9),b=n(8),g=n(12),y=n(11),j=n(22),w=function(){function e(t){for(var n in Object(m.a)(this,e),this.id=0,this.type="",this.path="",this.sid="",this.input="",this.output="",this.status="initial",this.treeStatus=void 0,this.createdAt="",this.cron=void 0,this.logsCount=0,this.childs=[],t)this[n]=t[n]}return Object(v.a)(e,[{key:"isRoot",value:function(){return""===this.path}},{key:"isPeriodical",value:function(){return void 0!==this.cron}},{key:"parentID",value:function(){if(this.isRoot())return null;var e=this.path.split("/").map((function(e){return parseInt(e)}));return e[e.length-1]}},{key:"digest",value:function(){var e=this.childs.map((function(e){return e.digest()})).join();return"".concat(this.id).concat(this.status).concat(this.treeStatus).concat(e)}}],[{key:"deserialize",value:function(t){return new e(t)}}]),e}(),k=window.location,O=k.protocol,E=k.hostname,x=["".concat(O,"//").concat(E,":8000"),window.location.origin,window.location.origin][1],S="".concat(x,"/highkick"),N={URLS:{ws:"ws".concat("https:"===window.location.protocol?"s":"","://").concat(S.split("//")[1],"/ws"),jobs:{job:function(e){return"".concat(S,"/jobs/").concat(e)},retry:function(e){return"".concat(S,"/jobs/").concat(e,"/retry")},retryFailedLeaves:function(e){return"".concat(S,"/jobs/").concat(e,"/retry_failed_leaves")},subtree:function(e){return"".concat(S,"/jobs/").concat(e,"/subtree")},input:function(e){return"".concat(S,"/jobs/").concat(e,"/input")}},jobRoots:{index:"".concat(S,"/job_roots")},jobLogs:{index:function(e){return"".concat(S,"/jobs/").concat(e,"/logs")}}}},L=n(58),C=n.n(L),I={Accept:"application/json","Content-Type":"application/json"};function P(e,t){return R.apply(this,arguments)}function R(){return(R=Object(h.a)(f.a.mark((function e(t,n){var a,r,o,i,s,c,u,l,p,d=arguments;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a=d.length>2&&void 0!==d[2]?d[2]:null,r=Object.assign({},I),o=Object.assign({},a),Object.values(o).some((function(e){return e instanceof File}))){for(r["Content-Type"]="multipart/form-data",i=new FormData,s=0,c=Object.keys(o);s<c.length;s++)u=c[s],i.append(u,o[u]);o=i}return e.prev=5,e.next=8,C.a.request({method:t,url:n,data:o,headers:r,responseType:"json",params:"get"===t?o:void 0});case 8:l=e.sent,e.next=20;break;case 11:if(e.prev=11,e.t0=e.catch(5),e.t0.response){e.next=15;break}throw e.t0;case 15:if(422!==e.t0.response.status){e.next=19;break}throw(p=new Error("422 response")).__SERVER_SIDE_ERRORS__=e.t0.response.data.errors,p;case 19:throw e.t0;case 20:return e.abrupt("return",l.data);case 21:case"end":return e.stop()}}),e,null,[[5,11]])})))).apply(this,arguments)}function T(){return(T=Object(h.a)(f.a.mark((function e(t){var n,a=arguments;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=a.length>1&&void 0!==a[1]?a[1]:{},e.abrupt("return",P("get",t,n));case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function F(){return(F=Object(h.a)(f.a.mark((function e(t){var n,a=arguments;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=a.length>1&&void 0!==a[1]?a[1]:null,e.abrupt("return",P("post",t,n));case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function _(){return(_=Object(h.a)(f.a.mark((function e(t){var n,a=arguments;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=a.length>1&&void 0!==a[1]?a[1]:null,e.abrupt("return",P("put",t,n));case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function D(){return(D=Object(h.a)(f.a.mark((function e(t){var n,a=arguments;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=a.length>1&&void 0!==a[1]?a[1]:null,e.abrupt("return",P("delete",t,n));case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var z={get:function(e){return T.apply(this,arguments)},post:function(e){return F.apply(this,arguments)},put:function(e){return _.apply(this,arguments)},del:function(e){return D.apply(this,arguments)}},J=n(61);var U={compose:function(e){var t=e.rootId,n=e.items,a=n.find((function(e){return e.id===t}));if(!a)throw new Error("No root found");return function e(t){t.childs=n.filter((function(e){return e.parentID()===t.id}));var a,r=Object(J.a)(t.childs);try{for(r.s();!(a=r.n()).done;){e(a.value)}}catch(o){r.e(o)}finally{r.f()}}(a),a}};function A(){return(A=Object(h.a)(f.a.mark((function e(t,n){var a,r,o,i;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=Object.assign({},n,{filters:t}),r=N.URLS.jobRoots.index,e.next=4,z.get(r,a);case 4:return o=e.sent,i=o.map(w.deserialize),e.abrupt("return",i);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function W(){return(W=Object(h.a)(f.a.mark((function e(t){var n,a,r;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,z.get(N.URLS.jobs.subtree(t.id));case 2:return n=e.sent,a=n.map(w.deserialize),r=U.compose({items:a,rootId:t.id}),e.abrupt("return",r);case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function B(){return(B=Object(h.a)(f.a.mark((function e(t){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,z.post(N.URLS.jobs.retry(t.id));case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function M(){return(M=Object(h.a)(f.a.mark((function e(t){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,z.post(N.URLS.jobs.retryFailedLeaves(t.id));case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function X(){return(X=Object(h.a)(f.a.mark((function e(t){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,z.del(N.URLS.jobs.job(t.id));case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function V(){return(V=Object(h.a)(f.a.mark((function e(t){var n,a;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=N.URLS.jobs.input(t.id),e.next=3,z.get(n);case 3:return a=e.sent,e.abrupt("return",a);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var Y={loadRoots:function(e,t){return A.apply(this,arguments)},updateJob:function(e){return W.apply(this,arguments)},retry:function(e){return B.apply(this,arguments)},retryFailedLeaves:function(e){return M.apply(this,arguments)},destroy:function(e){return X.apply(this,arguments)},treeStatus:function e(t){var n=t.childs.map(e);return n.push(t.status),n.some((function(e){return"processing"===e}))?"processing":n.some((function(e){return"failed"===e}))?"failed":n.every((function(e){return"completed"===e}))?"completed":n.every((function(e){return"initial"===e}))?"initial":"processing"},getInput:function(e){return V.apply(this,arguments)}},q="JOBS/INDEX",G=function e(t){Object(m.a)(this,e),this.job=t,this.type="JOBS/UPDATE"},H=function e(t){Object(m.a)(this,e),this.jobs=t,this.type=q},$=function e(t){Object(m.a)(this,e),this.job=t,this.type="JOBS/DESTROY"};var K={index:function(e,t){return function(){var n=Object(h.a)(f.a.mark((function n(a,r){var o;return f.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,Y.loadRoots(e,t);case 2:o=n.sent,a(new H(o));case 4:case"end":return n.stop()}}),n)})));return function(e,t){return n.apply(this,arguments)}}()},update:function(e){return function(){var t=Object(h.a)(f.a.mark((function t(n,a){var r;return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Y.updateJob(e);case 2:r=t.sent,n(new G(r));case 4:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()},destroy:function(e){return function(){var t=Object(h.a)(f.a.mark((function t(n,a){return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Y.destroy(e);case 2:n(new $(e));case 3:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()},getInput:function(e){return function(){var t=Object(h.a)(f.a.mark((function t(n,a){var r;return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Y.getInput(e);case 2:return r=t.sent,t.abrupt("return",r);case 4:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()}},Q=n(36),Z=n.n(Q),ee=n(111),te=n(116),ne=n(115),ae=n(110),re=function(e){var t=e.title,n=e.status,a="completed"===n?"success":"failed"===n?"danger":"info",o="completed"===n?"\u270c":"failed"===n?"\u2718":"\u0f17";return r.a.createElement("h5",{className:"m-0 p-0"},r.a.createElement(ae.a,{variant:a},t,o))},oe=function(){function e(t){Object(m.a)(this,e),this.id=0,this.content="",this.createdAt="",t.id&&(this.id=t.id),t.content&&(this.content=t.content),t.createdAt&&(this.createdAt=t.createdAt)}return Object(v.a)(e,null,[{key:"deserialize",value:function(t){return new e(t)}}]),e}();function ie(){return(ie=Object(h.a)(f.a.mark((function e(t){var n,a;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,z.get(N.URLS.jobLogs.index(t.id));case 2:return n=e.sent,a=n.map(oe.deserialize).reverse(),e.abrupt("return",a);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var se={loadLogs:function(e){return ie.apply(this,arguments)}},ce=function(e){Object(g.a)(n,e);var t=Object(y.a)(n);function n(e){var a;return Object(m.a)(this,n),(a=t.call(this,e)).state={showLogs:!1,jobLogs:[],input:null,showOutput:!1},a.updateItem=a.updateItem.bind(Object(b.a)(a)),a.showLogs=a.showLogs.bind(Object(b.a)(a)),a.retry=a.retry.bind(Object(b.a)(a)),a.retryFailedLeaves=a.retryFailedLeaves.bind(Object(b.a)(a)),a.destroy=a.destroy.bind(Object(b.a)(a)),a.showInput=a.showInput.bind(Object(b.a)(a)),a.showOutput=a.showOutput.bind(Object(b.a)(a)),a}return Object(v.a)(n,[{key:"render",value:function(){var e=this.props.job,t=e.treeStatus||Y.treeStatus(e);""!==e.input&&JSON.parse(e.input),""!==e.output&&JSON.parse(e.output);return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"d-flex"},r.a.createElement("div",{className:"mr-1 text-muted",style:{fontSize:12}},e.id),r.a.createElement("div",{className:"mr-1 font-italic",style:{fontSize:"12px",width:"160px",overflow:"scroll"}},e.type,r.a.createElement("br",null),e.cron),r.a.createElement("div",{className:"flex-fill d-flex flex-column"},r.a.createElement("div",{className:"text-muted",style:{fontSize:12}},"Created at: ",e.createdAt),this.renderInput()),r.a.createElement("div",{className:"mr-1"},r.a.createElement(re,{status:e.status})),r.a.createElement("div",{className:"mr-1"},(e.childs.length>0||e.isRoot())&&r.a.createElement(re,{status:t,title:"\ud83c\udf33"})),r.a.createElement("div",null,r.a.createElement(ee.a,{size:"sm"},r.a.createElement(te.a,{variant:"light",onClick:this.updateItem},"\ud83d\udc41"),r.a.createElement(te.a,{variant:"light",className:"text-muted",onClick:this.showLogs},"Logs"),r.a.createElement(te.a,{variant:"light",className:"text-success",onClick:this.retry},"\u21bb"),"completed"!==t&&(e.childs.length>0||e.isRoot())&&r.a.createElement(te.a,{variant:"light",className:"text-success",onClick:this.retryFailedLeaves},"\u21bb \ud83c\udf42"),r.a.createElement(te.a,{variant:"light",onClick:this.destroy},"\ud83d\uddd1")))),this.renderLogs())}},{key:"renderInput",value:function(){var e=this.props.job,t=this.state,n=t.input,a=t.showOutput,o=""!==e.output?JSON.parse(e.output):{};return r.a.createElement(r.a.Fragment,null,!n&&r.a.createElement(te.a,{size:"sm",variant:"light",className:"w-100 m-0 p-0",onClick:this.showInput,style:{fontSize:10}},"Input"),n&&r.a.createElement(Z.a,{src:n,collapsed:!0,displayDataTypes:!1,enableClipboard:!1,style:{fontSize:10}}),!a&&r.a.createElement(te.a,{size:"sm",variant:"light",className:"w-100 m-0 p-0",onClick:this.showOutput,style:{fontSize:10}},"Output"),a&&r.a.createElement(Z.a,{src:o,collapsed:!0,displayDataTypes:!1,enableClipboard:!1,style:{fontSize:10}}))}},{key:"renderLogs",value:function(){var e=this.state,t=e.showLogs,n=e.jobLogs;return t?r.a.createElement(ne.a,{className:"mt-2 mb-2 bg-light",style:{fontSize:"12px",overflowY:"scroll"}},n.map((function(e){return r.a.createElement("div",{className:"d-flex",key:e.id},r.a.createElement("div",{style:{width:150}},e.createdAt),r.a.createElement("div",{className:"flex-fill"},e.content))}))):null}},{key:"updateItem",value:function(){var e=this,t=this.props.job;this.props.update(t).then((function(){e.props.expandTreeLeaf()}))}},{key:"showLogs",value:function(){var e=this,t=this.props.job,n=this.state.showLogs;n?this.setState({showLogs:!1}):Object(h.a)(f.a.mark((function n(){var a;return f.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,se.loadLogs(t);case 2:a=n.sent,e.setState({showLogs:!0,jobLogs:a});case 4:case"end":return n.stop()}}),n)})))()}},{key:"retry",value:function(){var e=this.props.job;!1!==window.confirm("Do you wanna to retry this job?")&&Object(h.a)(f.a.mark((function t(){return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Y.retry(e);case 2:case"end":return t.stop()}}),t)})))()}},{key:"retryFailedLeaves",value:function(){var e=this.props.job;!1!==window.confirm("Do you wanna to retry failed children of this job?")&&Object(h.a)(f.a.mark((function t(){return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Y.retryFailedLeaves(e);case 2:case"end":return t.stop()}}),t)})))()}},{key:"destroy",value:function(){!1!==window.confirm("Do you wanna to destroy this job?")&&this.props.destroy()}},{key:"showInput",value:function(){var e=this;this.props.getInput().then((function(t){e.setState({input:t})}))}},{key:"showOutput",value:function(){this.setState({showOutput:!0})}}]),n}(r.a.Component),ue=j.b((function(e,t){return{}}),(function(e,t){var n=t.job;return{update:function(t){return e(K.update(t))},destroy:function(){return e(K.destroy(n))},getInput:function(){return e(K.getInput(n))}}}))(ce),le={builder:function(e){return r.a.createElement(ue,{job:e.item,expandTreeLeaf:e.expandTreeLeaf})}},pe=n(4),de=n.n(pe),fe=function(e){Object(g.a)(n,e);var t=Object(y.a)(n);function n(e){var a;return Object(m.a)(this,n),(a=t.call(this,e)).state={opened:!e.item.isRoot()},a.toggle=a.toggle.bind(Object(b.a)(a)),a.expand=a.expand.bind(Object(b.a)(a)),a}return Object(v.a)(n,[{key:"render",value:function(){var e=this.props,t=e.item,n=e.builder,a=this.state.opened;return r.a.createElement("li",{className:"list-group-item p-0"},r.a.createElement("div",{className:"d-flex"},r.a.createElement("div",{style:{width:40}},r.a.createElement(te.a,{variant:"light",size:"sm",onClick:this.toggle},a?"\u2198":"\u2197")),r.a.createElement("div",{className:"flex-fill",key:t.digest()},n({item:t,expandTreeLeaf:this.expand}),r.a.createElement("div",{className:de()({"d-none":!a})},r.a.createElement(he,{items:t.childs,builder:n})))))}},{key:"toggle",value:function(){this.setState({opened:!this.state.opened})}},{key:"expand",value:function(){this.setState({opened:!0})}}]),n}(r.a.Component),he=function(e){Object(g.a)(n,e);var t=Object(y.a)(n);function n(){return Object(m.a)(this,n),t.apply(this,arguments)}return Object(v.a)(n,[{key:"render",value:function(){var e=this.props,t=e.items,n=e.builder;return r.a.createElement("ul",{className:de()("list-group","p-0")},t.map((function(e){return r.a.createElement(fe,{key:e.id,item:e,builder:n})})))}}]),n}(r.a.Component),me=function(e){Object(g.a)(n,e);var t=Object(y.a)(n);function n(e){var a;return Object(m.a)(this,n),(a=t.call(this,e)).onPageLinkClick=a.onPageLinkClick.bind(Object(b.a)(a)),a}return Object(v.a)(n,[{key:"render",value:function(){var e=this,t=this.props.maxPage;return r.a.createElement("nav",null,r.a.createElement("ul",{className:"pagination"},Array.apply(null,Array(t)).map((function(t,n){return e.renderPageLink(n+1)}))))}},{key:"renderPageLink",value:function(e){var t=this,n=this.props.page===e;return r.a.createElement("li",{className:"page-item",key:e},n&&r.a.createElement("span",{className:"page-link"},e),!n&&r.a.createElement("a",{className:"page-link",href:"#",onClick:function(n){return t.onPageLinkClick(n,e)}},e))}},{key:"onPageLinkClick",value:function(e,t){e.preventDefault(),this.props.onPageChange(t)}}]),n}(r.a.Component),ve=function(e){Object(g.a)(n,e);var t=Object(y.a)(n);function n(e){var a;return Object(m.a)(this,n),(a=t.call(this,e)).onChange=a.onChange.bind(Object(b.a)(a)),a}return Object(v.a)(n,[{key:"render",value:function(){var e=this.props.value;return r.a.createElement("form",{onChange:this.onChange,className:"alert alert-info"},r.a.createElement("div",{className:"form-row"},r.a.createElement("div",{className:"col-7"},r.a.createElement("div",{className:"form-check form-check-inline"},r.a.createElement("input",{className:"form-check-input",type:"radio",name:"IsPeriodical",id:"IsPeriodicalTrue",value:"1",checked:!0===e.IsPeriodical}),r.a.createElement("label",{className:"form-check-label",htmlFor:"IsPeriodicalTrue"},"Periodical")),r.a.createElement("div",{className:"form-check form-check-inline"},r.a.createElement("input",{className:"form-check-input",type:"radio",name:"IsPeriodical",id:"IsPeriodicalFalse",value:"0",checked:!1===e.IsPeriodical}),r.a.createElement("label",{className:"form-check-label",htmlFor:"IsPeriodicalFalse"},"Non periodical"))),r.a.createElement("div",{className:"col-5"},r.a.createElement("input",{type:"text",className:"form-control",name:"Type",placeholder:"Job",value:e.Type}))))}},{key:"onChange",value:function(e){var t=new FormData(e.currentTarget),n={};"1"===t.get("IsPeriodical")&&(n.IsPeriodical=!0),"0"===t.get("IsPeriodical")&&(n.IsPeriodical=!1),""!==t.get("Type")&&(n.Type=t.get("Type")),this.props.onChange(n)}}]),n}(r.a.Component),be=function(e){Object(g.a)(n,e);var t=Object(y.a)(n);function n(e){var a;return Object(m.a)(this,n),(a=t.call(this,e)).state={loading:!0,page:1,maxPage:1,filters:{IsPeriodical:!1}},a.onPageChange=a.onPageChange.bind(Object(b.a)(a)),a.onFiltersChange=a.onFiltersChange.bind(Object(b.a)(a)),a}return Object(v.a)(n,[{key:"componentDidMount",value:function(){this.loadItems(1).then((function(){}))}},{key:"render",value:function(){var e=this.props.roots,t=this.state,n=t.loading,a=t.page,o=t.maxPage;return n?r.a.createElement("div",{className:"d-flex w-100 h-100"},r.a.createElement("div",{className:"m-auto"},"Loading")):r.a.createElement(r.a.Fragment,null,r.a.createElement(ve,{value:this.state.filters,onChange:this.onFiltersChange}),r.a.createElement(he,{items:e||[],builder:le.builder}),r.a.createElement(me,{page:a,maxPage:o,onPageChange:this.onPageChange}))}},{key:"onPageChange",value:function(e){this.loadItems(e).then((function(){}))}},{key:"loadItems",value:function(){var e=Object(h.a)(f.a.mark((function e(t){var n,a,r;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=this.state,a=n.filters,r=n.maxPage,e.next=3,this.props.index(a,{page:t});case 3:this.setState({loading:!1,page:t,maxPage:Math.max(r,t+1)});case 4:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"onFiltersChange",value:function(e){var t=this;this.setState({filters:e},(function(){t.loadItems(1).then((function(){}))}))}}]),n}(r.a.Component),ge=j.b((function(e,t){return{roots:e.jobs}}),(function(e,t){return{index:function(t,n){return e(K.index(t,n))}}}))(be),ye=function(){return r.a.createElement(p,null,r.a.createElement(s.a,null,r.a.createElement(c.a,{md:12,className:"pt-2"},r.a.createElement(ge,null))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var je=n(37),we=n(17),ke=n(59),Oe=[];function Ee(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Oe,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case q:var n=t;return n.jobs;case"JOBS/UPDATE":var a=t,r=a.job,o=e.find((function(e){return e.id===a.job.id}));if(!o&&r.isRoot())return e.unshift(r),e.slice(0);if(o){var i=e.indexOf(o);return e[i]=r,e.slice(0)}return e;case"JOBS/DESTROY":var s=t;return e.filter((function(e){return e.id!==s.job.id}))}return e}var xe=function(){return Object(we.c)({jobs:Ee})},Se=n(62),Ne=function(e){return function(e){return function(t){return void 0!==(n=t)&&null!==n&&"object"===typeof n?e(Object(Se.a)({},t)):e(t);var n}}},Le=we.d;window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__&&(Le=window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__);var Ce=Le(we.a(ke.a,Ne));var Ie=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=xe(),n=we.e(t,e,Ce);return n}();({handle:function(){var e=je.Socket.connect(N.URLS.ws);e.on("open",(function(){console.log("[WS] Connected");var t=new je.SubscriptionManager(e);t.subscribe("time").then((function(e){console.log("[WS] Subscribed on `time`"),e.on("message",(function(e){console.log("[WS] [time]",e)}))})),t.subscribe("jobs").then((function(e){console.log("[WS] Subscribed on `jobs`: ",e),e.on("message",(function(e){console.log("[WS] [jobs]",e);var t=w.deserialize(e.payload.job);Ie.dispatch(new G(t))}))}))})),e.on("error",(function(e){console.error("Socket error ".concat(e&&e.message?e.message:e))})),e.on("dead",(function(){console.error("[WS] Socket become dead")})),e.on("close",(function(e,t){console.error("[WS] Socket closed ".concat(e," ").concat(t))})),e.on("message",(function(e){console.log("[WS] Got message ".concat(JSON.stringify(e)))}))}}).handle(),i.a.render(r.a.createElement(j.a,{store:Ie},r.a.createElement(ye,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},64:function(e,t,n){e.exports=n(107)}},[[64,1,2]]]);
//# sourceMappingURL=main.7144fe34.chunk.js.map