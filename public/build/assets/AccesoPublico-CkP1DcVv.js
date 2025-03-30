import{r as t,j as e,L as k,S}from"./app-DMpQA86v.js";import{B as g,D as L,a as I,b as E,c as V}from"./dialog-CZCOUsV5.js";import{I as u}from"./input-DwJfKTdf.js";import{L as p}from"./label-FtF91ial.js";import{o as C,v as D}from"./votacion-B5hyJPU0.js";const $=()=>e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"w-16 h-16 text-yellow-500",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("polyline",{points:"12 6 12 12 16 14"})]}),z=()=>e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"w-16 h-16 text-red-500",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("line",{x1:"15",y1:"9",x2:"9",y2:"15"}),e.jsx("line",{x1:"9",y1:"9",x2:"15",y2:"15"})]}),F=()=>e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"w-16 h-16 text-green-500",children:[e.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),e.jsx("polyline",{points:"22 4 12 14.01 9 11.01"})]}),j=()=>e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"w-6 h-6 text-destructive",children:[e.jsx("path",{d:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"}),e.jsx("line",{x1:"12",y1:"9",x2:"12",y2:"13"}),e.jsx("line",{x1:"12",y1:"17",x2:"12.01",y2:"17"})]}),B=()=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"w-8 h-8 animate-spin text-primary",children:e.jsx("path",{d:"M21 12a9 9 0 1 1-6.219-8.56"})}),M=()=>e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"w-4 h-4 mr-2",children:[e.jsx("path",{d:"M20 11a8.1 8.1 0 0 0-15.5-2m-.5 5v5h5"}),e.jsx("path",{d:"M4 13a8.1 8.1 0 0 0 15.5 2m.5-5V5h-5"})]});function P(){const[n,c]=t.useState({codigo:"",dni:""}),[v,d]=t.useState(!0),[x,h]=t.useState(!1),[a,i]=t.useState(null),[f,l]=t.useState(!1),[w,r]=t.useState(!1),[y,m]=t.useState("");t.useEffect(()=>{(async()=>{try{d(!0);const s=await C();console.log("Estado actual obtenido:",s),s.estado==="activa"?(l(!0),i(null)):(l(!1),i({estado:s.estado,mensaje:s.mensaje}))}catch(s){console.error("Error al verificar estado:",s),l(!1),i({estado:"error",mensaje:"Error al verificar el estado de la votación"})}finally{d(!1)}})()},[]);const b=async o=>{o.preventDefault(),h(!0);try{const s=await D(n);if(console.log("Respuesta recibida:",s),s.status==="error"){m(s.message||"Error al validar el acceso"),r(!0);return}if(!s.data)throw new Error("Respuesta inválida del servidor");const N={votante:{id:s.data.sediprano.id,codigo:s.data.sediprano.codigo,nombre:`${s.data.sediprano.primer_apellido} ${s.data.sediprano.segundo_apellido}, ${s.data.sediprano.user.name}`,area:s.data.sediprano.area},votacion:{id:s.data.votacion.id,nombre:s.data.votacion.nombre,descripcion:s.data.votacion.descripcion,fecha_inicio:s.data.votacion.fecha_inicio,fecha_fin:s.data.votacion.fecha_fin,candidatos:s.data.candidatos},candidatos:s.data.candidatos};sessionStorage.setItem("votacionData",JSON.stringify(N)),S.visit("/votacion-publica/emitir-voto")}catch(s){console.error("Error en validación de acceso:",s),m(s.message||"Error al validar el acceso. Intente nuevamente."),r(!0)}finally{h(!1)}};return v?e.jsx("div",{className:"flex flex-col items-center justify-center min-h-screen bg-gray-50",children:e.jsxs("div",{className:"flex flex-col items-center gap-4",children:[e.jsx(B,{}),e.jsx("p",{className:"text-lg text-gray-500",children:"Verificando estado de la votación..."})]})}):e.jsxs(e.Fragment,{children:[e.jsx(k,{title:"Acceso a Votación"}),e.jsx("div",{className:"flex items-center justify-center min-h-screen bg-gray-50",children:e.jsxs("div",{className:"flex flex-col items-center justify-center w-full max-w-md p-4 space-y-8",children:[e.jsxs("div",{className:"flex flex-col items-center space-y-2",children:[e.jsx("img",{src:"/img/logo-sedipro.png",alt:"SEDIPRO",className:"w-[180px] h-auto"}),e.jsx("h1",{className:"text-2xl font-bold tracking-tight text-center text-theme-azul",children:"Sistema de Votación"})]}),a?e.jsx("div",{className:`
              w-full p-6 rounded-lg shadow-sm border
              ${a.estado==="pendiente"?"border-yellow-200 bg-yellow-50":""}
              ${a.estado==="finalizada"?"border-red-200 bg-red-50":""}
              ${a.estado==="votado"?"border-green-200 bg-green-50":""}
              ${a.estado==="error"?"border-yellow-200 bg-yellow-50":""}
            `,children:e.jsxs("div",{className:"flex flex-col items-center gap-4 text-center",children:[a.estado==="pendiente"&&e.jsx($,{}),a.estado==="finalizada"&&e.jsx(z,{}),a.estado==="votado"&&e.jsx(F,{}),a.estado==="error"&&e.jsx(j,{}),e.jsxs("div",{className:`
                  ${a.estado==="pendiente"?"text-yellow-800":""}
                  ${a.estado==="finalizada"?"text-red-800":""}
                  ${a.estado==="votado"?"text-green-800":""}
                  ${a.estado==="error"?"text-yellow-800":""}
                `,children:[e.jsxs("h3",{className:"mb-2 text-xl font-semibold",children:[a.estado==="pendiente"&&"Votación Pendiente",a.estado==="finalizada"&&"Votación Finalizada",a.estado==="votado"&&"Voto Registrado",a.estado==="error"&&"Error"]}),e.jsx("p",{className:"text-sm",children:a.mensaje})]})]})}):f?e.jsx("div",{className:"w-full p-6 bg-white border rounded-lg shadow-sm",children:e.jsxs("form",{onSubmit:b,className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(p,{htmlFor:"codigo",children:"Código SEDIPRO"}),e.jsx(u,{id:"codigo",placeholder:"Ingresa tu código",value:n.codigo,onChange:o=>c(s=>({...s,codigo:o.target.value})),required:!0})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(p,{htmlFor:"dni",children:"DNI"}),e.jsx(u,{id:"dni",placeholder:"Ingresa tu DNI",value:n.dni,onChange:o=>c(s=>({...s,dni:o.target.value})),required:!0})]}),e.jsx(g,{type:"submit",className:"w-full bg-theme-azul hover:bg-theme-azul/90",disabled:x,children:x?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"}),"Validando..."]}):e.jsxs(e.Fragment,{children:[e.jsx(M,{}),"Acceder a Votación"]})})]})}):null,e.jsx("p",{className:"text-sm text-center text-gray-500",children:"Si tienes problemas para acceder, contacta al área de TI"})]})}),e.jsx(L,{open:w,onOpenChange:r,children:e.jsxs(I,{className:"sm:max-w-md",children:[e.jsx(E,{className:"space-y-4",children:e.jsxs(V,{className:"flex items-center gap-2",children:[e.jsx(j,{}),e.jsx("span",{children:"Acceso no válido"})]})}),e.jsx("div",{className:"py-4",children:e.jsx("span",{className:"text-base text-gray-500",children:y})}),e.jsx("div",{className:"flex justify-end pt-4 border-t",children:e.jsx(g,{variant:"outline",onClick:()=>r(!1),children:"Entendido"})})]})})]})}export{P as default};
