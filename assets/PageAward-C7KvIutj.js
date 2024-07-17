import{_ as R}from"./VeeForm-CWEsd3gj.js";import{u as Y,_ as z}from"./Modal-Biz4i9BD.js";import{y as x,h as D,s as A,r as f,o as u,c as _,b as d,a as s,w as m,k as w,e as a,d as E,T as j,F as y,z as G,D as H,x as P}from"./index-_cXkeK-O.js";import{a as O}from"./useDocument-DjZvQOz-.js";const p="Vui lòng nhập",T=[{name:"_id",label:"ID",type:"hidden",placeholder:"Vui lòng nhập",valid:t=>t.string().trim().nullable().default(null),col:"col-md-12",default:null},{name:"name",label:"Tên Chứng chỉ",type:"text",placeholder:"Vui lòng nhập Tên giải thưởng chỉ",valid:t=>t.string().trim().max(100,"Tối đa 100 ký tự").required(p),default:""},{name:"organization",label:"Tên tổ chức",type:"text",placeholder:"Vui lòng nhập Tên tổ chức",valid:t=>t.string().trim().max(100,"Tối đa 100 ký tự").required(p),default:""},{name:"issueDate",label:"Ngày nhận giải",type:"date",placeholder:"Vui lòng nhập Ngày bắt đầu",valid:t=>t.date().required(p),col:"col-md-6",convertTo:"date",default:x(+new Date)},{name:"link",label:"Link",type:"text",valid:t=>t.string().trim().url().nullable(),col:"col-md-12",default:""},{name:"description",label:"Mô tả",type:"ckediter",valid:t=>t.string().trim().required(p),col:"col-md-12",convertTo:"truncate",default:""}],S={class:"mb-4"},U={key:0,class:"clearfix"},J={class:"btn-group"},K=["onClick"],Q=["onClick"],W={class:"block-container"},X=d("button",{type:"button",class:"btn btn-secondary mx-3","data-bs-dismiss":"modal"},"Đóng",-1),ae={__name:"PageAward",setup(t){const{awards:g,removeRecordById:C,addRecordToList:V,getData:M}=Y({field:"awards"}),{document:i,updateDoc:$,deleteDoc:F}=O({collection:"award",fields:T}),h=D(),v=D(),b=A(T);async function L(c){const n=(e=>(e.issueDate=+new Date(e.issueDate),e))({...c});await $(n,e=>{const{data:l}=e;V(l)})}function N(c){var e;const n=b.value.map(l=>l.name);for(const l of new Set(["_id",...n]))i[l]=c[l];i.issueDate=x(i.issueDate),(e=h.value)==null||e.show()}function q(){var c,n;for(const e of b.value)i[e.name]=e.default;(c=h.value)==null||c.show(),(n=v.value)==null||n.reset()}return(c,n)=>{const e=f("FontAwesomeIcon"),l=f("Heading"),B=f("ListTransition"),I=f("NoData");return u(),_(y,null,[d("div",S,[s(l,{text:"Giải thưởng"},{default:m(()=>[d("button",{class:"btn btn-sm btn-success",onClick:n[0]||(n[0]=o=>q())},[s(e,{icon:"fa-solid fa-plus"})])]),_:1}),(u(),w(j,{to:"#reload"},[d("button",{class:"btn btn-sm btn-outline-info",onClick:n[1]||(n[1]=o=>{var r;return(r=a(M))==null?void 0:r()})},[s(e,{icon:"fa-solid fa-repeat"}),E(" Reload ")])])),a(g).length?(u(),_("div",U,[s(B,null,{default:m(()=>[(u(!0),_(y,null,G(a(g),o=>(u(),_("li",{key:o._id},[s(H,{"model-value":{title:o.name,subTitle:o.organization,date:()=>{const{issueDate:r}=o;return`${a(P)(r,"MM/YYYY")}`},description:o.description},icon:"fa-award"},{default:m(()=>[d("div",J,[d("a",{class:"btn btn-sm btn-outline-danger icon",href:"javascript:void(0)",onClick:()=>{a(F)({...o},"name",r=>{const{data:k}=r;a(C)(k._id)})}},[s(e,{icon:"fa-solid fa-trash"})],8,K),d("a",{class:"btn btn-sm btn-outline-warning icon",href:"javascript:void(0)",onClick:r=>N({...o})},[s(e,{icon:"fa-solid fa-square-pen"})],8,Q)])]),_:2},1032,["model-value"])]))),128))]),_:1})])):(u(),w(I,{key:1}))]),s(z,{ref_key:"refModal",ref:h,title:a(i)._id?`Chỉnh sửa: ${a(i).school}`:"Thêm mới Giải thưởng","is-hidden-footer":""},{default:m(()=>[d("div",W,[s(R,{ref_key:"refVeeForm",ref:v,fields:b.value,document:a(i),"submit-fn":L,"submit-text":a(i)._id?"Cập nhật":"Thêm mới",buttonPosition:"end"},{button:m(()=>[X]),_:1},8,["fields","document","submit-text"])])]),_:1},8,["title"])],64)}}};export{ae as default};
