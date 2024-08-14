import{_ as z}from"./VeeForm-B-b2OAwq.js";import{u as I,_ as R,f as Y}from"./Modal-xiQnTU33.js";import{h as y,s as A,r as u,o as m,c as _,b as c,a as s,w as f,f as a,k as E,F as D,C as H,H as P}from"./index-DTtE90NA.js";import{a as j}from"./useDocument-CVp39-DE.js";const p="Vui lòng nhập",C=[{name:"_id",label:"ID",type:"hidden",placeholder:"Vui lòng nhập",valid:t=>t.string().trim().nullable().default(null),col:"col-md-12",default:null},{name:"name",label:"Tên Chứng chỉ",type:"text",placeholder:"Vui lòng nhập Tên giải thưởng chỉ",valid:t=>t.string().trim().max(100,"Tối đa 100 ký tự").required(p),default:""},{name:"organization",label:"Tên tổ chức",type:"text",placeholder:"Vui lòng nhập Tên tổ chức",valid:t=>t.string().trim().max(100,"Tối đa 100 ký tự").required(p),default:""},{name:"issueDate",label:"Ngày nhận giải",type:"date",placeholder:"Vui lòng nhập Ngày bắt đầu",valid:t=>t.date().required(p),col:"col-md-6",convertTo:"date",default:+new Date,monthPicker:!0},{name:"link",label:"Link",type:"text",valid:t=>t.string().trim().url().nullable(),col:"col-md-12",default:""},{name:"description",label:"Mô tả",type:"ckediter",valid:t=>t.string().trim().required(p),col:"col-md-12",convertTo:"truncate",default:""}],G={class:"mb-4"},O={class:"btn-group"},S={key:0,class:"clearfix"},U={class:"btn-group"},J=["onClick"],K=["onClick"],Q={class:"block-container"},W=c("button",{type:"button",class:"btn btn-secondary mx-3","data-bs-dismiss":"modal"},"Đóng",-1),ne={__name:"PageAward",setup(t){const{awards:g,removeRecordById:T,addRecordToList:x,getData:V}=I({field:"awards"}),{document:r,updateDoc:M,deleteDoc:$}=j({collection:"award",fields:C}),h=y(),v=y(),b=A(C);async function B(l){const n=(e=>(e.issueDate=+new Date(e.issueDate),e))({...l});await M(n,e=>{const{data:i}=e;x(i)})}function F(l){var e;const n=b.value.map(i=>i.name);for(const i of new Set(["_id",...n]))r[i]=l[i];(e=h.value)==null||e.show()}function L(){var l,n;for(const e of b.value)r[e.name]=e.default;(l=h.value)==null||l.show(),(n=v.value)==null||n.reset()}return(l,n)=>{const e=u("Button"),i=u("Heading"),k=u("FontAwesomeIcon"),q=u("ListTransition"),N=u("NoData");return m(),_(D,null,[c("div",G,[s(i,{text:"Giải thưởng"},{default:f(()=>[c("div",O,[s(e,{onClick:n[0]||(n[0]=o=>L()),icon:"fa-solid fa-plus",type:"outline-success",size:"sm"}),s(e,{onClick:n[1]||(n[1]=o=>{var d;return(d=a(V))==null?void 0:d()}),icon:"fa-solid fa-repeat",type:"outline-info",size:"sm"})])]),_:1}),a(g).length?(m(),_("div",S,[s(q,null,{default:f(()=>[(m(!0),_(D,null,H(a(g),o=>(m(),_("li",{key:o._id},[s(P,{"model-value":{title:o.name,subTitle:o.organization,date:()=>{const{issueDate:d}=o;return`${a(Y)(d,"MM/YYYY")}`},description:o.description},icon:"fa-award"},{default:f(()=>[c("div",U,[c("a",{class:"btn btn-sm btn-outline-danger icon",href:"javascript:void(0)",onClick:()=>{a($)({...o},"name",d=>{const{data:w}=d;a(T)(w._id)})}},[s(k,{icon:"fa-solid fa-trash"})],8,J),c("a",{class:"btn btn-sm btn-outline-warning icon",href:"javascript:void(0)",onClick:d=>F({...o})},[s(k,{icon:"fa-solid fa-square-pen"})],8,K)])]),_:2},1032,["model-value"])]))),128))]),_:1})])):(m(),E(N,{key:1}))]),s(R,{ref_key:"refModal",ref:h,title:a(r)._id?`Chỉnh sửa: ${a(r).school}`:"Thêm mới Giải thưởng","is-hidden-footer":""},{default:f(()=>[c("div",Q,[s(z,{ref_key:"refVeeForm",ref:v,fields:b.value,document:a(r),"submit-fn":B,"submit-text":a(r)._id?"Cập nhật":"Thêm mới",buttonPosition:"end"},{button:f(()=>[W]),_:1},8,["fields","document","submit-text"])])]),_:1},8,["title"])],64)}}};export{ne as default};