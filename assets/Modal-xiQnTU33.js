import{g as M,h as b,p as k,m as w,t as v,N as I,K as D,j as $,O as S,r as x,o as h,c as g,b as c,z as N,a as Y,f as F,v as C,q as B,G as z}from"./index-DTtE90NA.js";import{u as L}from"./useDocument-CVp39-DE.js";const V=l=>{const s=new Date(l);let o=s.getFullYear(),a=s.getMonth()+1,e=s.getDate();return a=a<9?`0${a}`:a,e=e<9?`0${e}`:e,{d:e,m:a,y:o}},G=l=>{const{d:s,m:o,y:a}=l;return{dd:s+"",mm:o+"",yyyy:a+""}},P=(l,s="DD/MM/YYYY")=>{if(!l)return"--/--";const{d:o,m:a,y:e}=V(l),n=G({d:o,m:a,y:e});let f="";const r=s.split("/");for(let d=0,p=r.length;d<p;d++){const y=r[d],m=(n==null?void 0:n[y.toLocaleLowerCase()])||"";f+=`${d!==0?"/":""}${m}`}return f},Q=l=>{const s=M(),o=b(l.field),a=l.collection||null,e=b([]),n=k(()=>s.getId),{loading:f}=L();w(async()=>{let t=s.getCandidateByField(v(o));t.length?e.value=t:await r()});async function r(){let t=[];const i=a||(o.value.endsWith("s")?o.value.slice(0,-1):o.value);await I({method:"get",url:`${i}/`},{loading:f,toast:null},_=>{const{data:u=[]}=_;t=u,s.setCandidateByField({[`${o.value}`]:u})}),e.value=t}function d(t){e.value=e.value.filter(i=>i._id!==t),s.setCandidateByField({[o.value]:v(e)})}function p(t){const{_id:i=null}=t;if(!i){e.value.push(t);return}const _=e.value.findIndex(u=>u._id===i);_>-1?e.value[_]=t:e.value.push(t),s.setCandidateByField({[o.value]:v(e)})}function y(t){const{field:i,values:_}=t,u=i;u===""&&s.setCandidateByField({[u]:_})}function m(t){s.setGeneralInformation(t)}return{candidateId:n,[v(o)]:e,removeRecordById:d,addRecordToList:p,updateField:y,updateGeneralInformationByField:m,getData:r}},H={class:"modal-content"},q={class:"modal-header"},A={class:"modal-title h5 m-0"},O={class:"ms-auto"},R={class:"btn btn-sm btn-outline-danger","data-bs-dismiss":"modal","aria-label":"Close"},T={class:"modal-body"},j={key:1},E={key:0,class:"modal-footer"},K=c("button",{type:"button",class:"btn btn-secondary","data-bs-dismiss":"modal"},"Đóng",-1),U={__name:"Modal",props:{title:{type:String,default:"Modal Title"},size:{type:String,default:"modal-lg"},isHiddenFooter:{type:Boolean,default:!1}},setup(l,{expose:s}){const o=D(),a=l,e=b(null);let n=null;$(()=>{n=new S(e.value,{})});function f(){n==null||n.show()}function r(){n==null||n.hide()}return s({show:f,hide:r}),(d,p)=>{var m,t;const y=x("FontAwesomeIcon");return h(),g("div",{class:"modal draggable",tabindex:"-1",ref_key:"refModal",ref:e,"data-backdrop":"static"},[c("div",{class:z(["modal-dialog modal-dialog-scrollable",a.size])},[c("div",H,[c("div",q,[c("p",A,N(a.title),1),c("span",O,[c("span",R,[Y(y,{icon:"fa-solid fa-xmark"})])])]),c("div",T,[(m=F(o))!=null&&m.default?C(d.$slots,"default",{key:0}):(h(),g("p",j,"Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, facilis!"))]),l.isHiddenFooter?B("",!0):(h(),g("div",E,[K,(t=F(o))!=null&&t.footer?C(d.$slots,"footer",{key:0}):B("",!0)]))])],2)],512)}}};export{U as _,P as f,Q as u};
