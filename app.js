const CONFIG={url:"https://gmytxjtwemxjdnzzarvu.supabase.co",key:"sb_publishable_Sdi60ctFxmet-WYtQOwkfw_ZS7R_5Jj",rpc:"submit_goodlife_lead",consent:"2026-09"};
const $=selector=>document.querySelector(selector);
const params=new URLSearchParams(location.search);
const campaign=params.get("utm_campaign")||"goodlife-website";
const medium=params.get("utm_medium")||"website";
const clean=value=>(value||"").trim();
let statusTimer;
function status(message,type="saved"){
 const node=$("#dwkStatus");node.textContent=message;node.className=type;
 clearTimeout(statusTimer);statusTimer=setTimeout(()=>node.className="",5500);
}
async function deliver(payload){
 try{
  const response=await fetch(`${CONFIG.url}/rest/v1/rpc/${CONFIG.rpc}`,{method:"POST",headers:{apikey:CONFIG.key,Authorization:`Bearer ${CONFIG.key}`,"Content-Type":"application/json"},body:JSON.stringify(payload)});
  if(!response.ok)throw new Error(`Request failed (${response.status})`);
  const result=await response.json();
  return Array.isArray(result)?result[0]:result;
 }catch(error){console.error("GoodLife enquiry error",error);return null}
}
function basePayload(contact,phone,service,notes){
 return {p_contact:contact,p_phone:phone,p_service:service,p_notes:notes,p_source_channel:"website",p_source_campaign:campaign,p_source_medium:medium,p_referrer:document.referrer||"direct",p_origin:location.origin,p_consent_version:CONFIG.consent};
}
document.querySelectorAll(".card[data-service]").forEach(card=>{
 card.tabIndex=0;card.setAttribute("role","link");
 const go=()=>location.href=`service.html?service=${encodeURIComponent(card.dataset.service)}`;
 card.addEventListener("click",event=>{if(!event.target.closest("a,button"))go()});
 card.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();go()}});
});
const slides=[...document.querySelectorAll(".slide")],dots=$(".dots"),carousel=$(".carousel");
let current=0,timer;
function showSlide(index){
 current=(index+slides.length)%slides.length;
 slides.forEach((slide,i)=>slide.classList.toggle("active",i===current));
 [...dots.children].forEach((dot,i)=>{dot.classList.toggle("active",i===current);dot.setAttribute("aria-current",i===current?"true":"false")});
}
slides.forEach((_,i)=>{const dot=document.createElement("button");dot.type="button";dot.setAttribute("aria-label",`Show completed project ${i+1}`);dot.addEventListener("click",()=>{showSlide(i);restart()});dots.append(dot)});
function start(){timer=setInterval(()=>showSlide(current+1),5000)}function stop(){clearInterval(timer)}function restart(){stop();start()}
$(".prev").addEventListener("click",()=>{showSlide(current-1);restart()});$(".next").addEventListener("click",()=>{showSlide(current+1);restart()});
carousel.addEventListener("mouseenter",stop);carousel.addEventListener("mouseleave",start);carousel.addEventListener("focusin",stop);carousel.addEventListener("focusout",start);carousel.addEventListener("keydown",event=>{if(event.key==="ArrowLeft")showSlide(current-1);if(event.key==="ArrowRight")showSlide(current+1)});showSlide(0);start();
const serviceNames={"aluminum-carports-awnings":"Aluminum Carports/Awnings","colorplus-carports-awnings":"Colorplus Carports and Awnings",shadenets:"Shadenets","patio-balcony-awnings":"Patio / Balcony Awnings","retaining-walls":"Retaining Walls","driveway-paving":"Driveway Paving","walkway-paving":"Walkway Paving",other:"Other"};
if(params.has("service")){const selected=serviceNames[params.get("service")];if(selected)$("#sv").value=selected}
const contactActions=[
 {button:"#callBtn",line:"#callLine",service:"Contact click — Call",phone:"0000000000",notes:"Customer selected the Call Grant button. Placeholder phone used for a contact-click event."},
 {button:"#waBtn",line:"#waLine",service:"Contact click — WhatsApp",phone:"0000000000",notes:"Customer selected the WhatsApp button. Placeholder phone used for a contact-click event."},
 {button:"#mailBtn",line:"#emailLine",service:"Contact click — Email",phone:"0000000000",notes:"Customer selected the Email button. Placeholder phone used for a contact-click event."}
];
contactActions.forEach(action=>{
 const button=$(action.button),line=$(action.line);let revealed=false;
 button.addEventListener("click",async event=>{
  if(revealed)return;
  event.preventDefault();revealed=true;line.hidden=false;
  const destination=button.href;button.textContent=action.service.replace("Contact click — ","");
  const result=await deliver(basePayload("Website visitor",action.phone,action.service,action.notes));
  if(result)status(`Contact request recorded${result.lead_ref?` — reference ${result.lead_ref}`:""}.`);else status("The contact details are shown. Tracking could not be confirmed.","error");
  if(action.button==="#waBtn")window.open(destination,"_blank","noopener");else location.href=destination;
 });
});
$("#quoteForm").addEventListener("submit",async event=>{
 event.preventDefault();
 const name=clean($("#nm").value),phone=clean($("#ph").value),service=clean($("#sv").value),details=clean($("#msg").value);
 if(!name||!phone||!service||!details||!$("#dwkConsent").checked){status("Please complete every field and accept the consent statement.","error");return}
 const button=event.submitter||event.currentTarget.querySelector("button[type=submit]");button.disabled=true;button.textContent="Sending…";
 const result=await deliver(basePayload(name,phone,service,details));
 const message=`Hi Grant, my name is ${name}. I need a quote for ${service}. My phone number is ${phone}. Project details: ${details}`;
 if(result){status(`Quotation request sent${result.lead_ref?` — reference ${result.lead_ref}`:""}.`);event.currentTarget.reset()}else status("Your WhatsApp message is ready, but online tracking could not be confirmed.","error");
 window.open(`https://wa.me/27637522149?text=${encodeURIComponent(message)}`,"_blank","noopener");button.disabled=false;button.textContent="Request My Quote";
});
