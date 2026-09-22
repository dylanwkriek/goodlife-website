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
 const homeNav=doc.querySelector("header nav");
 if(homeNav&&!homeNav.querySelector('[data-home-link]')){
  const homeLink=doc.createElement("a");
  homeLink.href="#";homeLink.textContent="Home";homeLink.dataset.homeLink="true";
  homeNav.prepend(homeLink);
 }
 const serviceSlugs={
  "Aluminum Carports/Awnings":"aluminum-carports-awnings",
  "Colorplus Carports and Awnings":"colorplus-carports-awnings",
  "Shadenets":"shadenets",
  "Patio / Balcony Awnings":"patio-balcony-awnings",
  "Retaining Walls":"retaining-walls",
  "Driveway Paving":"driveway-paving",
  "Walkway Paving":"walkway-paving",
  "Other":"other"
 };
 [...doc.querySelectorAll(".card")].forEach(card=>{
  const title=card.querySelector("h3")?.textContent.trim(),slug=serviceSlugs[title];
  if(!slug||card.dataset.serviceLinked)return;
  card.dataset.serviceLinked="true";card.tabIndex=0;card.setAttribute("role","link");
  card.setAttribute("aria-label","View "+title);
  card.style.cssText+=";cursor:pointer;transition:transform .2s ease,box-shadow .2s ease";
  const destination=`service.html?service=${encodeURIComponent(slug)}`;
  const saveSelection=()=>{
   const image=card.querySelector("img")?.src;
   if(image)localStorage.setItem("goodlife_service_image_"+slug,image);
   if(brandLogo?.src)localStorage.setItem("goodlife_brand_logo",brandLogo.src);
  };
  const openService=()=>{saveSelection();window.top.location.href=destination};
  card.addEventListener("mouseenter",()=>{card.style.transform="translateY(-4px)";card.style.boxShadow="0 18px 38px #0008"});
  card.addEventListener("mouseleave",()=>{card.style.transform="";card.style.boxShadow=""});
  card.addEventListener("click",event=>{if(event.target.closest("a,button"))return;openService()});
  card.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();openService()}});
  const body=card.querySelector(".body");
  if(body){
   const button=doc.createElement("a");button.className="btn primary";button.href=destination;button.target="_top";
   button.textContent="View Service";button.style.marginTop="16px";button.addEventListener("click",saveSelection);body.append(button);
  }
 });
 const workSection=doc.getElementById("work");
 const workHeading=workSection?.querySelector(".head h2");
 if(workHeading)workHeading.textContent="Featured Completed Projects";
 const gallery=workSection?.querySelector(".gallery");
 if(gallery&&!gallery.dataset.carouselReady){
  gallery.dataset.carouselReady="true";
  const shots=[...gallery.querySelectorAll(".shot")];
  if(shots.length){
   const style=doc.createElement("style");style.id="goodlife-project-carousel";
   style.textContent=`
    #work .gallery{display:block;position:relative;overflow:hidden;border-radius:18px;background:#0b0b0b}
    #work .gallery .shot{display:none;border-radius:18px;min-height:500px}
    #work .gallery .shot.active{display:block;animation:goodlifeFade .45s ease}
    #work .gallery .shot img{width:100%;height:500px;object-fit:cover}
    .projectCarouselControls{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:18px}
    .projectCarouselArrow{width:48px;height:48px;border:1px solid #7a1111;border-radius:50%;background:#111;color:#fff;font-size:30px;line-height:1;cursor:pointer}
    .projectCarouselArrow:hover,.projectCarouselArrow:focus-visible{background:#f01818;outline:2px solid #ff8585;outline-offset:2px}
    .projectCarouselDots{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap}
    .projectCarouselDot{width:11px;height:11px;padding:0;border:1px solid #ff4545;border-radius:50%;background:#321010;cursor:pointer}
    .projectCarouselDot.active{background:#f01818;transform:scale(1.2)}
    @keyframes goodlifeFade{from{opacity:.35;transform:scale(.995)}to{opacity:1;transform:scale(1)}}
    @media(max-width:580px){#work .gallery .shot,#work .gallery .shot img{height:300px;min-height:300px}.projectCarouselControls{gap:10px}.projectCarouselArrow{width:44px;height:44px}}
    @media(prefers-reduced-motion:reduce){#work .gallery .shot.active{animation:none}}
   `;
   doc.head.append(style);
   const controls=doc.createElement("div");controls.className="projectCarouselControls";controls.setAttribute("aria-label","Completed project controls");
   const previous=doc.createElement("button");previous.type="button";previous.className="projectCarouselArrow";previous.setAttribute("aria-label","Previous completed project");previous.textContent="‹";
   const dots=doc.createElement("div");dots.className="projectCarouselDots";
   const next=doc.createElement("button");next.type="button";next.className="projectCarouselArrow";next.setAttribute("aria-label","Next completed project");next.textContent="›";
   controls.append(previous,dots,next);gallery.after(controls);
   let current=0,timer;
   const dotButtons=shots.map((shot,index)=>{
    const dot=doc.createElement("button");dot.type="button";dot.className="projectCarouselDot";dot.setAttribute("aria-label","Show completed project "+(index+1));
    dot.addEventListener("click",()=>show(index,true));dots.append(dot);return dot;
   });
   function show(index,manual=false){
    current=(index+shots.length)%shots.length;
    shots.forEach((shot,i)=>{const active=i===current;shot.classList.toggle("active",active);shot.setAttribute("aria-hidden",String(!active))});
    dotButtons.forEach((dot,i)=>{const active=i===current;dot.classList.toggle("active",active);dot.setAttribute("aria-current",active?"true":"false")});
    if(manual)restart();
   }
   function start(){clearInterval(timer);timer=setInterval(()=>show(current+1),5000)}
   function stop(){clearInterval(timer)}
   function restart(){stop();start()}
   previous.addEventListener("click",()=>show(current-1,true));next.addEventListener("click",()=>show(current+1,true));
   gallery.tabIndex=0;gallery.setAttribute("aria-label","Featured completed projects carousel");
   gallery.addEventListener("keydown",event=>{if(event.key==="ArrowLeft"){event.preventDefault();show(current-1,true)}if(event.key==="ArrowRight"){event.preventDefault();show(current+1,true)}});
   workSection.addEventListener("mouseenter",stop);workSection.addEventListener("mouseleave",start);
   workSection.addEventListener("focusin",stop);workSection.addEventListener("focusout",event=>{if(!workSection.contains(event.relatedTarget))start()});
   show(0);start();
  }
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
 const requestedService=new URLSearchParams(location.search).get("service");
 if(requestedService){
  const title=Object.keys(serviceSlugs).find(name=>serviceSlugs[name]===requestedService);
  const select=doc.getElementById("sv");
  if(title&&select)[...select.options].some(option=>{if(option.textContent.trim()===title){select.value=option.value;return true}return false});
  if(location.hash==="#contact")setTimeout(()=>doc.getElementById("contact")?.scrollIntoView({behavior:"smooth"}),120);
 }
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
