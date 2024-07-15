import{_ as N}from"./VeeForm-DPBjbMmO.js";import{u as I,_ as R}from"./useCandidate-DgI-Q6vb.js";import{x,h as w,s as Y,c as f,b as d,a as l,w as r,e as n,k as A,F as D,r as _,o as u,y as E,B as j,v as z}from"./index-DDlzD-Q3.js";import{a as G}from"./useDocument-CWJ_8aVQ.js";const h="Vui lòng nhập",y=[{name:"_id",label:"ID",type:"hidden",placeholder:"Vui lòng nhập",valid:t=>t.string().trim().nullable().default(null),col:"col-md-12",default:null},{name:"name",label:"Tên Chứng chỉ",type:"text",placeholder:"Vui lòng nhập Tên giải thưởng chỉ",valid:t=>t.string().trim().max(100,"Tối đa 100 ký tự").required(h),default:""},{name:"organization",label:"Tên tổ chức",type:"text",placeholder:"Vui lòng nhập Tên tổ chức",valid:t=>t.string().trim().max(100,"Tối đa 100 ký tự").required(h),default:""},{name:"issueDate",label:"Ngày nhận giải",type:"date",placeholder:"Vui lòng nhập Ngày bắt đầu",valid:t=>t.date().required(h),col:"col-md-6",convertTo:"date",default:x(+new Date)},{name:"link",label:"Link",type:"text",valid:t=>t.string().trim().url().nullable(),col:"col-md-12",default:""},{name:"description",label:"Mô tả",type:"textarea",valid:t=>t.string().trim().required(h),col:"col-md-12",convertTo:"truncate",default:""}],H={class:"mb-4"},P={key:0,class:"clearfix"},O={class:"btn-group"},S=["onClick"],U=["onClick"],J={class:"block-container"},K=d("button",{type:"button",class:"btn btn-secondary mx-3","data-bs-dismiss":"modal"},"Đóng",-1),ee={__name:"PageAward",setup(t){const{awards:g,removeRecordById:T,addRecordToList:C}=I({field:"awards"}),{document:o,updateDoc:V,deleteDoc:M}=G({collection:"award",fields:y}),p=w(),v=w(),b=Y(y);async function F(c){const a=(e=>(e.issueDate=+new Date(e.issueDate),e))({...c});await V(a,e=>{const{data:s}=e;C(s)})}function L(c){var e;const a=b.value.map(s=>s.name);for(const s of new Set(["_id",...a]))o[s]=c[s];o.issueDate=x(o.issueDate),(e=p.value)==null||e.show()}function $(){var c,a;for(const e of b.value)o[e.name]=e.default;(c=p.value)==null||c.show(),(a=v.value)==null||a.reset()}return(c,a)=>{const e=_("FontAwesomeIcon"),s=_("Heading"),q=_("ListTransition"),B=_("NoData");return u(),f(D,null,[d("div",H,[l(s,{text:"Giải thưởng"},{default:r(()=>[d("button",{class:"btn btn-sm btn-success",onClick:a[0]||(a[0]=i=>$())},[l(e,{icon:"fa-solid fa-plus"})])]),_:1}),n(g).length?(u(),f("div",P,[l(q,null,{default:r(()=>[(u(!0),f(D,null,E(n(g),i=>(u(),f("li",{key:i._id},[l(j,{"model-value":{title:i.name,subTitle:i.organization,date:()=>{const{issueDate:m}=i;return`${n(z)(m)}`},description:i.description},icon:"fa-award"},{default:r(()=>[d("div",O,[d("a",{class:"btn btn-sm btn-outline-danger icon",href:"javascript:void(0)",onClick:()=>{n(M)({...i},"name",m=>{const{data:k}=m;n(T)(k._id)})}},[l(e,{icon:"fa-solid fa-trash"})],8,S),d("a",{class:"btn btn-sm btn-outline-warning icon",href:"javascript:void(0)",onClick:m=>L({...i})},[l(e,{icon:"fa-solid fa-square-pen"})],8,U)])]),_:2},1032,["model-value"])]))),128))]),_:1})])):(u(),A(B,{key:1}))]),l(R,{ref_key:"refModal",ref:p,title:n(o)._id?`Chỉnh sửa: ${n(o).school}`:"Thêm mới Giải thưởng","is-hidden-footer":""},{default:r(()=>[d("div",J,[l(N,{ref_key:"refVeeForm",ref:v,fields:b.value,document:n(o),"submit-fn":F,"submit-text":n(o)._id?"Cập nhật":"Thêm mới",buttonPosition:"end"},{button:r(()=>[K]),_:1},8,["fields","document","submit-text"])])]),_:1},8,["title"])],64)}}};export{ee as default};
