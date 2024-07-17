import{_ as j}from"./VeeForm-CWEsd3gj.js";import{u as A,_ as H}from"./Modal-Biz4i9BD.js";import{h as k,s as K,r as m,o as l,c as _,b as c,a as s,w as f,k as x,e as a,d as P,T as S,F as C,z as O,D as U,x as v,y as T}from"./index-_cXkeK-O.js";import{a as G}from"./useDocument-DjZvQOz-.js";import{d as J,e as Q,g as W,f as X,c as Z}from"./model.type-neKQSWFc.js";const w="Vui lòng nhập",y=[J,{name:"name",label:"Tên Chứng chỉ",type:"text",placeholder:"Vui lòng nhập Tên Chứng chỉ",valid:u=>u.string().max(100,"Tối đa 100 ký tự").required(w),default:""},{name:"organization",label:"Tên tổ chức",type:"text",placeholder:"Vui lòng nhập Tên tổ chức",valid:u=>u.string().max(100,"Tối đa 100 ký tự").required(w),default:""},...Q(),W({name:"isNoExpiration",label:"Không thời hạn"}),X({name:"link",label:"Link"}),Z({name:"description",label:"Mô tả"})],tt={class:"mb-4"},et={key:0,class:"clearfix"},nt={class:"btn-group"},at=["onClick"],ot=["onClick"],st={class:"block-container"},it=c("button",{type:"button",class:"btn btn-secondary mx-3","data-bs-dismiss":"modal"},"Đóng",-1),ut={__name:"PageCertificate",setup(u){const{certificates:D,removeRecordById:N,addRecordToList:E,getData:M}=A({field:"certificates"}),{document:e,updateDoc:$,deleteDoc:L}=G({collection:"certificate",fields:y}),h=k(),g=k(),p=K(y);async function V(r){const n=(t=>(t.startDate=+new Date(t.startDate),t.endDate=+new Date(t.endDate),!t.isNoExpiration&&(t.isNoExpiration=!1),t))({...r});await $(n,t=>{const{data:i}=t;E(i)})}function Y(r){var t;const n=p.value.map(i=>i.name);for(const i of new Set(["_id",...n]))e[i]=r[i];e.startDate=T(e.startDate),e.endDate=T(e.endDate),!e.isNoExpiration&&(e.isNoExpiration=!1),(t=h.value)==null||t.show()}function F(){var r,n;for(const t of p.value)e[t.name]=t.default;(r=h.value)==null||r.show(),(n=g.value)==null||n.reset()}return(r,n)=>{const t=m("FontAwesomeIcon"),i=m("Heading"),B=m("ListTransition"),I=m("NoData");return l(),_(C,null,[c("div",tt,[s(i,{text:"Chứng chỉ"},{default:f(()=>[c("button",{class:"btn btn-sm btn-success",onClick:n[0]||(n[0]=o=>F())},[s(t,{icon:"fa-solid fa-plus"})])]),_:1}),(l(),x(S,{to:"#reload"},[c("button",{class:"btn btn-sm btn-outline-info",onClick:n[1]||(n[1]=o=>{var d;return(d=a(M))==null?void 0:d()})},[s(t,{icon:"fa-solid fa-repeat"}),P(" Reload ")])])),a(D).length?(l(),_("div",et,[s(B,null,{default:f(()=>[(l(!0),_(C,null,O(a(D),o=>(l(),_("li",{key:o._id},[s(U,{"model-value":{title:o.name,subTitle:o.organization,date:()=>{const{startDate:d,endDate:b,isNoExpiration:R}=o,q=a(v)(d,"MM/YYYY"),z=R?"Không thời hạn":a(v)(b,"MM/YYYY");return`${q} - ${z}`},description:o.description},icon:"fa-certificate"},{default:f(()=>[c("div",nt,[c("a",{class:"btn btn-sm btn-outline-danger icon",href:"javascript:void(0)",onClick:()=>{a(L)({...o},"name",d=>{const{data:b}=d;a(N)(b._id)})}},[s(t,{icon:"fa-solid fa-trash"})],8,at),c("a",{class:"btn btn-sm btn-outline-warning icon",href:"javascript:void(0)",onClick:d=>Y({...o})},[s(t,{icon:"fa-solid fa-square-pen"})],8,ot)])]),_:2},1032,["model-value"])]))),128))]),_:1})])):(l(),x(I,{key:1}))]),s(H,{ref_key:"refModal",ref:h,title:a(e)._id?`Chỉnh sửa: ${a(e).school}`:"Thêm mới Chứng chỉ","is-hidden-footer":""},{default:f(()=>[c("div",st,[s(j,{ref_key:"refVeeForm",ref:g,fields:p.value,document:a(e),"submit-fn":V,"submit-text":a(e)._id?"Cập nhật":"Thêm mới",buttonPosition:"end"},{button:f(()=>[it]),_:1},8,["fields","document","submit-text"])])]),_:1},8,["title"])],64)}}};export{ut as default};
