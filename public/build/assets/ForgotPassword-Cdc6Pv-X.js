import{m as n,j as e,L as d}from"./app-DMpQA86v.js";import{T as u,I as c}from"./TextInput-BTaubPtK.js";import{P as x}from"./PrimaryButton-BXTpJWoD.js";import{G as p}from"./GuestLayout-QhMSnnIX.js";function h({status:a}){const{data:t,setData:o,post:r,processing:m,errors:l}=n({email:""}),i=s=>{s.preventDefault(),r(route("password.email"))};return e.jsxs(p,{children:[e.jsx(d,{title:"Forgot Password"}),e.jsx("div",{className:"mb-4 text-sm text-gray-600",children:"Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one."}),a&&e.jsx("div",{className:"mb-4 text-sm font-medium text-green-600",children:a}),e.jsxs("form",{onSubmit:i,children:[e.jsx(u,{id:"email",type:"email",name:"email",value:t.email,className:"mt-1 block w-full",isFocused:!0,onChange:s=>o("email",s.target.value)}),e.jsx(c,{message:l.email,className:"mt-2"}),e.jsx("div",{className:"mt-4 flex items-center justify-end",children:e.jsx(x,{className:"ms-4",disabled:m,children:"Email Password Reset Link"})})]})]})}export{h as default};
