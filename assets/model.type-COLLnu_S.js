import{y as n}from"./index-BVJ7n5iW.js";import{p as d}from"./regex.config-BmDLDyGj.js";const t="Vui lòng nhập",i={name:"_id",label:"ID",type:"hidden",placeholder:"Vui lòng nhập",valid:e=>e.string().nullable().default(null),col:"col-md-12",default:null},o=function(e){return{name:e.name,label:e.label,type:"ckediter",valid:l=>l.string().trim().required(t),col:(e==null?void 0:e.col)||"col-md-12",convertTo:"truncate",default:""}},m=function(e){return{name:e.name,label:e.label,type:"text",valid:l=>l.string().url().nullable(),col:(e==null?void 0:e.col)||"col-md-12",default:""}},f=function(e){return{name:e.name,label:e.label,type:"date",valid:l=>l.string().required(t),default:new Date("1990-01-01"),col:(e==null?void 0:e.col)||"col-md-12"}},r=function(){const e="Ngày bắt đầu",l="Ngày kết thúc";return[{name:"startDate",label:e,type:"date",placeholder:`Vui lòng nhập ${e}`,valid:a=>a.date().required(t),col:"col-md-6",convertTo:"date",default:n(+new Date)},{name:"endDate",label:l,type:"date",placeholder:`Vui lòng nhập ${l}`,valid:a=>a.date().required(t).min(a.ref("startDate"),`${l} phải sau ngày bắt đầu`),col:"col-md-6",convertTo:"date",default:n(+new Date)}]},b=function(e){return{name:e.name,label:e.label,type:"checkbox",placeholder:(e==null?void 0:e.placeholder)||"",default:!1,valid:l=>l.boolean(),col:(e==null?void 0:e.col)||"col-md-12",cellClass:"text-center",convertTo:"boolean",checkedValue:!1}},h=function(e){return{name:e.name,label:e.label,type:"text",valid:l=>l.string().matches(d,{excludeEmptyString:!0,message:"Số điện thoại không đúng định dạng. Bắt đầu bằng 84 hoặc 0, bao gồm 11 số"}).required(t),default:"",col:"col-md-12"}};export{f as a,h as b,o as c,i as d,r as e,b as f,m as g};
