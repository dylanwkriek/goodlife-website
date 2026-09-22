/* GoodLife trust section */
(()=>{
 "use strict";
 const frame=document.getElementById("goodlifeSite");
 if(!frame)return;
 function attach(){
  let doc;
  try{doc=frame.contentDocument||frame.contentWindow.document}catch{return}
  const servicesSection=doc.getElementById("services");
  if(!servicesSection||doc.getElementById("why-goodlife"))return;
  const why=doc.createElement("section");
  why.id="why-goodlife";
  why.className="whyGoodLife";
  why.innerHTML=`<div class="wrap whyGoodLifeInner">
   <div class="whyGoodLifeIntro"><span class="tag">Why choose us</span><h2>Why choose GoodLife?</h2><p>Local exterior work, clear contact and practical solutions built around the property.</p><a class="btn secondary" href="#contact">Discuss Your Project</a></div>
   <div class="whyGoodLifeReasons">
    <article><span>01</span><h3>Direct contact</h3><p>Speak directly with Grant about the project, site and quotation.</p></article>
    <article><span>02</span><h3>South Coast focus</h3><p>Services centred on homes and properties across the KZN South Coast.</p></article>
    <article><span>03</span><h3>Real completed work</h3><p>Browse photographs from completed GoodLife exterior projects.</p></article>
    <article><span>04</span><h3>Practical range</h3><p>Awnings, shade, retaining walls and paving through one local business.</p></article>
   </div>
  </div>`;
  const style=doc.createElement("style");
  style.id="why-goodlife-styles";
  style.textContent=`
   .whyGoodLife{padding:54px 0;border-top:1px solid #241010;border-bottom:1px solid #241010;background:linear-gradient(115deg,#080808,#120606 55%,#080808)}
   .whyGoodLifeInner{display:grid;grid-template-columns:.78fr 1.22fr;gap:42px;align-items:center}
   .whyGoodLifeIntro h2{font-size:38px;margin:14px 0 10px}.whyGoodLifeIntro p{margin:0;color:var(--muted);line-height:1.65;max-width:390px}
   .whyGoodLifeIntro .btn{margin-top:20px}
   .whyGoodLifeReasons{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#321010;border:1px solid #321010;border-radius:16px;overflow:hidden}
   .whyGoodLifeReasons article{min-height:154px;padding:23px;background:#0d0d0d}
   .whyGoodLifeReasons article>span{display:block;color:#d93535;font-size:12px;font-weight:900;letter-spacing:.13em}
   .whyGoodLifeReasons h3{margin:9px 0 7px;font-size:19px}.whyGoodLifeReasons p{margin:0;color:#aaa;font-size:14px;line-height:1.55}
   @media(max-width:850px){.whyGoodLifeInner{grid-template-columns:1fr}.whyGoodLifeIntro p{max-width:620px}}
   @media(max-width:580px){.whyGoodLife{padding:42px 0}.whyGoodLifeReasons{grid-template-columns:1fr 1fr}.whyGoodLifeReasons article{min-height:170px;padding:18px 15px}.whyGoodLifeIntro h2{font-size:32px}.whyGoodLifeReasons h3{font-size:17px}.whyGoodLifeReasons p{font-size:13px}}
  `;
  doc.head.append(style);
  servicesSection.after(why);
 }
 frame.addEventListener("load",attach,{once:true});
 try{if(frame.contentDocument?.getElementById("services"))attach()}catch{}
})();