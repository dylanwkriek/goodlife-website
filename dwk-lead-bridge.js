/* DwK live lead bridge — GoodLife */
(()=>{"use strict";
const CONFIG={
 businessId:"goodlife",
 businessName:"GoodLife Awnings & Pavings",
 commissionRate:5,
 schemaVersion:"dwk.lead.v1",
 supabaseUrl:"https://gmytxjtwemxjdnzzarvu.supabase.co",
 publishableKey:"sb_publishable_Sdi60ctFxmet-WYtQOwkfw_ZS7R_5Jj",
 queueKey:"dwk_goodlife_lead_queue",
 consentVersion:"2026-09"
};
const frame=document.getElementById("goodlifeSite"),status=document.getElementById("dwkStatus");
const source=()=>{
 const p=new URLSearchParams(location.search),ref=document.referrer||"";
 let channel=p.get("utm_source")||p.get("source")||"Direct";
 if(!p.get("utm_source")){
  if(/google/i.test(ref))channel="Google";
  else if(/facebook|fb\./i.test(ref))channel="Facebook";
  else if(/instagram/i.test(ref))channel="Instagram";
 }
 return {channel,campaign:p.get("utm_campaign")||"",medium:p.get("utm_medium")||"",referrer:ref?new URL(ref).hostname:""};
};
const clean=v=>String(v||"").trim().slice(0,1000);
const queue=lead=>{const items=JSON.parse(localStorage.getItem(CONFIG.queueKey)||"[]");items.push(lead);localStorage.setItem(CONFIG.queueKey,JSON.stringify(items.slice(-100)));};
const makeLead=doc=>{
 const name=doc.getElementById("nm"),phone=doc.getElementById("ph"),service=doc.getElementById("sv"),message=doc.getElementById("msg");
 return {
  schema:CONFIG.schemaVersion,
  id:"GL-"+Date.now()+"-"+crypto.getRandomValues(new Uint32Array(1))[0].toString(16),
  business:CONFIG.businessId,
  company:clean(name?.value)||"Website enquiry",
  contact:clean(name?.value),
  phone:clean(phone?.value),
  service:clean(service?.value),
  notes:clean(message?.value),
  source:source(),
  stage:"New",
  value:0,
  probability:20,
  commissionRate:CONFIG.commissionRate,
  consent:{purpose:"Respond to quotation request",version:CONFIG.consentVersion,capturedAt:new Date().toISOString()},
  createdAt:new Date().toISOString(),
  origin:location.origin
 };
};
async function deliver(lead){
 try{
  const response=await fetch(CONFIG.supabaseUrl+"/rest/v1/rpc/submit_goodlife_lead",{
   method:"POST",
   headers:{
    apikey:CONFIG.publishableKey,
    Authorization:"Bearer "+CONFIG.publishableKey,
    "Content-Type":"application/json"
   },
   body:JSON.stringify({
    p_contact:lead.contact,
    p_phone:lead.phone,
    p_service:lead.service,
    p_notes:lead.notes,
    p_source_channel:lead.source.channel,
    p_source_campaign:lead.source.campaign,
    p_source_medium:lead.source.medium,
    p_referrer:lead.source.referrer,
    p_origin:lead.origin,
    p_consent_version:lead.consent.version
   }),
   credentials:"omit",
   referrerPolicy:"strict-origin"
  });
  if(!response.ok){const body=await response.text();throw new Error(body||"Submission failed");}
  const result=await response.json();
  return {sent:true,reference:result.reference};
 }catch(error){
  queue(lead);
  return {queued:true,error:true};
 }
}
function attach(){
 let doc;
 try{doc=frame.contentDocument||frame.contentWindow.document}catch(e){status.textContent="DwK bridge unavailable";return}
 const form=doc.querySelector("#contact form");
 if(!form){status.textContent="DwK quote form not found";return}
 if(form.dataset.dwkConnected)return;
 form.dataset.dwkConnected="true";
 const note=doc.createElement("label");
 note.className="small";
 note.style.cssText="display:flex;gap:8px;align-items:flex-start;line-height:1.45;margin:4px 0 8px";
 note.innerHTML='<input id="dwkConsent" type="checkbox" required style="width:auto;margin-top:3px"> <span>I agree that GoodLife may use these details to respond to my quotation request. My information will not be used for unrelated marketing.</span>';
 const submit=form.querySelector('button[type="submit"]');
 form.insertBefore(note,submit);
 form.addEventListener("submit",async event=>{
  const consent=doc.getElementById("dwkConsent");
  if(!consent?.checked){event.preventDefault();consent?.focus();return}
  event.preventDefault();
  const lead=makeLead(doc);
  status.textContent="Recording enquiry…";
  const result=await deliver(lead);
  if(result.sent){
   status.textContent="Enquiry recorded • "+result.reference;
   status.className="saved";
   form.reset();
  }else{
   status.textContent="Connection unavailable—enquiry saved on this device";
   status.className="";
  }
  window.dispatchEvent(new CustomEvent("dwk:lead-captured",{detail:{id:result.reference||lead.id,business:lead.business}}));
 },true);
 ["callBtn","waBtn","mailBtn","heroWa"].forEach(id=>{
  doc.getElementById(id)?.addEventListener("click",()=>{
   const events=JSON.parse(localStorage.getItem("dwk_goodlife_contact_events")||"[]");
   events.push({id:"EV-"+Date.now(),business:CONFIG.businessId,type:id,source:source(),createdAt:new Date().toISOString()});
   localStorage.setItem("dwk_goodlife_contact_events",JSON.stringify(events.slice(-200)));
  });
 });
 status.textContent="DwK lead capture ready";
 status.className="ready";
}
frame.addEventListener("load",attach);
})();