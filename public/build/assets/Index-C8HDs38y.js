import{m as y,r as n,j as e,S as j,L as k}from"./app-DMpQA86v.js";import{A as F}from"./AuthenticatedLayout-C7SyfY9Z.js";import{D as E,a as M,b as R,c as $,B as d}from"./dialog-CZCOUsV5.js";import{I as N}from"./input-DwJfKTdf.js";import{L as z}from"./label-FtF91ial.js";import{d as A,m as b,F as I,a as L,C as O}from"./ConfirmDialog-CUOnWxoa.js";import{F as B}from"./PlusIcon-CRYNvhOB.js";import{F as T}from"./PencilIcon-VtQjBVAG.js";import{f as _}from"./format-DF3zju1I.js";import{e as q}from"./es-DWfJTDW_.js";function G({isOpen:s,onClose:c,carrera:t,mode:r}){const{data:p,setData:o,post:h,put:m,processing:u,errors:x,reset:i}=y({nombre:""});n.useEffect(()=>{s&&r==="edit"&&t?o({nombre:t.nombre}):s&&r==="create"&&i("nombre")},[s,t,r]);const g=l=>{l.preventDefault(),r==="create"?h(route("carreras.store"),{onSuccess:()=>{i(),c()}}):m(route("carreras.update",t==null?void 0:t.id),{onSuccess:()=>{c()}})};return e.jsx(E,{open:s,onOpenChange:l=>!l&&c(),children:e.jsxs(M,{className:"sm:max-w-[500px]",children:[e.jsx(R,{children:e.jsx($,{children:r==="create"?"Nueva Carrera":"Editar Carrera"})}),e.jsxs("form",{onSubmit:g,className:"mt-4 space-y-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsxs(z,{htmlFor:"nombre",children:["Nombre ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx(N,{id:"nombre",value:p.nombre,onChange:l=>o("nombre",l.target.value),placeholder:"Ej: Ingeniería de Sistemas"}),x.nombre&&e.jsx("p",{className:"text-sm text-red-500",children:x.nombre})]}),e.jsxs("div",{className:"flex justify-end space-x-2",children:[e.jsx(d,{type:"button",variant:"outline",onClick:c,children:"Cancelar"}),e.jsx(d,{type:"submit",disabled:u,children:r==="create"?"Crear":"Actualizar"})]})]})]})})}function Z({carreras:s,filters:c}){const[t,r]=n.useState(c.search),[p,o]=n.useState(!1),[h,m]=n.useState(null),[u,x]=n.useState(!1),[i,g]=n.useState(null),{delete:l}=y({}),v=n.useCallback(A(a=>{j.get(route("carreras.index"),{search:a},{preserveState:!0,preserveScroll:!0})},300),[]),C=a=>{r(a.target.value),v(a.target.value)},w=a=>{j.get(route("carreras.index",{page:a}),{search:t},{preserveState:!0})},S=a=>{g(a),x(!0)},D=()=>{i&&l(route("carreras.destroy",i.id))};return e.jsxs(F,{children:[e.jsx(k,{title:"Carreras"}),e.jsxs("div",{className:"p-8",children:[e.jsxs(b.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},className:"flex items-center justify-between gap-4",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-semibold text-gray-900",children:"Carreras"}),e.jsx("p",{className:"mt-1 text-gray-500",children:"Gestiona las carreras universitarias"})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("div",{className:"relative",children:[e.jsx(N,{type:"search",placeholder:"Buscar carreras...",value:t,onChange:C,className:"w-[300px] pl-10"}),e.jsx(I,{className:"absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2"})]}),e.jsxs(d,{onClick:()=>{m(null),o(!0)},className:"gap-2",children:[e.jsx(B,{className:"w-5 h-5"}),"Nueva Carrera"]})]})]}),e.jsxs(b.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"mt-8 bg-white shadow-sm rounded-xl",children:[e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"min-w-full divide-y divide-gray-200",children:[e.jsx("thead",{className:"bg-gray-50",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase",children:"Nombre"}),e.jsx("th",{className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase",children:"Fecha Creación"}),e.jsx("th",{className:"px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase",children:"Acciones"})]})}),e.jsx("tbody",{className:"bg-white divide-y divide-gray-200",children:s.data.map((a,f)=>e.jsxs(b.tr,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{delay:f*.05},className:"hover:bg-gray-50/50",children:[e.jsx("td",{className:"px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap",children:a.nombre}),e.jsx("td",{className:"px-6 py-4 text-sm text-gray-500 whitespace-nowrap",children:_(new Date(a.created_at),"dd MMM yyyy",{locale:q})}),e.jsxs("td",{className:"px-6 py-4 text-sm font-medium text-right whitespace-nowrap",children:[e.jsx(d,{onClick:()=>{m(a),o(!0)},variant:"ghost",className:"p-1 mr-2 bg-transparent hover:bg-blue-50 group",children:e.jsx(T,{className:"w-[18px] h-[18px] text-black group-hover:text-blue-600"})}),e.jsx(d,{onClick:()=>S(a),variant:"ghost",className:"p-1 mr-2 bg-transparent hover:bg-red-50 group",children:e.jsx(L,{className:"w-[18px] h-[18px] text-black group-hover:text-red-600"})})]})]},a.id))})]})}),s.last_page>1&&e.jsx("div",{className:"px-6 py-4 bg-white border-t border-gray-200",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("p",{className:"text-sm text-gray-700",children:["Mostrando ",s.from," a ",s.to," de ",s.total," carreras"]}),e.jsx("div",{className:"flex gap-2",children:s.links.map((a,f)=>a.url===null?null:e.jsx(d,{onClick:()=>w(Number(a.label)),className:`${a.active?"bg-theme-azul border-theme-azul text-white hover:bg-theme-azul/90":"border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"} w-10 h-10 p-0 font-medium`,disabled:!a.url,children:a.label},f))})]})})]})]}),e.jsx(G,{isOpen:p,onClose:()=>{o(!1),m(null)},carrera:h,mode:h?"edit":"create"}),e.jsx(O,{isOpen:u,onClose:()=>x(!1),onConfirm:D,title:"Confirmar eliminación",message:`¿Estás seguro que deseas eliminar la carrera ${i==null?void 0:i.nombre}? Esta acción no se puede deshacer.`})]})}export{Z as default};
