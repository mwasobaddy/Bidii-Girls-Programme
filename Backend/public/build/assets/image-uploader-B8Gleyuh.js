import{c as r,B as d,I as v}from"./label-BV62W-PP.js";import{r as y,j as a}from"./app-1-J-Rkvr.js";import{X as x}from"./Footer-D5nGiAW4.js";import{I as j}from"./database-error-D1QB9TqC.js";/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],_=r("eye",N);/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],T=r("trash-2",b);/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]],D=r("upload",k);function $({currentImage:o,onImageSelected:c,aspectRatio:p="16:9"}){const[m,t]=y.useState(!1),n=e=>{if(e&&e.type.startsWith("image/")){const i=new FileReader;i.onload=f=>{c(f.target.result)},i.readAsDataURL(e)}},s=e=>{e.preventDefault(),e.stopPropagation(),e.type==="dragenter"||e.type==="dragover"?t(!0):e.type==="dragleave"&&t(!1)},h=e=>{e.preventDefault(),e.stopPropagation(),t(!1),e.dataTransfer.files&&e.dataTransfer.files[0]&&n(e.dataTransfer.files[0])},g=e=>{e.target.files&&e.target.files[0]&&n(e.target.files[0])},u=()=>{c("")},l=()=>{switch(p){case"1:1":return"aspect-square";case"4:3":return"aspect-[4/3]";case"16:9":default:return"aspect-video"}};return a.jsx("div",{className:"space-y-4",children:o?a.jsxs("div",{className:"relative",children:[a.jsx("div",{className:`${l()} bg-gray-100 rounded-lg overflow-hidden`,children:a.jsx("img",{src:o,alt:"Selected image",className:"w-full h-full object-cover"})}),a.jsx(d,{type:"button",size:"sm",variant:"destructive",className:"absolute top-2 right-2",onClick:u,children:a.jsx(x,{className:"h-3 w-3"})})]}):a.jsx("div",{className:`${l()} border-2 border-dashed ${m?"border-blue-400 bg-blue-50":"border-gray-300"} rounded-lg transition-colors duration-200`,onDragEnter:s,onDragLeave:s,onDragOver:s,onDrop:h,children:a.jsxs("div",{className:"h-full flex flex-col items-center justify-center p-4 text-center",children:[a.jsx(j,{className:"h-8 w-8 text-gray-400 mb-2"}),a.jsx("p",{className:"text-sm text-gray-600 mb-2",children:"Drag & drop an image here, or click to select"}),a.jsx(v,{type:"file",accept:"image/*",onChange:g,className:"hidden",id:"image-upload"}),a.jsxs(d,{type:"button",variant:"outline",size:"sm",onClick:()=>document.getElementById("image-upload").click(),children:[a.jsx(D,{className:"h-4 w-4 mr-2"}),"Select Image"]})]})})})}export{_ as E,$ as I,T,D as U};
