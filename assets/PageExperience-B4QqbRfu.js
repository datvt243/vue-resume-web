import{_ as B}from"./VeeForm-BE4iP4uH.js";import{u as A,_ as O}from"./useCandidate-D_rKPtCI.js";import{v as R,p as C,x as V,r as p,o as m,k as E,w as b,b as d,a as c,y as x,h as I,s as Y,c as y,e as u,F as $,z as j}from"./index-BVJ7n5iW.js";import{a as H}from"./useDocument-CzQCdGR-.js";const K={class:"btn-group"},P=R({__name:"ExperienceItem",props:{modelValue:{type:Object,default:()=>({_id:"",company:"",position:"",startDate:+new Date,endDate:+new Date,isCurrent:!1,description:"",image:"",website:""})}},emits:["onEdit","onDelete"],setup(t,{emit:v}){const D=v,g=t,n=C(()=>g.modelValue),w=C(()=>{const{startDate:r,endDate:a,isCurrent:l}=g.modelValue,f=V(r),_=l?"Hiện tại":V(a);return`${f} - ${_}`}),k=C(()=>({title:n.value.company,subTitle:n.value.position,date:w.value,description:n.value.description}));return(r,a)=>{const l=p("FontAwesomeIcon"),f=p("ItemTemplate");return m(),E(f,{"model-value":k.value},{default:b(()=>[d("div",K,[d("a",{class:"btn btn-sm btn-outline-danger icon",href:"javascript:void(0)",onClick:a[0]||(a[0]=_=>D("onDelete",{...n.value}))},[c(l,{icon:"fa-solid fa-trash"})]),d("a",{class:"btn btn-sm btn-outline-warning icon",href:"javascript:void(0)",onClick:a[1]||(a[1]=_=>D("onEdit",{...n.value}))},[c(l,{icon:"fa-solid fa-square-pen"})])])]),_:1},8,["model-value"])}}}),h="Vui lòng nhập",F=[{name:"_id",label:"ID",type:"hidden",placeholder:"Vui lòng nhập ID",valid:t=>t.mixed().nullable().default(null),col:"col-md-12",default:null},{name:"company",label:"Tên công ty",type:"text",placeholder:"Vui lòng nhập Tên công ty",valid:t=>t.string().max(100,"Tối đa 100 ký tự").required(h),default:""},{name:"position",label:"Vị trí",type:"text",placeholder:"Vui lòng nhập Vị trí",valid:t=>t.string().max(50,"Tối đa 50 ký tự").required(h),default:""},{name:"startDate",label:"Ngày bắt đầu",type:"date",placeholder:"Vui lòng nhập Ngày bắt đầu",valid:t=>t.string().required(h),col:"col-md-6",convertTo:"date",default:x(+new Date)},{name:"endDate",label:"Ngày Kết thúc",type:"date",placeholder:"Vui lòng nhập Ngày Kết thúc",valid:t=>t.string().required(h),col:"col-md-6",convertTo:"date",default:x(+new Date)},{name:"isCurrent",label:"Đang làm việc tại đây",type:"checkbox",placeholder:"",default:!1,valid:t=>t.boolean(),col:"col-md-12",cellClass:"text-center",convertTo:"boolean",checkedValue:!1},{name:"description",label:"Mô tả",type:"ckediter",valid:t=>t.string().required(h),col:"col-md-12",convertTo:"truncate",default:""}],z={class:"mb-4"},S={key:0,class:"clearfix"},U={class:"block-container"},G=d("button",{type:"button",class:"btn btn-secondary mx-3","data-bs-dismiss":"modal"},"Đóng",-1),Z={__name:"PageExperience",setup(t){const{experiences:v,removeRecordById:D,addRecordToList:g}=A({field:"experiences"}),{document:n,updateDoc:w,deleteDoc:k}=H({collection:"experience",fields:F}),r=I(),a=I(),l=Y(F);async function f(s){const o=(e=>(e.startDate=+new Date(e.startDate),e.endDate=+new Date(e.endDate),!e.isCurrent&&(e.isCurrent=!1),e))({...s});await w(o,e=>{const{data:i}=e;g(i)})}async function _(s){k({...s},"company",o=>{const{data:e}=o;D(e._id)})}function M(s){var e;const o=l.value.map(i=>i.name);for(const i of new Set(["_id",...o]))n[i]=s[i];n.startDate=x(n.startDate),n.endDate=x(n.endDate),(e=r.value)==null||e.show()}function N(){var s,o;for(const e of l.value)n[e.name]=e.default;(s=r.value)==null||s.show(),(o=a.value)==null||o.reset()}return(s,o)=>{const e=p("FontAwesomeIcon"),i=p("Heading"),q=p("ListTransition"),L=p("NoData");return m(),y($,null,[d("div",z,[c(i,{text:"Kinh nghiệm làm việc"},{default:b(()=>[d("button",{class:"btn btn-sm btn-success",onClick:o[0]||(o[0]=T=>N())},[c(e,{icon:"fa-solid fa-plus"})])]),_:1}),u(v).length?(m(),y("div",S,[c(q,null,{default:b(()=>[(m(!0),y($,null,j(u(v),T=>(m(),y("li",{key:T._id},[c(P,{"model-value":T,icon:"fa-building",onOnEdit:M,onOnDelete:_},null,8,["model-value"])]))),128))]),_:1})])):(m(),E(L,{key:1}))]),c(O,{ref_key:"refModal",ref:r,title:u(n)._id?`Chỉnh sửa: ${u(n).school}`:"Thêm mới kinh nghiệm làm việc","is-hidden-footer":""},{default:b(()=>[d("div",U,[c(B,{ref_key:"refVeeForm",ref:a,fields:l.value,document:u(n),"submit-fn":f,"submit-text":u(n)._id?"Cập nhật":"Thêm mới",buttonPosition:"end"},{button:b(()=>[G]),_:1},8,["fields","document","submit-text"])])]),_:1},8,["title"])],64)}}};export{Z as default};
