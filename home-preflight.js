/* Prevent obsolete contact details from flashing before Home is ready. */
(()=>{
 "use strict";
 const frame=document.getElementById("goodlifeSite");
 if(!frame)return;
 frame.setAttribute("aria-busy","true");
 function reveal(){
  let doc;
  try{doc=frame.contentDocument||frame.contentWindow.document}catch{return}
  const oldContactRow=doc.getElementById("topPhone")?.parentElement?.parentElement;
  if(oldContactRow)oldContactRow.remove();
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
   frame.classList.add("site-ready");
   frame.removeAttribute("aria-busy");
  }));
 }
 frame.addEventListener("load",reveal,{once:true});
 try{if(frame.contentDocument?.readyState==="complete")reveal()}catch{}
 setTimeout(()=>{if(!frame.classList.contains("site-ready"))reveal()},1200);
})();