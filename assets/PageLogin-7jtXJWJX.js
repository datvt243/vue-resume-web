import{_ as m}from"./VeeForm-ZD-0KBCl.js";import{c,a,u as p,i as n,r as u,o as d}from"./index-DAxs4nOd.js";import{h}from"./auth-SF7ZY20U.js";const _={class:"auth-container m-auto",style:{"max-width":"500px"}},k={__name:"PageLogin",setup(g){const t=p(),o=n("spinner"),i=n("toast"),s=[{name:"email",label:"Email",type:"email",text:"We'll never share your email with anyone else.",placeholder:"Vui lòng nhập Email",valid:e=>e.string().email("Email sai định dạng").required("Email là bắt buộc")},{name:"password",label:"Mật khẩu",type:"password",valid:e=>e.string().required("Mật khẩu là bắt buộc")},{name:"rememberMe",label:"Ghi nhớ đăng nhập",type:"checkbox"}];async function r(e){await h(e,{loading:o,toast:i,router:t})}return(e,f)=>{const l=u("Heading");return d(),c("div",_,[a(l,{text:"Đăng nhập"}),a(m,{fields:s,"submit-fn":r,"submit-text":"Login"})])}}};export{k as default};
