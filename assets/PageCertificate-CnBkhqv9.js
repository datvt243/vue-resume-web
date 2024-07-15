import{_ as R}from"./VeeForm-ZD-0KBCl.js";import{u as Y,_ as j}from"./useCandidate-BPS_kQnP.js";import{x as _,k as x,s as z,c as h,b as d,a as l,w as r,e as n,j as A,F as y,r as p,o as u,y as H,B as P,v as C}from"./index-DAxs4nOd.js";import{a as O}from"./useDocument-SkqkMmzS.js";const f="Vui lòng nhập",T=[{name:"_id",label:"ID",type:"hidden",placeholder:"Vui lòng nhập",valid:t=>t.string().nullable().default(null),col:"col-md-12",default:null},{name:"name",label:"Tên Chứng chỉ",type:"text",placeholder:"Vui lòng nhập Tên Chứng chỉ",valid:t=>t.string().max(100,"Tối đa 100 ký tự").required(f),default:""},{name:"organization",label:"Tên tổ chức",type:"text",placeholder:"Vui lòng nhập Tên tổ chức",valid:t=>t.string().max(100,"Tối đa 100 ký tự").required(f),default:""},{name:"startDate",label:"Ngày bắt đầu",type:"date",placeholder:"Vui lòng nhập Ngày bắt đầu",valid:t=>t.date().required(f),col:"col-md-6",convertTo:"date",default:_(+new Date)},{name:"endDate",label:"Ngày Kết thúc",type:"date",placeholder:"Vui lòng nhập Ngày Kết thúc",valid:t=>t.date().required(f).min(t.ref("startDate"),"Ngày kết thúc phải sau ngày bắt đầu"),col:"col-md-6",convertTo:"date",default:_(+new Date)},{name:"isNoExpiration",label:"Không thời hạn",type:"checkbox",placeholder:"",default:!1,valid:t=>t.boolean(),col:"col-md-12",cellClass:"text-center",convertTo:"boolean",checkedValue:!1},{name:"link",label:"Link",type:"text",valid:t=>t.string().url().nullable(),col:"col-md-12",default:""},{name:"description",label:"Mô tả",type:"textarea",valid:t=>t.string().trim().required(f),col:"col-md-12",convertTo:"truncate",default:""}],S={class:"mb-4"},U={key:0,class:"clearfix"},G={class:"btn-group"},J=["onClick"],Q=["onClick"],W={class:"block-container"},X=d("button",{type:"button",class:"btn btn-secondary mx-3","data-bs-dismiss":"modal"},"Đóng",-1),ne={__name:"PageCertificate",setup(t){const{certificates:v,removeRecordById:w,addRecordToList:N}=Y({field:"certificates"}),{document:a,updateDoc:V,deleteDoc:E}=O({collection:"certificate",fields:T}),b=x(),k=x(),g=z(T);async function M(c){const o=(e=>(e.startDate=+new Date(e.startDate),e.endDate=+new Date(e.endDate),!e.isNoExpiration&&(e.isNoExpiration=!1),e))({...c});await V(o,e=>{const{data:s}=e;N(s)})}function $(c){var e;const o=g.value.map(s=>s.name);for(const s of new Set(["_id",...o]))a[s]=c[s];a.startDate=_(a.startDate),a.endDate=_(a.endDate),!a.isNoExpiration&&(a.isNoExpiration=!1),(e=b.value)==null||e.show()}function q(){var c,o;for(const e of g.value)a[e.name]=e.default;(c=b.value)==null||c.show(),(o=k.value)==null||o.reset()}return(c,o)=>{const e=p("FontAwesomeIcon"),s=p("Heading"),F=p("ListTransition"),L=p("NoData");return u(),h(y,null,[d("div",S,[l(s,{text:"Chứng chỉ"},{default:r(()=>[d("button",{class:"btn btn-sm btn-success",onClick:o[0]||(o[0]=i=>q())},[l(e,{icon:"fa-solid fa-plus"})])]),_:1}),n(v).length?(u(),h("div",U,[l(F,null,{default:r(()=>[(u(!0),h(y,null,H(n(v),i=>(u(),h("li",{key:i._id},[l(P,{"model-value":{title:i.name,subTitle:i.organization,date:()=>{const{startDate:m,endDate:D,isNoExpiration:B}=i,I=n(C)(m),K=B?"Không thời hạn":n(C)(D);return`${I} - ${K}`},description:i.description},icon:"fa-certificate"},{default:r(()=>[d("div",G,[d("a",{class:"btn btn-sm btn-outline-danger icon",href:"javascript:void(0)",onClick:()=>{n(E)({...i},"name",m=>{const{data:D}=m;n(w)(D._id)})}},[l(e,{icon:"fa-solid fa-trash"})],8,J),d("a",{class:"btn btn-sm btn-outline-warning icon",href:"javascript:void(0)",onClick:m=>$({...i})},[l(e,{icon:"fa-solid fa-square-pen"})],8,Q)])]),_:2},1032,["model-value"])]))),128))]),_:1})])):(u(),A(L,{key:1}))]),l(j,{ref_key:"refModal",ref:b,title:n(a)._id?`Chỉnh sửa: ${n(a).school}`:"Thêm mới Chứng chỉ","is-hidden-footer":""},{default:r(()=>[d("div",W,[l(R,{ref_key:"refVeeForm",ref:k,fields:g.value,document:n(a),"submit-fn":M,"submit-text":n(a)._id?"Cập nhật":"Thêm mới",buttonPosition:"end"},{button:r(()=>[X]),_:1},8,["fields","document","submit-text"])])]),_:1},8,["title"])],64)}}};export{ne as default};
