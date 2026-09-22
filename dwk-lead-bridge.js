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
   keepalive:true,
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
function makeContactEvent(label){
 const attribution=source();
 return {
  schema:CONFIG.schemaVersion,
  id:"GL-EV-"+Date.now()+"-"+crypto.getRandomValues(new Uint32Array(1))[0].toString(16),
  business:CONFIG.businessId,
  company:"Website contact click",
  contact:"Anonymous website visitor",
  phone:"0000000000",
  service:label,
  notes:label+" recorded on the GoodLife website. This confirms button intent only, not a completed call or sent email. 0000000000 is a technical placeholder, not a customer number.",
  source:{...attribution,channel:"Website "+label},
  stage:"New",
  value:0,
  probability:10,
  commissionRate:CONFIG.commissionRate,
  consent:{purpose:"Anonymous contact-action measurement",version:CONFIG.consentVersion,capturedAt:new Date().toISOString()},
  createdAt:new Date().toISOString(),
  origin:location.origin
 };
}
function attach(){
 let doc;
 try{doc=frame.contentDocument||frame.contentWindow.document}catch(e){status.textContent="DwK bridge unavailable";return}
 const grantPhone="27637522149",grantPhoneDisplay="063 752 2149";
 const headerBrandName=doc.querySelector(".brand .logo");
 if(headerBrandName)headerBrandName.innerHTML="<span>Awnings &amp; Pavings</span>";
 const brandLogo=doc.querySelector(".brand img");
 const hero=doc.querySelector(".hero");
 const heroLogo=doc.querySelector(".hero > img");
 if(brandLogo&&hero&&heroLogo){
  heroLogo.src=brandLogo.src;
  heroLogo.alt="GoodLife knight logo";
  heroLogo.style.cssText="width:100%;height:510px;object-fit:contain;background:#050505";
  const logoLockup=doc.createElement("div");
  logoLockup.className="hero-logo-lockup";
  logoLockup.style.cssText="position:relative;display:grid;place-items:center;min-width:0";
  hero.insertBefore(logoLockup,hero.firstElementChild);
  logoLockup.append(heroLogo);
  const logoName=doc.createElement("div");
  logoName.textContent="GoodLife";
  logoName.setAttribute("aria-label","GoodLife");
  logoName.style.cssText="position:absolute;left:50%;bottom:18px;transform:translateX(-50%);color:#fff;font-size:clamp(34px,5vw,62px);font-weight:950;line-height:1;letter-spacing:.02em;white-space:nowrap;text-shadow:0 3px 12px #000,0 0 20px #e00000";
  logoLockup.append(logoName);
 }
 const retainingCard=[...doc.querySelectorAll(".card")].find(card=>card.querySelector("h3")?.textContent.trim()==="Retaining Walls");
 const retainingImage=retainingCard?.querySelector("img");
 if(retainingImage){
  retainingImage.src="retaining-walls-grant.jpg";
  retainingImage.alt="Completed curved block retaining wall installed by GoodLife";
 }
 const areaChips=doc.querySelector("#area .chips");
 if(areaChips){
  const existing=new Set([...areaChips.querySelectorAll(".chip")].map(chip=>chip.textContent.trim()));
  const surrounding=[...areaChips.querySelectorAll(".chip")].find(chip=>chip.textContent.trim()==="Surrounding areas");
  ["Trafalgar","Port Edward","Marina Beach"].forEach(place=>{
   if(existing.has(place))return;
   const chip=doc.createElement("span");chip.className="chip";chip.textContent=place;
   areaChips.insertBefore(chip,surrounding||null);
  });
 }
 const phoneDisplay=doc.getElementById("phoneDisplay"),whatsappDisplay=doc.getElementById("whatsappDisplay");
 if(phoneDisplay)phoneDisplay.textContent=grantPhoneDisplay;
 if(whatsappDisplay)whatsappDisplay.textContent=grantPhoneDisplay;
 const callButton=doc.getElementById("callBtn"),whatsappButton=doc.getElementById("waBtn");
 if(callButton)callButton.href=`tel:+${grantPhone}`;
 if(whatsappButton){
  const message="Hi, I found GoodLife Awnings and Pavings online and would like to request a quotation.";
  whatsappButton.href=`https://wa.me/${grantPhone}?text=${encodeURIComponent(message)}`;
 }
 const topContactRow=doc.getElementById("topPhone")?.parentElement?.parentElement;
 if(topContactRow)topContactRow.remove();
 const heroWhatsApp=doc.getElementById("heroWa");
 const heroServices=doc.querySelector('.hero .actions a[href="#work"]');
 if(heroWhatsApp)heroWhatsApp.remove();
 if(heroServices){heroServices.href="#services";heroServices.textContent="Explore Our Services";heroServices.className="btn primary"}
 const ownerLogo=doc.querySelector("#about .gm img");
 const ownerLogoPanel=doc.querySelector("#about .gm");
 const ownerBox=doc.querySelector("#about .box");
 const areaMark=doc.querySelector("#area .map");
 if(ownerLogo&&areaMark){
  const logo=ownerLogo.cloneNode(true);
  logo.style.cssText="height:230px;width:100%;object-fit:contain";
  areaMark.textContent="";
  areaMark.style.cssText="display:grid;place-items:center;gap:12px;padding:24px";
  areaMark.append(logo);
  const caption=doc.createElement("strong");caption.textContent="SOUTH COAST • KZN";areaMark.append(caption);
  ownerLogoPanel?.remove();
  if(ownerBox)ownerBox.style.gridColumn="1/-1";
 }
 const contactReveal={
  callBtn:{label:"Call click",displayId:"phoneDisplay",nextLabel:"Call Grant Now",openImmediately:false},
  waBtn:{label:"WhatsApp click",displayId:"whatsappDisplay",nextLabel:"Open WhatsApp Again",openImmediately:true},
  mailBtn:{label:"Email click",displayId:"emailDisplay",nextLabel:"Compose Email",openImmediately:false}
 };
 Object.values(contactReveal).forEach(item=>{
  const line=doc.getElementById(item.displayId)?.closest(".line");
  if(line){line.hidden=true;line.setAttribute("aria-hidden","true")}
 });
 const form=doc.querySelector("#contact form");
 if(!form){status.textContent="DwK quote form not found";return}
 form.setAttribute("onsubmit",`event.preventDefault();const t='Hi, my name is '+nm.value+'. I need a quote for '+sv.value+'. My number is '+(ph.value||'not supplied')+'. Details: '+msg.value;window.open('https://wa.me/${grantPhone}?text='+encodeURIComponent(t),'_blank')`);
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
 Object.entries(contactReveal).forEach(([id,item])=>{
  const button=doc.getElementById(id);
  button?.addEventListener("click",async event=>{
   if(button.dataset.revealed==="true")return;
   event.preventDefault();
   const destination=button.href;
   button.dataset.revealed="true";
   const line=doc.getElementById(item.displayId)?.closest(".line");
   if(line){line.hidden=false;line.removeAttribute("aria-hidden")}
   button.textContent=item.nextLabel;
   const events=JSON.parse(localStorage.getItem("dwk_goodlife_contact_events")||"[]");
   events.push({id:"EV-"+Date.now(),business:CONFIG.businessId,type:id,source:source(),createdAt:new Date().toISOString()});
   localStorage.setItem("dwk_goodlife_contact_events",JSON.stringify(events.slice(-200)));
   if(item.openImmediately)frame.contentWindow.open(destination,"_blank");
   status.textContent="Recording "+item.label.toLowerCase()+"…";
   const result=await deliver(makeContactEvent(item.label));
   if(result.sent){status.textContent=item.label+" recorded • "+result.reference;status.className="saved"}
   else{status.textContent="Tracking connection unavailable—event saved on this device";status.className=""}
  });
 });
 status.textContent="DwK lead capture ready";
 status.className="ready";
}
frame.addEventListener("load",attach,{once:true});
if(frame.contentDocument?.readyState==="complete"&&frame.contentDocument?.querySelector("#contact form"))attach();
})();
