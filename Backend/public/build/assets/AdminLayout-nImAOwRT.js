import{r as n,b as x,a as s,j as e}from"./app-1-J-Rkvr.js";import{u as f}from"./use-toast-BCIsxhQE.js";import{c as a,B as k}from"./label-BV62W-PP.js";import{H as b,U as v,h as j}from"./Footer-D5nGiAW4.js";/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]],_=a("camera",N);/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]],L=a("clipboard-list",w);/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],S=a("file-text",M);/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]],A=a("layout-dashboard",T);/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]],$=a("log-out",I);/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]],z=a("target",H);/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]],P=a("trending-up",C);/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=[["path",{d:"M18 21a8 8 0 0 0-16 0",key:"3ypg7q"}],["circle",{cx:"10",cy:"8",r:"5",key:"o932ke"}],["path",{d:"M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3",key:"10s06x"}]],E=a("users-round",U),B="http://localhost:8000/api";function O({children:i}){const[d,h]=n.useState(!1),[m,c]=n.useState(!0),{toast:l}=f(),{url:o}=x(),r=o==="/admin/login";n.useEffect(()=>{if(console.log("AdminLayout useEffect running, url:",o,"isLoginPage:",r),r){console.log("Login page detected, skipping auth check"),c(!1);return}const t=localStorage.getItem("adminToken");console.log("Checking localStorage adminToken:",t),t?(h(!0),c(!1)):s.visit("/admin/login")},[o,r]);const g=async()=>{try{const t=localStorage.getItem("adminToken");await fetch(`${B}/auth/logout`,{method:"POST",headers:{Authorization:`Bearer ${t}`}}),localStorage.removeItem("adminToken"),localStorage.removeItem("adminUser"),l({title:"Logged Out",description:"You have been successfully logged out."}),s.visit("/admin/login")}catch(t){console.error("Logout error:",t),localStorage.removeItem("adminToken"),localStorage.removeItem("adminUser"),l({title:"Logout Error",description:"There was an error logging out, but local session cleared."}),s.visit("/admin/login")}},u=[{name:"Dashboard",href:"/admin/dashboard",icon:A},{name:"Sponsors",href:"/admin/sponsors",icon:E},{name:"Projects",href:"/admin/projects",icon:z},{name:"Campaigns",href:"/admin/campaigns",icon:P},{name:"Blog",href:"/admin/blog",icon:S},{name:"Gallery",href:"/admin/gallery",icon:_},{name:"Team",href:"/admin/team",icon:v},{name:"Applications",href:"/admin/applications",icon:L}];return r?e.jsx(e.Fragment,{children:i}):m?e.jsx("div",{className:"min-h-screen flex items-center justify-center",children:e.jsx("div",{className:"animate-spin rounded-full h-32 w-32 border-b-2 border-[#e51083]"})}):d?e.jsxs("div",{className:"min-h-screen bg-gray-900 flex flex-col",children:[e.jsx(b,{}),e.jsxs("div",{className:"flex",children:[e.jsxs("div",{className:"w-64 bg-gray-800 min-h-screen pt-16 left-0 top-0 border-r border-gray-700",children:[e.jsxs("div",{className:"p-6 border-b border-gray-700",children:[e.jsx("h1",{className:"text-white text-xl font-semibold mb-4",children:"Admin Dashboard"}),e.jsxs(k,{onClick:g,variant:"ghost",size:"sm",className:"flex items-center gap-2 w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white",children:[e.jsx($,{className:"h-4 w-4"}),"Logout"]})]}),e.jsx("nav",{className:"py-6",children:u.map(t=>{const y=t.icon,p=o===t.href;return e.jsxs("button",{onClick:()=>s.visit(t.href),className:`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${p?"bg-gray-700 text-white border-r-2 border-pink-500":"text-gray-300 hover:bg-gray-700 hover:text-white"}`,children:[e.jsx(y,{className:"h-5 w-5"}),e.jsx("span",{className:"font-medium",children:t.name})]},t.name)})})]}),e.jsxs("div",{className:"flex-1 pt-16 min-h-screen bg-gray-900",children:[e.jsx("main",{className:"p-6",children:i}),e.jsx(j,{})]})]})]}):e.jsx("div",{className:"min-h-screen flex items-center justify-center",children:e.jsx("div",{className:"animate-spin rounded-full h-32 w-32 border-b-2 border-[#e51083]"})})}const R=Object.freeze(Object.defineProperty({__proto__:null,default:O},Symbol.toStringTag,{value:"Module"}));export{O as A,L as C,R as a};
