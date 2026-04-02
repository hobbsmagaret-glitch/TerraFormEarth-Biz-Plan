import { useState, useRef, useEffect } from "react";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

// ── System prompt ─────────────────────────────────────────────────────────────
const SYS = "You are an expert advisor with complete knowledge of TerraForm Earth's business plan. Be direct, precise, confident. No fluff.\n\nCOMPANY: TerraForm Earth. Founder & CEO: Hobbs Magaret — regenerative grazing expert, author of HERD, inventor of all core IP. Co-Founder & Executive Chairman: Matthew Warnken — founder of AgriProve, established climate entrepreneur.\n\nTHESIS: Acquire degraded semi-arid land at $200-600/ha (AUD), deploy autonomous earthworks to restore broken water cycle, generate stacked returns from carbon + data + cattle + land appreciation. Exit at $8,000-15,000/ha productive pricing. Arbitrage delta: $6,400-14,800/ha.\n\nFIVE-LAYER STACK: 1) Land & Water — degraded land cheap because market prices broken water cycle not latent potential. 2) Autonomous Earthworks — GPS bobcats (CTL + retrofit ~$180k/machine), Yeomans Plow on contour (human-operated near-term). 3) Ecological Manufacturing — passive, runs on rainfall, self-reinforcing positive loop. 4) HEIDI — intelligence platform, the moat, compounds with every property. 5) Revenue Surface — carbon Y2-3, data Y2, cattle Y3-5, land exit Y5-10.\n\nSEED RAISE: AUD $2.5M. Covers 4x CTL fleet (~$720k), JD 8R tractor + autonomy kit (~$750k), HEIDI architecture build ($400k), POC deployment inc. staffing + temp accommodation ($430k), regulatory + legal ($300k).\n\nPOC MODEL: Equipment-only deployment on partner-owned property. No land acquisition capital. Revenue share ~35%. Proves technology before acquisition model at scale.\n\nFINANCIALS (5,000ha base case, acquisition model): CapEx ~$3.5M AUD. Carbon from Y3 (ERF Soil Carbon, 0.8 tCO2e/ha/yr, ACCU $35/t). Cattle from Y5. Breakeven ~Y7. IRR ~25%. Land exit AUD $8,000/ha at Y7.\n\nKEY RISKS: Bobcat autonomy (RogueX3 concept only — CTL + retrofit near-term), Yeomans Plow requires human operator Y0-2, ACCU methodology (ERF Soil Carbon primary — IFLM not relied on), CASA BVLOS approval required for remote drone ops, IP gap between disclosure (March 12 2026) and patent filing, co-founder structure must be resolved before external capital.\n\nREHYDRATION: 10 techniques across 3 tiers. Tier 1 autonomous: swales, drone seeding, floodout earthworks. Tier 2 HEIDI-prescribed: contour bunds, deep ripping, biochar. Tier 3 manual/contractor: check dams, brush packing, zai pits, mulching.\n\nBEYOND EARTH: TerraForm Earth is a planetary engineering firm starting on the most accessible planet. Every system built transfers directly to Moon/Mars applications. Earth is the laboratory.";

// ── Diagram HTML strings ──────────────────────────────────────────────────────
const SHEEPDOG_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif;background:#fff;color:#1a1a1a;padding:24px}@keyframes drift{0%{transform:translate(0,0)}50%{transform:translate(8px,4px)}100%{transform:translate(0,0)}}.cow{animation:drift 4s ease-in-out infinite}.cow:nth-child(2n){animation-delay:.6s}.cow:nth-child(3n){animation-delay:1.2s}.btn{padding:5px 14px;border-radius:6px;border:.5px solid #d3d1c7;background:transparent;color:#5f5e5a;font-size:12px;cursor:pointer;font-family:inherit;transition:all .15s}.btn.on{background:#e6f1fb;border-color:#378add;color:#185fa5}.det{margin:10px 0 0;padding:14px 18px;border-radius:8px;background:#f5f4ef;border:.5px solid #d3d1c7;font-size:13px;color:#5f5e5a;line-height:1.7;min-height:52px}.det strong{color:#1a1a1a;font-weight:500}</style></head><body><div style="display:flex;gap:8px;margin-bottom:12px"><button class="btn on" id="b1" onclick="setState(1)">1 - Mob drifting</button><button class="btn" id="b2" onclick="setState(2)">2 - Algorithm detects</button><button class="btn" id="b3" onclick="setState(3)">3 - Drone intercepts</button><button class="btn" id="b4" onclick="setState(4)">4 - Mob redirected</button></div><svg width="100%" viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg"><defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs><rect x="30" y="30" width="620" height="250" rx="8" fill="#d4c99a" opacity=".35"/><line x1="570" y1="30" x2="570" y2="280" stroke="#E24B4A" stroke-width="2" stroke-dasharray="8 5" opacity=".7"/><text x="576" y="50" font-family="system-ui,sans-serif" font-size="11" fill="#E24B4A" font-weight="500">virtual boundary</text><g id="mob"><g class="cow" id="lead"><circle cx="440" cy="150" r="9" fill="#BA7517" opacity=".9"/><text x="440" y="154" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#fff">L</text></g><g class="cow"><circle cx="400" cy="138" r="7" fill="#8a6035" opacity=".75"/></g><g class="cow"><circle cx="390" cy="162" r="7" fill="#8a6035" opacity=".75"/></g><g class="cow"><circle cx="370" cy="145" r="7" fill="#8a6035" opacity=".75"/></g><g class="cow"><circle cx="360" cy="168" r="7" fill="#8a6035" opacity=".75"/></g><g class="cow"><circle cx="415" cy="175" r="7" fill="#8a6035" opacity=".75"/></g><g class="cow"><circle cx="345" cy="152" r="7" fill="#8a6035" opacity=".75"/></g><text x="440" y="132" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#633806">lead animal</text></g><g id="s1arrows"><path d="M 440,145 L 478,145" fill="none" stroke="#BA7517" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#arr)" opacity=".7"/><text x="295" y="210" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#854f0b">mob drifting toward boundary</text></g><g id="s2" style="display:none"><ellipse cx="420" cy="153" rx="95" ry="50" fill="none" stroke="#7F77DD" stroke-width="1.5" stroke-dasharray="6 4" opacity=".7"/><text x="295" y="100" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#534ab7">mob boundary detected -- drift pattern identified</text><circle cx="440" cy="150" r="14" fill="none" stroke="#7F77DD" stroke-width="2" opacity=".8"/><text x="295" y="225" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#534ab7">algorithm calculates: approach vector, altitude, hover distance</text></g><g id="s3" style="display:none"><rect x="488" y="60" width="24" height="9" rx="3" fill="#BA7517" opacity=".95"/><circle cx="440" cy="150" r="14" fill="none" stroke="#BA7517" stroke-width="2" opacity=".8"/><text x="295" y="225" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#854f0b">drone applies pressure to lead animal -- mob follows</text></g><g id="s4" style="display:none"><path d="M 430,155 L 330,155" fill="none" stroke="#1D9E75" stroke-width="2.5" marker-end="url(#arr)"/><text x="295" y="225" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#0f6e56">boundary not crossed. drone returns to collect pasture + carbon data.</text></g><rect x="44" y="44" width="80" height="32" rx="6" fill="#f1efe8" stroke="#d3d1c7" stroke-width="0.5"/><text x="84" y="58" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#5f5e5a" font-weight="500">base station</text><text x="84" y="70" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#888780">algorithm + charging</text></svg><div class="det" id="det">The mob-state algorithm runs continuously. It identifies drift patterns early and calculates the minimum-necessary intervention before the boundary is reached.</div><script>var D=["The mob is grazing normally but the lead animal is drifting toward the virtual boundary. The ear tag network tracks every position in real time.","The algorithm calculates projected arrival time at the boundary and identifies the lead animal as the critical leverage point. It calculates the optimal drone approach vector, altitude, and hover distance.","The drone departs the base station and arrives at the intercept point. It activates the lead animal's evolved flight-zone response. The mob follows.","The boundary is not crossed. The drone returns to base and resumes multispectral imaging of pasture biomass and thermal scanning for animal health."];function setState(n){[1,2,3,4].forEach(function(i){var el=document.getElementById("s"+i);if(el)el.style.display=(i===n&&n>1)?"":"none";document.getElementById("b"+i).className="btn"+(i===n?" on":"");});document.getElementById("s1arrows").style.display=n===1?"":"none";document.getElementById("det").innerHTML="<strong>Stage "+n+"</strong><br>"+D[n-1];}</script></body></html>`;

const HALFMOON_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif;background:#fff;color:#1a1a1a;padding:24px}@keyframes fd{to{stroke-dashoffset:-66}}.fl{stroke-dasharray:8 14;animation:fd 1.5s linear infinite}.btn{padding:6px 16px;border-radius:6px;border:.5px solid #d3d1c7;background:transparent;color:#5f5e5a;font-size:13px;cursor:pointer;font-family:inherit}.btn.on{background:#e6f1fb;border-color:#378add;color:#185fa5}.det{margin:10px 0 0;padding:14px 18px;border-radius:8px;background:#f5f4ef;border:.5px solid #d3d1c7;font-size:13px;color:#5f5e5a;line-height:1.7;min-height:52px}.det strong{color:#1a1a1a;font-weight:500}</style></head><body><div style="display:flex;gap:8px;margin-bottom:12px"><button class="btn" id="bB" onclick="setState('before')">Before earthworks</button><button class="btn on" id="bA" onclick="setState('after')">After earthworks</button></div><svg id="sv" width="100%" viewBox="0 0 680 500" xmlns="http://www.w3.org/2000/svg"></svg><div class="det" id="det">Click any pit to learn more.</div><script>var sv=document.getElementById("sv"),NS="http://www.w3.org/2000/svg";function mk(tag,a){a=a||{};var e=document.createElementNS(NS,tag);for(var k in a)e.setAttribute(k,a[k]);return e}function tx(p,x,y,s,a){a=a||{};var t=mk("text",Object.assign({x:x,y:y,"text-anchor":"middle","font-family":"system-ui,sans-serif","font-size":"12","fill":"#6b6b66"},a));t.textContent=s;p.appendChild(t);return t}sv.appendChild(mk("rect",{x:30,y:52,width:620,height:408,rx:8,fill:"#c4ab88"}));tx(sv,340,44,"upslope",{"font-size":"11","fill":"#888780"});tx(sv,340,482,"downslope",{"font-size":"11","fill":"#888780"});var gB=mk("g",{id:"gB",style:"display:none"});[65,108,152,196,240,284,328,372,416,460,504,548].forEach(function(x,i){gB.appendChild(mk("line",{x1:x,y1:55,x2:x,y2:456,stroke:"#5ea8d4","stroke-width":"2",opacity:".62",class:"fl",style:"animation-delay:"+(i*.11).toFixed(2)+"s"}))});gB.appendChild(mk("rect",{x:190,y:238,width:300,height:48,rx:6,fill:"#1a4a6b",opacity:".82"}));tx(gB,340,264,"Sheet flow -- water runs straight off",{"font-size":"13","font-weight":"500",fill:"#fff"});sv.appendChild(gB);var gA=mk("g",{id:"gA"});var rows=[{y:128,xs:[90,220,350,480,610]},{y:218,xs:[155,285,415,545]},{y:308,xs:[90,220,350,480,610]},{y:398,xs:[155,285,415,545]}];var R=26;var infos=["The berm intercepts water flowing down the hillside and holds it in the concave basin above. Water is retained long enough for deep infiltration through the loosened pit floor.","GPS-guided bobcats follow algorithmically optimised waypoints derived from a digital elevation model. Pit density, spacing, and orientation are calculated to maximise catchment area.","Water pooled in the basin infiltrates over hours to days after each rainfall event. Soil moisture extends from days to weeks -- transforming the root environment for pioneer species.","Pioneer species germinate in the disturbed, moisture-enriched soil zones around each pit. Over one to two wet seasons, vegetation establishes in a staggered network pattern."];rows.forEach(function(row,ri){row.xs.forEach(function(cx,ci){for(var d=-2;d<=2;d++){var startY=Math.max(58,row.y-R-28-Math.abs(d)*6);gA.appendChild(mk("line",{x1:cx+d*10,y1:startY,x2:cx+d*4,y2:row.y-4,stroke:"#5ea8d4","stroke-width":"1.4",opacity:".55",class:"fl",style:"animation-delay:"+((ri+ci)*.14+d*.07).toFixed(2)+"s"}));}})});var idx=0;rows.forEach(function(row){row.xs.forEach(function(cx){var g=mk("g",{style:"cursor:pointer"});var info=infos[idx%infos.length];g.appendChild(mk("path",{d:"M "+(cx-R)+","+row.y+" A "+R+","+R+" 0 0,0 "+(cx+R)+","+row.y+" Z",fill:"#4a8fbd",opacity:".78"}));g.appendChild(mk("path",{d:"M "+(cx-R)+","+row.y+" A "+R+","+R+" 0 0,0 "+(cx+R)+","+row.y,fill:"none",stroke:"#5c3d1a","stroke-width":"5","stroke-linecap":"round"}));g.addEventListener("click",function(){document.getElementById("det").innerHTML="<strong>Half-moon pit</strong><br>"+info});gA.appendChild(g);idx++;})});sv.appendChild(gA);function setState(s){document.getElementById("gB").style.display=s==="before"?"":"none";document.getElementById("gA").style.display=s==="after"?"":"none";document.getElementById("bB").className="btn"+(s==="before"?" on":"");document.getElementById("bA").className="btn"+(s==="after"?" on":"");}</script></body></html>`;

const KEYLINE_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif;background:#fff;padding:16px}</style></head><body><svg width="100%" viewBox="0 0 680 520" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="fc"><rect x="30" y="28" width="490" height="460"/></clipPath><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker><marker id="arrsm" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs><rect x="30" y="28" width="490" height="460" rx="6" fill="#c4b46c"/><g fill="none" stroke="#9a7040" stroke-width="0.9" clip-path="url(#fc)"><path d="M 30,88 C 160,8 390,8 520,88"/><path d="M 30,144 C 160,64 390,64 520,144"/><path d="M 30,200 C 160,120 390,120 520,200"/><path d="M 30,256 C 160,176 390,176 520,256"/><path d="M 30,312 C 160,232 390,232 520,312"/><path d="M 30,368 C 160,288 390,288 520,368"/><path d="M 30,424 C 160,344 390,344 520,424"/><path d="M 30,480 C 160,400 390,400 520,480"/></g><g fill="none" stroke="#1D9E75" stroke-width="1.4" clip-path="url(#fc)"><path d="M 30,68 C 160,36 390,36 520,68" opacity=".65"/><path d="M 30,76 C 160,44 390,44 520,76" opacity=".8"/><path d="M 30,84 C 160,52 390,52 520,84" opacity=".65"/></g><g fill="none" stroke="#1D9E75" stroke-width="1.4" clip-path="url(#fc)"><path d="M 30,208 C 160,176 390,176 520,208" opacity=".65"/><path d="M 30,216 C 160,184 390,184 520,216" opacity=".8"/><path d="M 30,224 C 160,192 390,192 520,224" opacity=".65"/></g><g fill="none" stroke="#09845e" stroke-width="2" clip-path="url(#fc)"><path d="M 30,428 C 160,396 390,396 520,428"/><path d="M 30,436 C 160,404 390,404 520,436"/><path d="M 30,444 C 160,412 390,412 520,444"/></g><circle cx="275" cy="356" r="10" fill="none" stroke="#E24B4A" stroke-width="2"/><circle cx="275" cy="356" r="3" fill="#E24B4A"/><line x1="80" y1="110" x2="95" y2="186" stroke="#378add" stroke-width="1.6" marker-end="url(#arrsm)" opacity=".75"/><line x1="275" y1="50" x2="275" y2="168" stroke="#378add" stroke-width="1.8" marker-end="url(#arr)" opacity=".85"/><line x1="80" y1="248" x2="95" y2="326" stroke="#378add" stroke-width="1.6" marker-end="url(#arrsm)" opacity=".7"/><line x1="275" y1="186" x2="275" y2="308" stroke="#378add" stroke-width="1.8" marker-end="url(#arr)" opacity=".8"/><line x1="262" y1="356" x2="96" y2="356" stroke="#5ea8d4" stroke-width="1.4" stroke-dasharray="5 3" marker-end="url(#arrsm)" opacity=".75"/><line x1="288" y1="356" x2="454" y2="356" stroke="#5ea8d4" stroke-width="1.4" stroke-dasharray="5 3" marker-end="url(#arrsm)" opacity=".75"/><text font-family="system-ui,sans-serif" font-size="11" font-weight="500" x="62" y="46" fill="#8a6a30">ridge</text><text font-family="system-ui,sans-serif" font-size="11" font-weight="500" x="462" y="46" fill="#8a6a30">ridge</text><text font-family="system-ui,sans-serif" font-size="11" font-weight="500" x="275" y="480" text-anchor="middle" fill="#7a5820">valley floor</text><text font-family="system-ui,sans-serif" font-size="11" x="275" y="495" text-anchor="middle" fill="#888">fall line</text><path id="mp" d="M -80,436 C 160,404 390,404 601,436" fill="none" stroke="none"/><g><animateMotion dur="13s" repeatCount="indefinite" rotate="auto"><mpath href="#mp"/></animateMotion><rect x="-22" y="-16" width="44" height="32" rx="4" fill="#BA7517"/><ellipse cx="-12" cy="-16" rx="5" ry="7.5" fill="#2a1806"/><ellipse cx="-12" cy="16" rx="5" ry="7.5" fill="#2a1806"/><line x1="6" y1="-16" x2="6" y2="-28" stroke="#aaa890" stroke-width="1.5"/><circle cx="6" cy="-31" r="3" fill="#378ADD"/></g><line x1="526" y1="148" x2="552" y2="146" stroke="#1D9E75" stroke-width="1.4"/><text font-family="system-ui,sans-serif" font-size="11" x="556" y="152" fill="#0f6e56">keyline pass</text><circle cx="534" cy="214" r="7" fill="none" stroke="#E24B4A" stroke-width="1.8"/><circle cx="534" cy="214" r="2.5" fill="#E24B4A"/><text font-family="system-ui,sans-serif" font-size="11" x="546" y="210" fill="#A32D2D">keypoint</text><text font-family="system-ui,sans-serif" font-size="11" x="526" y="448" fill="#09845e">active pass</text></svg></body></html>`;

const INFILTRATION_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box;margin:0;padding:0}body{background:#fff;padding:12px;font-family:system-ui,sans-serif}@keyframes rd{0%{transform:translateY(0);opacity:0}18%{opacity:.9}82%{opacity:.7}100%{transform:translateY(64px);opacity:0}}.rd{animation:rd 1.15s linear infinite}</style></head><body><svg id="sv" width="100%" viewBox="0 0 680 500" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="csk"><rect x="30" y="18" width="530" height="72"/></clipPath><clipPath id="csb"><rect x="30" y="232" width="530" height="218"/></clipPath></defs><rect x="30" y="18" width="530" height="72" rx="4" fill="#dceef8"/><g id="rg" opacity="0" clip-path="url(#csk)"><g class="rd" style="animation-delay:.00s"><line x1="58" y1="22" x2="55" y2="36" stroke="#5ea8d4" stroke-width="1.6" stroke-linecap="round"/></g><g class="rd" style="animation-delay:.19s"><line x1="140" y1="22" x2="137" y2="36" stroke="#5ea8d4" stroke-width="1.6" stroke-linecap="round"/></g><g class="rd" style="animation-delay:.39s"><line x1="228" y1="22" x2="225" y2="36" stroke="#5ea8d4" stroke-width="1.6" stroke-linecap="round"/></g><g class="rd" style="animation-delay:.58s"><line x1="316" y1="22" x2="313" y2="36" stroke="#5ea8d4" stroke-width="1.6" stroke-linecap="round"/></g><g class="rd" style="animation-delay:.78s"><line x1="404" y1="22" x2="401" y2="36" stroke="#5ea8d4" stroke-width="1.6" stroke-linecap="round"/></g><g class="rd" style="animation-delay:.98s"><line x1="492" y1="22" x2="489" y2="36" stroke="#5ea8d4" stroke-width="1.6" stroke-linecap="round"/></g><g class="rd" style="animation-delay:.53s"><line x1="76" y1="46" x2="73" y2="60" stroke="#5ea8d4" stroke-width="1.6" stroke-linecap="round"/></g><g class="rd" style="animation-delay:.73s"><line x1="162" y1="46" x2="159" y2="60" stroke="#5ea8d4" stroke-width="1.6" stroke-linecap="round"/></g><g class="rd" style="animation-delay:.93s"><line x1="250" y1="46" x2="247" y2="60" stroke="#5ea8d4" stroke-width="1.6" stroke-linecap="round"/></g><g class="rd" style="animation-delay:.13s"><line x1="338" y1="46" x2="335" y2="60" stroke="#5ea8d4" stroke-width="1.6" stroke-linecap="round"/></g><g class="rd" style="animation-delay:.33s"><line x1="426" y1="46" x2="423" y2="60" stroke="#5ea8d4" stroke-width="1.6" stroke-linecap="round"/></g></g><rect x="30" y="90" width="530" height="80" fill="#b5966a"/><rect x="30" y="170" width="530" height="62" fill="#8a6040"/><rect x="30" y="232" width="530" height="218" fill="#6b4a28"/><g stroke="#c4a060" stroke-width="1.1" fill="none" opacity=".8"><line x1="104" y1="232" x2="72" y2="210"/><line x1="104" y1="232" x2="136" y2="210"/><line x1="104" y1="232" x2="76" y2="255"/><line x1="104" y1="232" x2="132" y2="255"/><line x1="208" y1="232" x2="176" y2="210"/><line x1="208" y1="232" x2="240" y2="210"/><line x1="208" y1="232" x2="180" y2="255"/><line x1="208" y1="232" x2="236" y2="255"/><line x1="312" y1="232" x2="280" y2="210"/><line x1="312" y1="232" x2="344" y2="210"/><line x1="312" y1="232" x2="284" y2="255"/><line x1="312" y1="232" x2="340" y2="255"/><line x1="416" y1="232" x2="384" y2="210"/><line x1="416" y1="232" x2="448" y2="210"/><line x1="416" y1="232" x2="388" y2="255"/><line x1="416" y1="232" x2="444" y2="255"/><line x1="520" y1="232" x2="488" y2="210"/><line x1="520" y1="232" x2="552" y2="210"/><line x1="520" y1="232" x2="492" y2="255"/><line x1="520" y1="232" x2="548" y2="255"/></g><line x1="30" y1="90" x2="560" y2="90" stroke="#4a2e08" stroke-width="2"/><line x1="30" y1="170" x2="560" y2="170" stroke="#5c3d1a" stroke-width="0.8" stroke-dasharray="6 4" opacity=".45"/><line x1="30" y1="232" x2="560" y2="232" stroke="#5c3d1a" stroke-width="0.8" stroke-dasharray="6 4" opacity=".45"/><rect x="98" y="85" width="12" height="9" rx="1" fill="#6b4020"/><rect x="202" y="85" width="12" height="9" rx="1" fill="#6b4020"/><rect x="306" y="85" width="12" height="9" rx="1" fill="#6b4020"/><rect x="410" y="85" width="12" height="9" rx="1" fill="#6b4020"/><rect x="514" y="85" width="12" height="9" rx="1" fill="#6b4020"/><g id="grg"></g><rect id="wt0" x="98" y="90" width="12" height="0" fill="#5ea8d4" opacity=".55"/><rect id="wt1" x="202" y="90" width="12" height="0" fill="#5ea8d4" opacity=".55"/><rect id="wt2" x="306" y="90" width="12" height="0" fill="#5ea8d4" opacity=".55"/><rect id="wt3" x="410" y="90" width="12" height="0" fill="#5ea8d4" opacity=".55"/><rect id="wt4" x="514" y="90" width="12" height="0" fill="#5ea8d4" opacity=".55"/><rect id="wh0" x="98" y="170" width="12" height="0" fill="#2e86d4" opacity=".75"/><rect id="wh1" x="202" y="170" width="12" height="0" fill="#2e86d4" opacity=".75"/><rect id="wh2" x="306" y="170" width="12" height="0" fill="#2e86d4" opacity=".75"/><rect id="wh3" x="410" y="170" width="12" height="0" fill="#2e86d4" opacity=".75"/><rect id="wh4" x="514" y="170" width="12" height="0" fill="#2e86d4" opacity=".75"/><rect id="ws0" x="98" y="232" width="12" height="0" fill="#185fa5" opacity=".65"/><rect id="ws1" x="202" y="232" width="12" height="0" fill="#185fa5" opacity=".65"/><rect id="ws2" x="306" y="232" width="12" height="0" fill="#185fa5" opacity=".65"/><rect id="ws3" x="410" y="232" width="12" height="0" fill="#185fa5" opacity=".65"/><rect id="ws4" x="514" y="232" width="12" height="0" fill="#185fa5" opacity=".65"/><g clip-path="url(#csb)"><ellipse id="wp0" cx="104" cy="430" rx="0" ry="0" fill="#0c447c" opacity=".32"/><ellipse id="wp1" cx="208" cy="430" rx="0" ry="0" fill="#0c447c" opacity=".32"/><ellipse id="wp2" cx="312" cy="430" rx="0" ry="0" fill="#0c447c" opacity=".32"/><ellipse id="wp3" cx="416" cy="430" rx="0" ry="0" fill="#0c447c" opacity=".32"/><ellipse id="wp4" cx="520" cy="430" rx="0" ry="0" fill="#0c447c" opacity=".32"/></g><text font-family="system-ui,sans-serif" font-size="11" font-weight="500" x="26" y="128" text-anchor="end" fill="#8a6035">A</text><text font-family="system-ui,sans-serif" font-size="10" x="26" y="140" text-anchor="end" fill="#8a6035">topsoil</text><text font-family="system-ui,sans-serif" font-size="11" font-weight="500" x="26" y="200" text-anchor="end" fill="#7a5030">B</text><text font-family="system-ui,sans-serif" font-size="10" x="26" y="212" text-anchor="end" fill="#7a5030">hardpan</text><text font-family="system-ui,sans-serif" font-size="11" font-weight="500" x="26" y="330" text-anchor="end" fill="#5c3d1a">C</text><text font-family="system-ui,sans-serif" font-size="10" x="26" y="342" text-anchor="end" fill="#5c3d1a">subsoil</text><text font-family="system-ui,sans-serif" font-size="11" x="295" y="478" text-anchor="middle" fill="#888">cross-section -- water infiltration through Yeomans-ripped soil profile</text></svg><script>var CYCLE=14000,t0=null;function lerp(a,b,t){return a+(b-a)*Math.min(1,Math.max(0,t))}function ease(t){t=Math.min(1,Math.max(0,t));return t<.5?2*t*t:-1+(4-2*t)*t}function ph(t,s,d){return ease((t-s)/d)}var rg=document.getElementById("rg");var wt=[0,1,2,3,4].map(function(i){return document.getElementById("wt"+i)});var wh=[0,1,2,3,4].map(function(i){return document.getElementById("wh"+i)});var ws=[0,1,2,3,4].map(function(i){return document.getElementById("ws"+i)});var wp=[0,1,2,3,4].map(function(i){return document.getElementById("wp"+i)});var CLUMPS=[[104,46],[208,46],[312,46],[416,46],[520,46]];var grg=document.getElementById("grg");var glLines=[];CLUMPS.forEach(function(cx){var ln=document.createElementNS("http://www.w3.org/2000/svg","line");ln.setAttribute("x1",cx[0]);ln.setAttribute("y1",84);ln.setAttribute("x2",cx[0]);ln.setAttribute("y2",90);ln.setAttribute("stroke","#5a8a20");ln.setAttribute("stroke-width","2");ln.setAttribute("stroke-linecap","round");ln.dataset.target=cx[1];grg.appendChild(ln);glLines.push(ln);});function frame(ts){if(!t0)t0=ts;var t=(ts-t0)%CYCLE;var isR=t>11500;var rp=isR?ph(t,11500,2500):0;rg.setAttribute("opacity",isR?(1-rp).toFixed(2):ph(t,0,700).toFixed(2));var pT=isR?lerp(ph(t>2500?2500:t,900,1600),0,rp):ph(t,900,1600);wt.forEach(function(el){el.setAttribute("height",Math.round(pT*80))});var pH=isR?lerp(ph(t>3500?3500:t,2500,1000),0,rp):ph(t,2500,1000);wh.forEach(function(el){el.setAttribute("height",Math.round(pH*62))});var pS=isR?lerp(ph(t>4800?4800:t,3500,1300),0,rp):ph(t,3500,1300);ws.forEach(function(el){el.setAttribute("height",Math.round(pS*150))});var pP=isR?lerp(ph(t>7000?7000:t,4200,2800),0,rp):ph(t,4200,2800);wp.forEach(function(el){el.setAttribute("rx",(pP*52).toFixed(1));el.setAttribute("ry",(pP*28).toFixed(1))});var pG=isR?lerp(ph(t>10500?10500:t,7500,3000),0,rp):ph(t,7500,3000);glLines.forEach(function(ln){var tgt=parseInt(ln.dataset.target);ln.setAttribute("y1",Math.round(lerp(84,tgt,pG)))});requestAnimationFrame(frame)}requestAnimationFrame(frame)</script></body></html>`;

const DIAGRAMS = [
  { id:"sheepdog",    title:"Sheepdog algorithm -- VF2.0 mob management",              desc:"Step through the four stages of the mob-state algorithm: drift detection, interception calculation, drone deployment, and mob redirection.",              color:"#9a5a00", html:SHEEPDOG_HTML,    height:440 },
  { id:"halfmoon",   title:"Half-moon pit pattern -- water harvesting earthworks",     desc:"Toggle before/after earthworks. Click any pit to understand the mechanics -- geometry, berm function, and infiltration role.",                              color:"#1155a0", html:HALFMOON_HTML,    height:560 },
  { id:"keyline",    title:"Keyline principles -- contour plowing and water redistribution", desc:"Live animated tractor runs the active keyline pass. Shows how off-contour plowing redistributes water from valley to ridge.",                         color:"#0a6b47", html:KEYLINE_HTML,     height:560 },
  { id:"infiltration", title:"Keyline subsoil infiltration -- animated cross-section",  desc:"Watch a full rainfall cycle: rain enters furrow slots, infiltrates through the A horizon, passes fractured hardpan, charges the subsoil, pools at depth, drives grass roots downward.", color:"#185fa5", html:INFILTRATION_HTML, height:520 },
];

// ── Financial model ───────────────────────────────────────────────────────────
const SCEN = {
  best:  { label:"Best case",  color:"#0a6b47", land:300, ew:96,  carb:1.2, cs:2, accu:40, ae:0.4, cp:900, cattleS:4, dr:8, exit:12000, exitYr:6, desc:"Full autonomous output Y1. Vegetation 2yr. First ACCU issuance Y2. Land exit AUD $12,000/ha at Y6." },
  base:  { label:"Base case",  color:"#9a5a00", land:400, ew:140, carb:0.8, cs:3, accu:35, ae:0.3, cp:800, cattleS:5, dr:6, exit:8000,  exitYr:7, desc:"Y1-2 Yeomans human-operated. Vegetation 3-4yr. First ACCU issuance Y3. Land exit AUD $8,000/ha at Y7." },
  floor: { label:"Floor case", color:"#c0392b", land:500, ew:180, carb:0,   cs:99,accu:30, ae:0.2, cp:750, cattleS:6, dr:4, exit:5000,  exitYr:8, desc:"Yeomans human-operated Y0-2+. Vegetation delayed to Y5. Carbon excluded entirely. Land exit AUD $5,000/ha at Y8." },
};

function calcIRR(cfs) {
  var lo = -0.99, hi = 10, r = 0;
  for (var i = 0; i < 120; i++) {
    r = (lo + hi) / 2;
    var n = cfs.reduce(function(s, c, t) { return s + c / Math.pow(1 + r, t); }, 0);
    if (Math.abs(n) < 0.0001) break;
    if (n > 0) { lo = r; } else { hi = r; }
  }
  return r;
}

function buildFinData(sk, model) {
  var p = SCEN[sk];
  var ha = 5000;
  var share = model === "equipment" ? 0.35 : 1;
  var lc = model === "acquisition" ? p.land * ha / 1e6 : 0;
  var capex = lc + (p.ew * ha / 1e6) + 4 * 0.18 + 0.75 + 0.4;
  var cfs = [];
  var rows = [];
  var cum = 0;
  for (var yr = 0; yr <= 10; yr++) {
    var carbon = yr < p.cs ? 0 : p.carb * ha * p.accu / 1e6 * share;
    var cattle = yr < p.cattleS ? 0 : p.ae * ha * p.cp / 1e6 * share;
    var data = yr < 2 ? 0 : p.dr * ha / 1e6 * share;
    var manOpex = (yr > 0 && yr <= 2) ? (sk === "floor" ? 0.15 : sk === "base" ? 0.12 : 0) : 0;
    var opex = yr === 0 ? 0 : 0.1 + manOpex;
    var exitVal = (model === "acquisition" && yr === p.exitYr) ? p.exit * ha / 1e6 : 0;
    var ann = yr === 0 ? -capex : (carbon + cattle + data - opex + exitVal);
    cum += ann;
    cfs.push(ann);
    var lv = model === "acquisition" ? lc + (p.exit * ha / 1e6 - lc) * Math.min(yr / p.exitYr, 1) : 0;
    rows.push({ y:"Y"+yr, cf:parseFloat(cum.toFixed(1)), lv:parseFloat(lv.toFixed(1)), carbon:parseFloat(carbon.toFixed(2)), cattle:parseFloat(cattle.toFixed(2)), data:parseFloat(data.toFixed(2)) });
  }
  var be = rows.findIndex(function(r) { return r.cf >= 0; });
  var irr = calcIRR(cfs);
  var npv = cfs.reduce(function(s, c, t) { return s + c / Math.pow(1.1, t); }, 0);
  return { rows:rows, capex:parseFloat(capex.toFixed(2)), breakeven:be, irr:isFinite(irr)?parseFloat((irr*100).toFixed(0)):null, npv:parseFloat(npv.toFixed(1)) };
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page:  { minHeight:"100vh", background:"#f9f8f5", color:"#1a1a18", fontFamily:"Georgia,'Times New Roman',serif", fontSize:16, lineHeight:1.7 },
  nav:   { background:"#fff", borderBottom:"1px solid #e8e6e0", position:"sticky", top:0, zIndex:100, padding:"0 24px", display:"flex", alignItems:"center", gap:0 },
  brand: { fontSize:12, fontWeight:"bold", fontFamily:"system-ui,sans-serif", color:"#1a1a18", paddingRight:16, marginRight:4, borderRight:"1px solid #e8e6e0", letterSpacing:"0.06em", textTransform:"uppercase", whiteSpace:"nowrap" },
  navScroll: { display:"flex", gap:0, overflowX:"auto", flex:1 },
  navBtn: function(on) { return { padding:"15px 14px", background:"transparent", border:"none", borderBottom:on?"2px solid #1a1a18":"2px solid transparent", color:on?"#1a1a18":"#888780", fontSize:12, fontFamily:"system-ui,sans-serif", cursor:"pointer", whiteSpace:"nowrap", fontWeight:on?500:400, transition:"all .15s", marginBottom:-1 }; },
  wrap:  { maxWidth:760, margin:"0 auto", padding:"56px 24px" },
  eyebrow: { fontSize:11, fontFamily:"system-ui,sans-serif", color:"#888780", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 },
  h1:    { fontSize:32, fontWeight:"normal", color:"#1a1a18", marginBottom:20, lineHeight:1.3 },
  h2:    { fontSize:20, fontWeight:"normal", color:"#1a1a18", marginBottom:14, lineHeight:1.3 },
  h3:    { fontSize:14, fontWeight:"bold", fontFamily:"system-ui,sans-serif", color:"#1a1a18", marginBottom:6 },
  body:  { color:"#3d3d3a", lineHeight:1.8, marginBottom:18 },
  rule:  { border:"none", borderTop:"1px solid #e8e6e0", margin:"40px 0" },
  card:  { background:"#fff", border:"1px solid #e8e6e0", borderRadius:8, padding:28, marginBottom:20 },
  cardSm:{ background:"#fff", border:"1px solid #e8e6e0", borderRadius:8, padding:20 },
  pill:  function(c) { return { display:"inline-block", padding:"3px 12px", borderRadius:20, border:"1px solid "+c, color:c, fontSize:11, fontFamily:"system-ui,sans-serif", marginRight:6, marginTop:4 }; },
  metaGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))", gap:1, background:"#e8e6e0", border:"1px solid #e8e6e0", borderRadius:8, overflow:"hidden", marginBottom:32 },
  metaCell: { background:"#fff", padding:"16px 20px" },
  metaVal:  { fontSize:19, fontWeight:"bold", fontFamily:"system-ui,sans-serif", color:"#1a1a18", marginBottom:2 },
  metaLabel:{ fontSize:11, fontFamily:"system-ui,sans-serif", color:"#888780", letterSpacing:"0.05em" },
  metaNote: { fontSize:12, fontFamily:"system-ui,sans-serif", color:"#0a6b47", marginTop:2 },
  quote: { borderLeft:"3px solid #1a1a18", paddingLeft:20, margin:"28px 0", fontStyle:"italic", color:"#3d3d3a", fontSize:17, lineHeight:1.7 },
  acc:   { border:"1px solid #e8e6e0", borderRadius:8, overflow:"hidden", marginBottom:8 },
  accH:  function(on) { return { display:"flex", alignItems:"center", gap:14, padding:"16px 20px", cursor:"pointer", background:on?"#f9f8f5":"#fff", transition:"background .1s" }; },
  tag:   function(c, bg) { return { display:"inline-block", padding:"2px 10px", borderRadius:4, background:bg, color:c, fontSize:11, fontFamily:"system-ui,sans-serif", fontWeight:500, marginRight:6 }; },
  bubble:function(u) { return { maxWidth:"78%", padding:"12px 16px", borderRadius:10, background:u?"#1a1a18":"#fff", border:u?"none":"1px solid #e8e6e0", color:u?"#f0ede5":"#1a1a18", fontSize:14, fontFamily:"system-ui,sans-serif", lineHeight:1.65, whiteSpace:"pre-wrap" }; },
  input: { flex:1, padding:"10px 14px", borderRadius:6, border:"1px solid #e8e6e0", background:"#fff", color:"#1a1a18", fontSize:14, fontFamily:"system-ui,sans-serif", outline:"none" },
  sendBtn: { padding:"10px 22px", borderRadius:6, background:"#1a1a18", border:"none", color:"#fff", fontSize:14, fontFamily:"system-ui,sans-serif", cursor:"pointer", fontWeight:500 },
};

// ── Components ────────────────────────────────────────────────────────────────

function Gate({ onUnlock }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [checked, setChecked] = useState(false);
  const [err, setErr] = useState("");
  const valid = name.trim().length > 1 && email.includes("@") && pw.length > 0 && checked;

  function submit() {
    if (!name.trim()) return setErr("Please enter your full name.");
    if (!email.includes("@")) return setErr("Please enter a valid email address.");
    if (pw !== "TerraForm") return setErr("Incorrect access password. Please contact TerraForm Earth for access.");
    if (!checked) return setErr("Please confirm you have read and accepted the terms.");
    var ts = new Date().toLocaleString("en-AU", { day:"2-digit", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit", second:"2-digit", timeZoneName:"short" });
    setErr("");
    onUnlock(name.trim(), email.trim(), ts);
  }

  return (
    <div style={{ minHeight:"100vh", background:"#f9f8f5", display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"system-ui,sans-serif" }}>
      <div style={{ maxWidth:480, width:"100%" }}>
        <div style={{ marginBottom:32, textAlign:"center" }}>
          <div style={{ fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:"#888780", marginBottom:12 }}>Confidential</div>
          <div style={{ fontSize:26, fontFamily:"Georgia,serif", color:"#1a1a18", marginBottom:10, lineHeight:1.3 }}>TerraForm Earth<br/>Investor Business Plan</div>
          <div style={{ fontSize:14, color:"#5f5e5a", lineHeight:1.7 }}>This document contains proprietary and confidential information. Access is restricted to authorised recipients only.</div>
        </div>
        <div style={{ background:"#fff", border:"1px solid #e8e6e0", borderRadius:10, padding:32 }}>
          {[
            { label:"FULL NAME", val:name, set:setName, type:"text", ph:"Your full name" },
            { label:"EMAIL ADDRESS", val:email, set:setEmail, type:"email", ph:"your@email.com" },
            { label:"ACCESS PASSWORD", val:pw, set:setPw, type:"password", ph:"Enter password" },
          ].map(function(f) {
            return (
              <div key={f.label} style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:12, fontWeight:500, color:"#3d3d3a", marginBottom:6, letterSpacing:"0.04em" }}>{f.label}</label>
                <input value={f.val} onChange={function(e) { f.set(e.target.value); }} onKeyDown={function(e) { if (e.key==="Enter") submit(); }} placeholder={f.ph} type={f.type} style={{ width:"100%", padding:"10px 14px", borderRadius:6, border:"1px solid #e8e6e0", fontSize:14, color:"#1a1a18", fontFamily:"system-ui,sans-serif", outline:"none", background:"#fafaf8", boxSizing:"border-box" }}/>
              </div>
            );
          })}
          <div style={{ background:"#f9f8f5", border:"1px solid #e8e6e0", borderRadius:8, padding:16, marginBottom:20, fontSize:13, color:"#5f5e5a", lineHeight:1.7 }}>By accessing this document, you acknowledge that the information contained herein is the proprietary and confidential property of TerraForm Earth. You agree not to copy, distribute, reproduce, or disclose any part of this document to any third party without prior written consent.</div>
          <label style={{ display:"flex", gap:12, alignItems:"flex-start", cursor:"pointer", marginBottom:24 }}>
            <div onClick={function() { setChecked(!checked); }} style={{ width:18, height:18, minWidth:18, borderRadius:4, border:"1.5px solid "+(checked?"#1a1a18":"#c8c5bc"), background:checked?"#1a1a18":"#fff", display:"flex", alignItems:"center", justifyContent:"center", marginTop:2, cursor:"pointer" }}>
              {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.8 7L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <span style={{ fontSize:13, color:"#3d3d3a", lineHeight:1.6, userSelect:"none" }} onClick={function() { setChecked(!checked); }}>I have read and understood the above and agree to treat this document as confidential.</span>
          </label>
          {err && <div style={{ fontSize:13, color:"#c0392b", marginBottom:16, padding:"8px 12px", background:"#fdf0ee", borderRadius:6, border:"1px solid #f5c6c2" }}>{err}</div>}
          <button onClick={submit} style={{ width:"100%", padding:"12px", borderRadius:6, background:valid?"#1a1a18":"#e8e6e0", border:"none", color:valid?"#fff":"#aaa", fontSize:14, fontWeight:500, fontFamily:"system-ui,sans-serif", cursor:valid?"pointer":"default" }}>Access the business plan</button>
          <div style={{ textAlign:"center", marginTop:14, fontSize:12, color:"#b4b2a9" }}>Access time will be recorded</div>
        </div>
        <div style={{ textAlign:"center", marginTop:20, fontSize:12, color:"#b4b2a9" }}>March 2026 -- For authorised recipients only</div>
      </div>
    </div>
  );
}

function DiagramModal({ diagram, onClose }) {
  if (!diagram) return null;
  return (
    <div style={{ position:"absolute", top:0, left:0, right:0, minHeight:"100%", background:"rgba(0,0,0,0.55)", zIndex:500, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"40px 16px", boxSizing:"border-box" }}>
      <div style={{ width:"100%", maxWidth:860, background:"#fff", borderRadius:10, overflow:"hidden", boxShadow:"0 24px 60px rgba(0,0,0,0.18)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", borderBottom:"1px solid #e8e6e0" }}>
          <div style={{ fontFamily:"system-ui,sans-serif", fontSize:14, fontWeight:500, color:"#1a1a18" }}>{diagram.title}</div>
          <button onClick={onClose} style={{ background:"none", border:"1px solid #e8e6e0", borderRadius:6, padding:"5px 14px", cursor:"pointer", fontFamily:"system-ui,sans-serif", fontSize:12, color:"#3d3d3a" }}>Close</button>
        </div>
        <iframe srcDoc={diagram.html} style={{ width:"100%", height:diagram.height, border:"none", display:"block" }} title={diagram.title}/>
      </div>
    </div>
  );
}

function StackView() {
  const [active, setActive] = useState(null);
  const layers = [
    { n:1, label:"Land & Water", sub:"The foundation", color:"#c4420a", lightBg:"#fff5f0", desc:"Degraded semi-arid land at $200-600/ha. The market prices a broken water cycle, not the land's latent potential. The spread between degraded and productive pricing is structural -- it exists because no one has previously been able to close it at economic cost.", stats:["$200-600/ha acquisition (AUD)","250-450mm/yr rainfall required","$200-600 vs $8,000-15,000/ha spread"] },
    { n:2, label:"Autonomous Earthworks", sub:"The picks and shovels", color:"#9a5a00", lightBg:"#fffbf0", desc:"GPS-guided CTLs excavate crescent half-moon pits at DEM-optimised density. Yeomans Plow on true topographic contour. ~$140-180/ha all-in. One-time capital deployment that functions passively for decades.", stats:["AUD $140-180/ha (derived, not assumed)","One-time capital event","Yeomans Plow human-operated Y0-2"] },
    { n:3, label:"Ecological Manufacturing", sub:"The compounding mechanism", color:"#0a6b47", lightBg:"#f0faf5", desc:"Passive biological regeneration triggered by restored water retention. Pioneer species germinate. Root networks fracture hardpan. Self-reinforcing positive feedback loop. Runs entirely on rainfall. The only layer that improves without human intervention and without cost.", stats:["Soil moisture: days to weeks","Carrying capacity years 3-5","Zero ongoing capital required"] },
    { n:4, label:"HEIDI -- Intelligence", sub:"The moat", color:"#3b33a0", lightBg:"#f5f4ff", desc:"The accumulated institutional knowledge of every property TerraForm has ever operated. Cannot be bought, reverse-engineered, or accelerated. A competitor entering in Year 5 starts from zero longitudinal data -- a gap that cannot be closed by capital alone.", stats:["Compounds with every property added","Natural language interface: phone, desktop, voice","Data schema must be designed before deployment"] },
    { n:5, label:"Revenue Surface", sub:"The output, not the strategy", color:"#1155a0", lightBg:"#f0f6ff", desc:"Carbon credits (Y2-3), Data licensing (Y2), Cattle income (Y3-5), Land appreciation (Y5-10). Defensible only because it sits on top of layers 1-4. A competitor can run cattle. A competitor can do carbon. They cannot replicate the full stack simultaneously.", stats:["Carbon from Year 2-3 (ERF Soil Carbon)","Land exit AUD $8,000-15,000/ha","4 stacked revenue streams"] },
  ];
  return (
    <div>
      {layers.slice().reverse().map(function(l) {
        var open = active === l.n;
        return (
          <div key={l.n} style={s.acc}>
            <div style={s.accH(open)} onClick={function() { setActive(open ? null : l.n); }}>
              <div style={{ width:30, height:30, borderRadius:6, background:l.color, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:"bold", fontFamily:"system-ui,sans-serif", flexShrink:0 }}>{l.n}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:500, fontFamily:"system-ui,sans-serif", fontSize:14, color:"#1a1a18" }}>{l.label}</div>
                <div style={{ fontSize:12, fontFamily:"system-ui,sans-serif", color:"#888780" }}>{l.sub}</div>
              </div>
              <div style={{ color:"#aaa", fontSize:12, fontFamily:"system-ui,sans-serif" }}>{open ? "Hide" : "Show"}</div>
            </div>
            {open && (
              <div style={{ padding:"20px 20px 20px 64px", background:l.lightBg, borderTop:"1px solid #e8e6e0" }}>
                <p style={{ fontSize:15, color:"#3d3d3a", lineHeight:1.8, marginBottom:14 }}>{l.desc}</p>
                <div>{l.stats.map(function(st) { return <span key={st} style={s.pill(l.color)}>{st}</span>; })}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RegenLoop() {
  const [active, setActive] = useState(null);
  var nodes = [
    { id:0, cx:340, cy:46,  label:"Earthworks deployed", sub:"One-time trigger", c:"#9a5a00", bg:"#fffbf0", tc:"#5a3300" },
    { id:1, cx:555, cy:168, label:"Water retained",      sub:"Days to weeks",    c:"#0a6b47", bg:"#f0faf5", tc:"#064d34" },
    { id:2, cx:555, cy:340, label:"Vegetation grows",    sub:"Cover + biomass",  c:"#0a6b47", bg:"#f0faf5", tc:"#064d34" },
    { id:3, cx:340, cy:452, label:"Carrying capacity",   sub:"DSE / ha rises",   c:"#0a6b47", bg:"#f0faf5", tc:"#064d34" },
    { id:4, cx:125, cy:340, label:"Soil structure",      sub:"Roots + biology",  c:"#0a6b47", bg:"#f0faf5", tc:"#064d34" },
    { id:5, cx:125, cy:168, label:"Infiltration rate",   sub:"Soil absorbs more",c:"#0a6b47", bg:"#f0faf5", tc:"#064d34" },
  ];
  var descs = [
    "Half-moon pits and contour furrows are the trigger that starts the loop -- but they are not part of it. Once deployed, they function passively. Capital is deployed once, and the ecological process compounds independently afterward.",
    "Rain that previously ran off bare compacted earth is now intercepted and held. Soil moisture extends from hours to weeks. This transforms the root environment for pioneer species.",
    "Increased soil moisture allows pioneer species to germinate. Ground cover reduces surface temperature extremes. Organic matter begins accumulating. The root zone expands laterally and downward.",
    "Perennial grass species establish and biomass accumulates. Cattle are introduced. Carbon credits, cattle income, and data platform revenue all become measurable and growing.",
    "Root systems fracture the soil mechanically. Soil biology begins recovering. The soil changes from compacted and sealed to porous and biologically active -- permanently.",
    "Recovered soil structure means each subsequent rainfall event infiltrates faster and deeper. This feeds directly back into water retention, amplifying the loop. The system gets easier over time, not harder.",
  ];
  var arcs = ["M 420,66 Q 480,85 477,152","M 555,194 L 555,316","M 478,360 Q 445,418 418,444","M 264,452 Q 226,460 200,380","M 125,316 L 125,194"];
  return (
    <div>
      <svg width="100%" viewBox="0 0 680 510" style={{ display:"block", marginBottom:12 }}>
        <defs><marker id="arrG" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="#0a6b47" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></marker></defs>
        <circle cx="340" cy="264" r="56" fill="#f0faf5" stroke="#0a6b47" strokeWidth="1"/>
        <text x="340" y="258" textAnchor="middle" fontFamily="Georgia,serif" fontSize="13" fill="#064d34">positive</text>
        <text x="340" y="275" textAnchor="middle" fontFamily="Georgia,serif" fontSize="13" fill="#064d34">feedback loop</text>
        <text x="340" y="294" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="11" fill="#0a6b47">self-reinforcing</text>
        {arcs.map(function(d, i) { return <path key={i} d={d} fill="none" stroke="#0a6b47" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#arrG)" opacity="0.5"/>; })}
        {nodes.map(function(nd) {
          return (
            <g key={nd.id} onClick={function() { setActive(active === nd.id ? null : nd.id); }} style={{ cursor:"pointer" }}>
              <rect x={nd.cx-82} y={nd.cy-26} width={164} height={52} rx="8" fill={nd.bg} stroke={nd.c} strokeWidth={active===nd.id?"1.5":"0.8"}/>
              <text x={nd.cx} y={nd.cy-7} textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="12" fontWeight="500" fill={nd.tc}>{nd.label}</text>
              <text x={nd.cx} y={nd.cy+10} textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="11" fill={nd.c}>{nd.sub}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ padding:16, background:active!==null?"#f0faf5":"#f9f8f5", border:"1px solid "+(active!==null?"#b3d9c8":"#e8e6e0"), borderRadius:8, fontSize:14, fontFamily:"system-ui,sans-serif", color:"#3d3d3a", lineHeight:1.7 }}>
        {active !== null ? descs[active] : "Click any node to explore the regeneration loop."}
      </div>
    </div>
  );
}

function Flywheel() {
  const [active, setActive] = useState(null);
  var nodes = [
    { id:0, cx:340, cy:58,  w:168, label:"More properties",    sub:"Portfolio grows",         c:"#9a5a00", bg:"#fffbf0", tc:"#5a3300" },
    { id:1, cx:574, cy:130, w:152, label:"More data streams",  sub:"Richer longitudinal set", c:"#3b33a0", bg:"#f5f4ff", tc:"#2a2480" },
    { id:2, cx:574, cy:318, w:152, label:"Better algorithm",   sub:"Mob + pasture models",    c:"#3b33a0", bg:"#f5f4ff", tc:"#2a2480" },
    { id:3, cx:106, cy:318, w:152, label:"Higher data value",  sub:"Licensing grows",         c:"#0a6b47", bg:"#f0faf5", tc:"#064d34" },
    { id:4, cx:106, cy:130, w:152, label:"Capital for next",   sub:"acquisition",             c:"#0a6b47", bg:"#f0faf5", tc:"#064d34" },
  ];
  var descs = [
    "Each new property adds a new data stream. Longitudinal data from multiple properties across different rainfall zones and soil types creates benchmarks that no single-property operator can build.",
    "Each property generates continuous individual animal telemetry, pasture biomass imaging, soil carbon measurements, and rainfall-response data. Proprietary -- cannot be bought, only built.",
    "The mob-state algorithm learns behavioural patterns of individual animals and ecological responses of individual properties. Prediction accuracy improves with each season of operational data.",
    "As the dataset grows, its value to three buyer categories increases: livestock processors, agricultural financiers, and carbon market verifiers. Licensing revenue per property increases as the platform matures.",
    "Data licensing revenue, alongside carbon credits and cattle income, funds the next property acquisition. The business compounds on three dimensions: land portfolio value, operating revenue, and data platform value.",
  ];
  return (
    <div>
      <svg width="100%" viewBox="0 0 680 408" style={{ display:"block", marginBottom:12 }}>
        <defs><marker id="arrP" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="#3b33a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></marker></defs>
        <circle cx="340" cy="224" r="62" fill="#f5f4ff" stroke="#3b33a0" strokeWidth="1"/>
        <text x="340" y="218" textAnchor="middle" fontFamily="Georgia,serif" fontSize="13" fill="#2a2480">proprietary</text>
        <text x="340" y="235" textAnchor="middle" fontFamily="Georgia,serif" fontSize="13" fill="#2a2480">data platform</text>
        <text x="340" y="252" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="11" fill="#3b33a0">compounds over time</text>
        {[[340,84,340,160],[498,148,404,196],[498,306,404,258],[182,306,276,258],[182,148,276,196]].map(function(ln, i) {
          return <line key={i} x1={ln[0]} y1={ln[1]} x2={ln[2]} y2={ln[3]} stroke="#3b33a0" strokeWidth="1.5" markerEnd="url(#arrP)" opacity="0.5"/>;
        })}
        {nodes.map(function(nd) {
          return (
            <g key={nd.id} onClick={function() { setActive(active===nd.id?null:nd.id); }} style={{ cursor:"pointer" }}>
              <rect x={nd.cx-nd.w/2} y={nd.cy-26} width={nd.w} height={52} rx="8" fill={nd.bg} stroke={nd.c} strokeWidth={active===nd.id?"1.5":"0.8"}/>
              <text x={nd.cx} y={nd.cy-7} textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="12" fontWeight="500" fill={nd.tc}>{nd.label}</text>
              <text x={nd.cx} y={nd.cy+10} textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="11" fill={nd.c}>{nd.sub}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ padding:16, background:active!==null?"#f5f4ff":"#f9f8f5", border:"1px solid "+(active!==null?"#c5c2f0":"#e8e6e0"), borderRadius:8, fontSize:14, fontFamily:"system-ui,sans-serif", color:"#3d3d3a", lineHeight:1.7 }}>
        {active !== null ? descs[active] : "Click each node to explore how the flywheel tightens over time."}
      </div>
    </div>
  );
}

function SliderRow({ label, value, min, max, step, onChange, format }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ fontSize:12, fontFamily:"system-ui,sans-serif", color:"#3d3d3a", fontWeight:500 }}>{label}</span>
        <span style={{ fontSize:13, fontFamily:"system-ui,sans-serif", color:"#1a1a18", fontWeight:"bold" }}>{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={function(e) { onChange(Number(e.target.value)); }}
        style={{ width:"100%", accentColor:"#1a1a18", cursor:"pointer" }}/>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:2 }}>
        <span style={{ fontSize:10, fontFamily:"system-ui,sans-serif", color:"#b4b2a9" }}>{format(min)}</span>
        <span style={{ fontSize:10, fontFamily:"system-ui,sans-serif", color:"#b4b2a9" }}>{format(max)}</span>
      </div>
    </div>
  );
}

const PRESETS = {
  best:  { label:"Best case",  color:"#0a6b47", acqPrice:200, ewCost:120, exitPrice:12000, carbonPriceT1:40, carbonGrowth:0.06, carbStart:2, cattleOnset:4, dataOnset:2, ha:5000 },
  base:  { label:"Base case",  color:"#9a5a00", acqPrice:400, ewCost:160, exitPrice:8000,  carbonPriceT1:35, carbonGrowth:0.05, carbStart:3, cattleOnset:5, dataOnset:2, ha:5000 },
  floor: { label:"Floor case", color:"#c0392b", acqPrice:500, ewCost:180, exitPrice:5000,  carbonPriceT1:30, carbonGrowth:0.03, carbStart:99,cattleOnset:6, dataOnset:3, ha:5000 },
};

function buildFinModel(a, model) {
  var ha = a.ha;
  var share = model === "equipment" ? 0.35 : 1;
  var landCost = model === "acquisition" ? a.acqPrice * a.ha / 1e6 : 0;
  var ewTotal  = a.ewCost * a.ha / 1e6;
  var fleetCap = 1.22;
  var heidi    = 0.4;
  var capex    = landCost + ewTotal + fleetCap + heidi;
  var cfs = [], rows = [], cum = 0;
  for (var yr = 0; yr <= 10; yr++) {
    var carbRate = a.carbStart === 99 ? 0 : 0.8;
    var carbon   = yr < a.carbStart ? 0 : carbRate * a.ha * a.carbonPriceT1 * Math.pow(1 + a.carbonGrowth, yr) / 1e6 * share;
    var cattle   = yr < a.cattleOnset ? 0 : 0.3 * a.ha * 800 / 1e6 * share;
    var data     = yr < a.dataOnset ? 0 : 0.006 * a.ha / 1e6 * share * Math.min(yr - a.dataOnset + 1, 5);
    var manOpex  = (yr > 0 && yr <= 2) ? 0.12 : 0;
    var opex     = yr === 0 ? 0 : 0.1 + manOpex;
    var exitVal  = (model === "acquisition" && yr === 7) ? a.exitPrice * a.ha / 1e6 : 0;
    var ann = yr === 0 ? -capex : (carbon + cattle + data - opex + exitVal);
    cum += ann;
    cfs.push(ann);
    var lv = model === "acquisition" ? landCost + (a.exitPrice * a.ha / 1e6 - landCost) * Math.min(yr / 7, 1) : 0;
    rows.push({ y:"Y"+yr, cf:parseFloat(cum.toFixed(1)), lv:parseFloat(lv.toFixed(1)), carbon:parseFloat(carbon.toFixed(2)), cattle:parseFloat(cattle.toFixed(2)), data:parseFloat(data.toFixed(2)) });
  }
  var be  = rows.findIndex(function(r) { return r.cf >= 0; });
  var irr = calcIRR(cfs);
  var npv = cfs.reduce(function(s, c, t) { return s + c / Math.pow(1.1, t); }, 0);
  return { rows:rows, capex:parseFloat(capex.toFixed(2)), breakeven:be, irr:isFinite(irr)?parseFloat((irr*100).toFixed(0)):null, npv:parseFloat(npv.toFixed(1)) };
}

function FinChart() {
  const [model,   setModel]   = useState("acquisition");
  const [preset,  setPreset]  = useState("base");
  const [showCx,  setShowCx]  = useState(false);
  const [custom,  setCustom]  = useState(false);
  const [acqPrice,    setAcqPrice]    = useState(400);
  const [ewCost,      setEwCost]      = useState(160);
  const [exitPrice,   setExitPrice]   = useState(8000);
  const [carbonPrice, setCarbonPrice] = useState(35);
  const [carbStart,   setCarbStart]   = useState(3);
  const carbSliderVal = carbStart >= 99 ? 5 : carbStart;
  const [cattleOnset, setCattleOnset] = useState(5);

  function applyPreset(k) {
    var p = PRESETS[k];
    setPreset(k); setCustom(false);
    setAcqPrice(p.acqPrice); setEwCost(p.ewCost); setExitPrice(p.exitPrice);
    setCarbonPrice(p.carbonPriceT1); setCarbStart(p.carbStart === 99 ? 99 : p.carbStart);
    setCattleOnset(p.cattleOnset);
  }

  var a = { acqPrice:acqPrice, ewCost:ewCost, exitPrice:exitPrice, carbonPriceT1:carbonPrice, carbonGrowth:0.05, carbStart:carbStart, cattleOnset:cattleOnset, dataOnset:2, ha:5000 };
  var d = buildFinModel(a, model);
  var isAcq = model === "acquisition";
  var pColor = custom ? "#3b33a0" : PRESETS[preset].color;

  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
        <div style={{ display:"flex", gap:2, background:"#f0ede5", borderRadius:6, padding:3 }}>
          {["acquisition","equipment"].map(function(m) {
            return <button key={m} onClick={function() { setModel(m); }} style={{ padding:"5px 14px", borderRadius:4, border:"none", background:model===m?"#1a1a18":"transparent", color:model===m?"#fff":"#888780", fontSize:12, fontFamily:"system-ui,sans-serif", cursor:"pointer" }}>{m==="acquisition"?"Acquisition model":"Equipment-only (POC)"}</button>;
          })}
        </div>
        <div style={{ display:"flex", gap:2, background:"#f0ede5", borderRadius:6, padding:3 }}>
          {["best","base","floor"].map(function(k) {
            var active = !custom && preset===k;
            return <button key={k} onClick={function() { applyPreset(k); }} style={{ padding:"5px 14px", borderRadius:4, border:"none", background:active?PRESETS[k].color:"transparent", color:active?"#fff":"#888780", fontSize:12, fontFamily:"system-ui,sans-serif", cursor:"pointer" }}>{PRESETS[k].label}</button>;
          })}
          {custom && <span style={{ padding:"5px 14px", borderRadius:4, background:"#3b33a0", color:"#fff", fontSize:12, fontFamily:"system-ui,sans-serif" }}>Custom</span>}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:1, background:"#e8e6e0", borderRadius:8, overflow:"hidden", marginBottom:14 }}>
        {[
          { l:"Total CapEx",         v:"AUD $"+d.capex.toFixed(1)+"M", c:null },
          { l:"Cash flow breakeven", v:d.breakeven>=0?"Year "+d.breakeven:"Post Y10", c:d.breakeven>=0&&d.breakeven<=6?"#0a6b47":d.breakeven<=9?"#9a5a00":"#c0392b" },
          { l:"IRR (estimated)",     v:d.irr!==null?d.irr+"%":"n/a",   c:d.irr>=25?"#0a6b47":d.irr>=12?"#9a5a00":"#c0392b" },
          { l:"NPV at 10% discount", v:"AUD $"+d.npv.toFixed(1)+"M",  c:d.npv>0?"#0a6b47":"#c0392b" },
        ].map(function(m) {
          return (
            <div key={m.l} style={{ background:"#fff", padding:"14px 16px" }}>
              <div style={{ fontSize:10, fontFamily:"system-ui,sans-serif", color:"#888780", marginBottom:3, letterSpacing:"0.04em" }}>{m.l.toUpperCase()}</div>
              <div style={{ fontSize:17, fontWeight:"bold", fontFamily:"system-ui,sans-serif", color:m.c||"#1a1a18" }}>{m.v}</div>
            </div>
          );
        })}
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={d.rows} margin={{ top:5, right:5, left:0, bottom:0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0ede5"/>
          <XAxis dataKey="y" tick={{ fill:"#888780", fontSize:11, fontFamily:"system-ui,sans-serif" }} axisLine={{ stroke:"#e8e6e0" }} tickLine={false}/>
          <YAxis tick={{ fill:"#888780", fontSize:11, fontFamily:"system-ui,sans-serif" }} axisLine={{ stroke:"#e8e6e0" }} tickLine={false} tickFormatter={function(v) { return "$"+v+"M"; }}/>
          <Tooltip contentStyle={{ background:"#fff", border:"1px solid #e8e6e0", borderRadius:8, fontSize:12, fontFamily:"system-ui,sans-serif" }} formatter={function(v, n) { return ["AUD $"+v+"M", n]; }}/>
          <ReferenceLine y={0} stroke="#c8c5bc" strokeDasharray="4 4"/>
          <Bar dataKey="carbon" stackId="rev" fill="#0a6b47" opacity={0.7} name="Carbon"/>
          <Bar dataKey="data"   stackId="rev" fill="#3b33a0" opacity={0.7} name="Data"/>
          <Bar dataKey="cattle" stackId="rev" fill="#9a5a00" opacity={0.7} name="Cattle"/>
          <Line type="monotone" dataKey="cf" stroke="#1a1a18" strokeWidth={2.5} dot={false} name="Cum. cash flow"/>
          {isAcq && <Line type="monotone" dataKey="lv" stroke="#c4420a" strokeWidth={2} strokeDasharray="6 4" dot={false} name="Land value"/>}
          <Legend wrapperStyle={{ fontSize:11, fontFamily:"system-ui,sans-serif", color:"#888780", paddingTop:8 }}/>
        </ComposedChart>
      </ResponsiveContainer>

      {isAcq && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginTop:14 }}>
          {[
            { l:"DEGRADED ACQUISITION",  v:"AUD $"+acqPrice+"/ha",              note:"NT pastoral comparable",           bg:"#fdf0ee", bc:"#f5c6c2", tc:"#c0392b" },
            { l:"ARBITRAGE DELTA",       v:"AUD $"+(exitPrice-acqPrice).toLocaleString()+"/ha", note:"Manufactured by TerraForm Earth", bg:"#f9f8f5", bc:"#e8e6e0", tc:"#0a6b47" },
            { l:"PRODUCTIVE EXIT VALUE", v:"AUD $"+exitPrice.toLocaleString()+"/ha",  note:"N. Australia beef (ABARES 2024)", bg:"#f0faf5", bc:"#b3d9c8", tc:"#0a6b47" },
          ].map(function(m) {
            return (
              <div key={m.l} style={{ padding:"16px 20px", background:m.bg, border:"1px solid "+m.bc, borderRadius:8, textAlign:"center" }}>
                <div style={{ fontSize:10, fontFamily:"system-ui,sans-serif", color:m.tc, fontWeight:500, letterSpacing:"0.05em", marginBottom:6 }}>{m.l}</div>
                <div style={{ fontSize:20, fontFamily:"Georgia,serif", color:"#1a1a18", marginBottom:4 }}>{m.v}</div>
                <div style={{ fontSize:11, fontFamily:"system-ui,sans-serif", color:"#888780" }}>{m.note}</div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop:20, padding:20, background:"#f9f8f5", border:"1px solid #e8e6e0", borderRadius:8 }}>
        <div style={{ fontSize:12, fontFamily:"system-ui,sans-serif", fontWeight:500, color:"#1a1a18", marginBottom:16, letterSpacing:"0.05em", textTransform:"uppercase" }}>Adjust assumptions</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 32px" }}>
          <div>
            <SliderRow label="Acquisition price (AUD/ha)" value={acqPrice} min={100} max={800} step={50}  onChange={function(v){setAcqPrice(v);setCustom(true);}} format={function(v){return "AUD $"+v+"/ha";}}/>
            <SliderRow label="Earthworks cost (AUD/ha)"   value={ewCost}   min={80}  max={250} step={10}  onChange={function(v){setEwCost(v);setCustom(true);}}   format={function(v){return "AUD $"+v+"/ha";}}/>
            <SliderRow label="Exit price (AUD/ha)"        value={exitPrice} min={3000} max={20000} step={500} onChange={function(v){setExitPrice(v);setCustom(true);}} format={function(v){return "AUD $"+v.toLocaleString()+"/ha";}}/>
          </div>
          <div>
            <SliderRow label="Carbon price Year 1 (AUD/t)" value={carbonPrice} min={20} max={80} step={5}   onChange={function(v){setCarbonPrice(v);setCustom(true);}} format={function(v){return "AUD $"+v+"/t";}}/>
            <SliderRow label="First carbon issuance" value={carbSliderVal} min={2} max={5} step={1} onChange={function(v){setCarbStart(v);setCustom(true);}} format={function(v){return "Year "+v;}}/>
            <SliderRow label="Cattle onset"                value={cattleOnset} min={3} max={7} step={1}   onChange={function(v){setCattleOnset(v);setCustom(true);}} format={function(v){return "Year "+v;}}/>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, marginTop:4 }}>
          <button onClick={function(){applyPreset("base");}} style={{ padding:"6px 16px", borderRadius:4, border:"1px solid #e8e6e0", background:"#fff", color:"#888780", fontSize:12, fontFamily:"system-ui,sans-serif", cursor:"pointer" }}>Reset to base case</button>
          <button onClick={function(){setCustom(true);setCarbStart(99);}} style={{ padding:"6px 16px", borderRadius:4, border:"1px solid #f5c6c2", background:"#fdf0ee", color:"#c0392b", fontSize:12, fontFamily:"system-ui,sans-serif", cursor:"pointer" }}>Exclude carbon (floor)</button>
        </div>
      </div>

      <button onClick={function() { setShowCx(!showCx); }} style={{ marginTop:16, padding:"7px 16px", borderRadius:6, border:"1px solid #e8e6e0", background:"#fff", color:"#3d3d3a", fontSize:12, fontFamily:"system-ui,sans-serif", cursor:"pointer" }}>
        {showCx ? "Hide" : "Show"} CapEx derivation
      </button>
      {showCx && (
        <div style={{ marginTop:12, padding:20, background:"#f9f8f5", border:"1px solid #e8e6e0", borderRadius:8 }}>
          <div style={{ fontSize:13, fontFamily:"system-ui,sans-serif", fontWeight:500, color:"#1a1a18", marginBottom:12 }}>Machine-level unit economics -- Bobcat CTL (base case inputs)</div>
          {[
            ["CTL hardware (Bobcat T86, mid-spec)","AUD $135,000"],
            ["Autonomy retrofit (est. -- no commercial product yet)","AUD $45,000"],
            ["Total per machine","AUD $180,000"],
            ["Useful life -- conservative, abrasive conditions","5,000 operating hours"],
            ["Effective utilisation","70% -- approx. 3,500 effective hrs/yr"],
            ["Pit cycle time -- requires field validation","5 minutes (assumed)"],
            ["Pits per hour","12 pits"],
            ["Pits per hectare -- moderate density","60 pits/ha"],
            ["Hectares per machine per day","3.4 ha/day"],
            ["Derived cost -- moderate density, 5-min cycle","approx. AUD $180/ha"],
            ["Derived cost -- optimistic (4-min cycle, 40 pits/ha)","approx. AUD $96/ha"],
          ].map(function(row) {
            return (
              <div key={row[0]} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid #e8e6e0" }}>
                <span style={{ fontSize:12, fontFamily:"system-ui,sans-serif", color:"#5f5e5a" }}>{row[0]}</span>
                <span style={{ fontSize:12, fontFamily:"system-ui,sans-serif", fontWeight:500, color:"#1a1a18", textAlign:"right", marginLeft:12 }}>{row[1]}</span>
              </div>
            );
          })}
          <div style={{ marginTop:12, padding:10, background:"#fff8ee", border:"1px solid #f0d9b3", borderRadius:6, fontSize:12, fontFamily:"system-ui,sans-serif", color:"#633806", lineHeight:1.6 }}>
            The commonly cited $100/ha figure is achievable only at the optimistic end of both cycle time and density assumptions. Base case is AUD $140-180/ha until the adaptive trial validates the cycle time assumption. Pit cycle time is the single most important unvalidated input in the CapEx model.
          </div>
        </div>
      )}
      <div style={{ marginTop:14, padding:14, background:"#f5f4ff", border:"1px solid #c5c2f0", borderRadius:8, fontSize:13, fontFamily:"system-ui,sans-serif", color:"#3d3d3a", lineHeight:1.7 }}>
        <strong style={{ color:"#3b33a0" }}>Carbon methodology: </strong>
        All scenarios modelled on ERF Soil Carbon -- established under the Clean Energy Regulator. Year 1 carbon revenue is zero in all scenarios. ACCU spot price: AUD $30-35/t (EY, Jan 2026); EY central estimate AUD $70/t by 2035. Sequestration rate: 0.3-1.5 tCO2e/ha/yr. Floor case / "Exclude carbon" button models zero ACCU income to confirm model viability without carbon revenue.
      </div>
    </div>
  );
}

function TechCard({ t, tierLabel, tierColor, tierBg }) {
  const [open, setOpen] = useState(false);
  var autoColor = t.auto==="High" ? "#0a6b47" : (t.auto==="Moderate"||t.auto==="Low-Moderate") ? "#9a5a00" : "#c0392b";
  var autoBg   = t.auto==="High" ? "#f0faf5" : (t.auto==="Moderate"||t.auto==="Low-Moderate") ? "#fffbf0" : "#fdf0ee";
  return (
    <div style={s.acc}>
      <div style={s.accH(open)} onClick={function() { setOpen(!open); }}>
        <div style={{ width:30, height:30, borderRadius:6, background:t.color, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:"bold", fontFamily:"system-ui,sans-serif", flexShrink:0 }}>{t.n}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:500, fontFamily:"system-ui,sans-serif", fontSize:14, color:"#1a1a18" }}>{t.label}</div>
          <div style={{ fontSize:12, fontFamily:"system-ui,sans-serif", color:"#888780" }}>{t.sub}</div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center", marginRight:12 }}>
          <span style={s.tag(tierColor, tierBg)}>{tierLabel.split("--")[0].trim()}</span>
          <span style={s.tag(autoColor, autoBg)}>{"Auto: "+t.auto}</span>
        </div>
        <div style={{ color:"#aaa", fontSize:12, fontFamily:"system-ui,sans-serif" }}>{open?"Hide":"Show"}</div>
      </div>
      {open && (
        <div style={{ padding:"20px 20px 20px 64px", background:t.lightBg, borderTop:"1px solid #e8e6e0" }}>
          <p style={{ fontSize:15, color:"#3d3d3a", lineHeight:1.8, marginBottom:14 }}>{t.body}</p>
          <div style={{ padding:12, background:"#fff", borderRadius:6, border:"1px solid #e8e6e0", marginBottom:12 }}>
            <div style={{ fontSize:11, fontFamily:"system-ui,sans-serif", fontWeight:500, color:t.color, marginBottom:4, letterSpacing:"0.05em", textTransform:"uppercase" }}>Platform integration</div>
            <div style={{ fontSize:13, fontFamily:"system-ui,sans-serif", color:"#3d3d3a", lineHeight:1.6 }}>{t.platform}</div>
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {[{ k:"Autonomous maturity", v:t.auto, c:autoColor },{ k:"Cost / ha", v:t.cost },{ k:"Ecological impact", v:t.impact },{ k:"HEIDI integration", v:t.heidi }].map(function(m) {
              return (
                <div key={m.k} style={{ padding:"6px 12px", background:"#fff", border:"1px solid #e8e6e0", borderRadius:6 }}>
                  <div style={{ fontSize:10, fontFamily:"system-ui,sans-serif", color:"#888780", marginBottom:2 }}>{m.k}</div>
                  <div style={{ fontSize:12, fontFamily:"system-ui,sans-serif", fontWeight:500, color:m.c||"#1a1a18" }}>{m.v}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function RiskTable() {
  const [open, setOpen] = useState(null);
  var risks = [
    { label:"Mispriced acquisition",        sev:"Critical", sc:"#c0392b", mit:"Rigorous pre-acquisition due diligence: rainfall adequacy, soil profile, topographic treatment cost confirmed before any price is agreed. Cannot be corrected downstream." },
    { label:"Ecological timeline variance",  sev:"High",     sc:"#c0392b", mit:"Conservative projections built on below-average rainfall assumptions. Carbon revenue from Y2 provides interim cash flow. Portfolio diversification across rainfall zones." },
    { label:"HEIDI architecture deferred",   sev:"High",     sc:"#c0392b", mit:"Treat as pre-revenue foundational capital. Every property without properly-designed HEIDI loses longitudinal continuity permanently. Cannot be retrofitted." },
    { label:"Native Title delays (WA)",      sev:"High",     sc:"#c0392b", mit:"Early engagement, ILUA negotiation. NT Aboriginal freehold model avoids Native Title exposure entirely." },
    { label:"Bobcat autonomy readiness",     sev:"High",     sc:"#c0392b", mit:"RogueX3 is a concept prototype. Near-term: standard CTL + GPS-guided semi-autonomous operation. Full autonomy is a development milestone, not a Day 1 feature. Reflected in CapEx model." },
    { label:"Yeomans Plow autonomy gap",     sev:"High",     sc:"#c0392b", mit:"JD 8R autonomy kit interoperable with JD implements only. Yeomans Plow requires human operator Y0-2. Staffing and OpEx implications reflected in financial model." },
    { label:"CASA BVLOS approval",           sev:"Medium",   sc:"#b05a00", mit:"Commercial BVLOS requires CASA ReOC with BVLOS endorsement. Timeline 12-18 months. POC operations are VLOS-compliant. BVLOS not required for seed-stage deployment." },
    { label:"ACCU methodology",             sev:"Medium",   sc:"#b05a00", mit:"ERF Soil Carbon is the primary pathway -- established and registered. IFLM not relied upon. Floor case excludes carbon entirely to confirm model viability without ACCU income." },
    { label:"IP exposure",                  sev:"Medium",   sc:"#b05a00", mit:"VF2.0 invention disclosure filed March 12, 2026. Gap between disclosure and patent filing is active exposure. Patent applications across all systems: 6-month priority target." },
    { label:"Co-founder equity structure",  sev:"High",     sc:"#c0392b", mit:"All IP owned by Hobbs Magaret and predates co-founding discussions. Formal equity, IP assignment, and vesting terms with Matthew Warnken must be resolved before external capital is raised. 30-day target." },
    { label:"Carbon market methodology",    sev:"Medium",   sc:"#b05a00", mit:"Carbon modelled as upside in base case. Floor case must show viability without ACCUs -- confirmed. Earthworks economics close on livestock + land appreciation alone." },
    { label:"Compaction layer depth",       sev:"Medium",   sc:"#b05a00", mit:"Soil profile assessment during pre-acquisition due diligence. Confirm working depth before deployment. Deep ripping available as conditional additional system." },
    { label:"Replication risk",             sev:"Medium",   sc:"#b05a00", mit:"Technique is replicable. Moat is HEIDI data. Only defence is speed -- build data platform depth before competitors reach meaningful scale." },
  ];
  return (
    <div>
      {risks.map(function(r, i) {
        var sevBg = r.sev==="Critical"||r.sev==="High" ? "#fdf0ee" : "#fff8ee";
        return (
          <div key={i} style={s.acc}>
            <div style={s.accH(open===i)} onClick={function() { setOpen(open===i?null:i); }}>
              <span style={s.tag(r.sc, sevBg)}>{r.sev}</span>
              <span style={{ flex:1, fontFamily:"system-ui,sans-serif", fontSize:14, color:"#1a1a18", fontWeight:500 }}>{r.label}</span>
              <span style={{ color:"#aaa", fontSize:12, fontFamily:"system-ui,sans-serif" }}>{open===i?"Hide":"Show"}</span>
            </div>
            {open===i && (
              <div style={{ padding:"14px 20px", background:"#fefefe", borderTop:"1px solid #e8e6e0", fontSize:14, fontFamily:"system-ui,sans-serif", color:"#3d3d3a", lineHeight:1.7 }}>
                <span style={{ color:"#888780", fontWeight:500 }}>Mitigation: </span>{r.mit}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Chat() {
  const [msgs, setMsgs] = useState([{ role:"assistant", content:"I have complete knowledge of the TerraForm Earth business plan -- the five-layer stack, financials, land strategy, technology, operations, and risks. Ask me anything." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(function() { endRef.current && endRef.current.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  function send() {
    if (!input.trim() || loading) return;
    var userMsg = { role:"user", content:input };
    var newMsgs = msgs.concat([userMsg]);
    setMsgs(newMsgs);
    setInput("");
    setLoading(true);
    fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system:SYS, messages:newMsgs.map(function(m) { return { role:m.role, content:m.content }; }) })
    }).then(function(r) { return r.json(); }).then(function(d) {
      setMsgs(function(m) { return m.concat([{ role:"assistant", content:(d.content&&d.content[0]&&d.content[0].text)||"No response." }]); });
      setLoading(false);
    }).catch(function() {
      setMsgs(function(m) { return m.concat([{ role:"assistant", content:"Connection error. Please try again." }]); });
      setLoading(false);
    });
  }

  var qs = ["What is the biggest risk?","How does HEIDI create a moat?","Walk me through the unit economics","Explain the POC model","What is the seed raise for?","What happens after the POC?"];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:540, background:"#fff", borderRadius:8, border:"1px solid #e8e6e0", overflow:"hidden" }}>
      <div style={{ flex:1, overflowY:"auto", padding:20, display:"flex", flexDirection:"column", gap:12 }}>
        {msgs.map(function(m, i) {
          return <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}><div style={s.bubble(m.role==="user")}>{m.content}</div></div>;
        })}
        {loading && <div style={{ display:"flex" }}><div style={{ ...s.bubble(false), color:"#888780" }}>Thinking...</div></div>}
        <div ref={endRef}/>
      </div>
      <div style={{ padding:"10px 14px", borderTop:"1px solid #e8e6e0", display:"flex", flexWrap:"wrap", gap:6, background:"#f9f8f5" }}>
        {qs.map(function(q) { return <button key={q} onClick={function() { setInput(q); }} style={{ padding:"5px 12px", borderRadius:20, border:"1px solid #e8e6e0", background:"#fff", color:"#3d3d3a", fontSize:12, fontFamily:"system-ui,sans-serif", cursor:"pointer" }}>{q}</button>; })}
      </div>
      <div style={{ padding:14, borderTop:"1px solid #e8e6e0", display:"flex", gap:8 }}>
        <input value={input} onChange={function(e) { setInput(e.target.value); }} onKeyDown={function(e) { if (e.key==="Enter") send(); }} placeholder="Ask about TerraForm Earth..." style={s.input}/>
        <button onClick={send} disabled={loading} style={s.sendBtn}>Send</button>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [accessLog, setAccessLog] = useState(null);
  const [tab, setTab] = useState("overview");
  const [activeDiagram, setActiveDiagram] = useState(null);

  if (!unlocked) {
    return <Gate onUnlock={function(name, email, ts) { setVisitorName(name); setAccessLog({ name:name, email:email, ts:ts }); setUnlocked(true); }}/>;
  }

  var tabs = [
    { id:"overview",    label:"Overview" },
    { id:"stack",       label:"The Stack" },
    { id:"technology",  label:"Technology" },
    { id:"sheepdog",    label:"SheepDog" },
    { id:"operations",  label:"Operations" },
    { id:"rehydration", label:"Rehydration" },
    { id:"land",        label:"Land Strategy" },
    { id:"financials",  label:"Financials" },
    { id:"risks",       label:"Risks" },
    { id:"horizon",     label:"The Long Game" },
    { id:"chat",        label:"Talk to the Plan" },
  ];

  var LAYERS_OPS = [
    { tier:1, n:"01", label:"Swales",           sub:"On-contour infiltration channels", color:"#0a6b47", lightBg:"#f0faf5", auto:"High",         cost:"Medium",      impact:"High",          heidi:"Full",          body:"A swale is a level trench excavated precisely on contour, with a compacted berm on the downslope side. Holds water stationary until it infiltrates. Handles landscape-scale interception where half-moon pits handle micro-scale capture.", platform:"Third earthworks system for moderate-slope zones. GPS-guided excavator following the same contour algorithm used for the Yeomans Plow." },
    { tier:1, n:"02", label:"Drone seeding",    sub:"Precision post-earthworks seeding", color:"#0a6b47", lightBg:"#f0faf5", auto:"High",         cost:"Low",         impact:"High",          heidi:"Full (natural)",body:"Aerial seeding into disturbed soil zones created by earthworks. Earthworks create ideal germination conditions. HEIDI triggers a seeding pass within 24-72 hours of treatment zone completion.", platform:"Near-term extension of the existing drone fleet. Species mix prescribed by HEIDI based on soil type, rainfall zone, slope aspect, and target community." },
    { tier:1, n:"03", label:"Floodout earthworks", sub:"Valley floor water management", color:"#0a6b47", lightBg:"#f0faf5", auto:"High",         cost:"Low-Medium",  impact:"Very High",     heidi:"Full",          body:"Low contour banks, spreader banks, and retention structures slow flood water, spread it evenly, and extend contact time with the soil. A single well-placed spreader bank can influence the hydrology of hundreds of hectares.", platform:"Fourth earthworks system for valley floor and floodout zones. Most accessible terrain on the property." },
    { tier:2, n:"04", label:"Contour bunds",    sub:"Earth banks for rocky terrain",    color:"#9a5a00", lightBg:"#fffbf0", auto:"High",         cost:"Low",         impact:"Medium-High",   heidi:"Full",          body:"Low compacted earth wall constructed on contour. Faster and cheaper per linear metre than swales, better suited to rocky or shallow-soil terrain where excavation is difficult.", platform:"Primary technique for rocky or shallow-soil slope zones where swales are not viable. Lowest cost per linear metre of any structural water harvesting technique." },
    { tier:2, n:"05", label:"Deep ripping",     sub:"Beyond Yeomans Plow depth",        color:"#9a5a00", lightBg:"#fffbf0", auto:"High",         cost:"Medium-High", impact:"High (targeted)",heidi:"Full",          body:"Where the Yeomans Plow operates at 300-500mm, deep ripping extends to 600-1200mm using heavier multi-shank rippers. Required where calcrete, silcrete, or indurated clay sits below standard Plow reach.", platform:"Conditional third subsoil tillage system, prescribed by HEIDI where soil profile data indicates cemented layers beyond standard Yeomans Plow reach." },
    { tier:2, n:"06", label:"Biochar",          sub:"Soil biology accelerant",           color:"#9a5a00", lightBg:"#fffbf0", auto:"Moderate",     cost:"Medium",      impact:"Medium",        heidi:"Full",          body:"Charcoal produced from on-property woody biomass via pyrolysis, applied to soil to improve water-holding capacity, cation exchange capacity, and microbial habitat. Addresses the soil biology layer earthworks alone do not treat.", platform:"Soil amendment layer in the ecological manufacturing process, particularly in zones where soil biology is severely depleted. Mobile on-property pyrolysis converts invasive species into a soil amendment." },
    { tier:3, n:"07", label:"Check dams",       sub:"Drainage line restoration",         color:"#3b33a0", lightBg:"#f5f4ff", auto:"Low-Moderate", cost:"Medium",      impact:"Very High",     heidi:"Prescription",  body:"Low structures built across drainage lines to slow water velocity, drop sediment load, and raise the local water table. Incised drainage lines drain the surrounding landscape -- raising the bed level has a disproportionate effect on hydrology.", platform:"Prescribed by HEIDI based on drainage line incision mapping. Specialist operation -- contractor-delivered or semi-autonomous HEIDI-directed." },
    { tier:3, n:"08", label:"Brush packing",    sub:"Gully restoration",                 color:"#3b33a0", lightBg:"#f5f4ff", auto:"Low",          cost:"Low",         impact:"High (gullies)", heidi:"Prescription", body:"Cut woody vegetation placed across the floor of an active gully to slow water velocity, trap sediment, and create conditions for vegetation re-establishment. Exploits biomass already present on the property.", platform:"Prescribed by HEIDI, executed manually. Well-suited to engagement of local contractors and indigenous ranger groups." },
    { tier:3, n:"09", label:"Zai pits",         sub:"Micro-catchment planting pits",     color:"#3b33a0", lightBg:"#f5f4ff", auto:"Emerging",     cost:"High",        impact:"High (targeted)",heidi:"Prescription + future", body:"Small planting pit (20-30cm wide, 10-20cm deep) with organic matter placed before planting, creating a micro-catchment that captures rainfall from its immediate surroundings. Establishes vegetation on land so degraded that surface seeding fails entirely.", platform:"Near-term: manual technique for targeted establishment in critical zones. Medium-term: candidate for a purpose-built small autonomous platform." },
    { tier:3, n:"10", label:"Mulching",         sub:"Surface organic matter",            color:"#3b33a0", lightBg:"#f5f4ff", auto:"Moderate",     cost:"Medium",      impact:"Medium",        heidi:"Partial",       body:"Application of organic material to bare soil surfaces between and around earthworks structures. Reduces raindrop impact, retains soil moisture, moderates temperature extremes, and provides substrate for soil biology recovery.", platform:"Targeted application in critical establishment zones. Complements drone seeding -- mulch the pit zone, seed into the mulch." },
  ];

  return (
    <div style={{ ...s.page, position:"relative" }}>
      {activeDiagram && <DiagramModal diagram={activeDiagram} onClose={function() { setActiveDiagram(null); }}/>}
      <div style={s.nav}>
        <span style={s.brand}>TerraForm Earth</span>
        <span style={{ fontSize:11, fontFamily:"system-ui,sans-serif", color:"#888780", paddingLeft:14, paddingRight:14, marginRight:4, borderRight:"1px solid #e8e6e0", whiteSpace:"nowrap" }}>
          {visitorName} {accessLog && accessLog.ts ? "-- "+accessLog.ts : ""}
        </span>
        <div style={s.navScroll}>
          {tabs.map(function(t) {
            return <button key={t.id} style={s.navBtn(tab===t.id)} onClick={function() { setTab(t.id); }}>{t.label}</button>;
          })}
        </div>
        <button onClick={function() { var el=document.documentElement; if(!document.fullscreenElement){el.requestFullscreen&&el.requestFullscreen();}else{document.exitFullscreen&&document.exitFullscreen();} }} style={{ marginLeft:8, padding:"6px 10px", borderRadius:6, border:"1px solid #e8e6e0", background:"#fff", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" stroke="#888780" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      <div style={s.wrap}>

        {tab==="overview" && (
          <div>
            <div style={s.eyebrow}>Investor Briefing -- March 2026</div>
            <h1 style={s.h1}>The market prices what it can see.<br/>We manufacture what it cannot.</h1>
            <p style={{ ...s.body, fontSize:17, maxWidth:620 }}>Degraded semi-arid land trades at a fraction of productive land pricing because the market prices current condition. TerraForm Earth acquires this land, deploys an autonomous earthworks fleet to restore the water cycle, and manufactures productive capacity where none visibly existed. Four revenue streams compound across the manufacturing timeline.</p>
            <blockquote style={s.quote}>"We have identified a structural price gap in Australian land markets, built an autonomous system that closes it repeatably at scale, and are constructing a proprietary intelligence platform that compounds in value with every property added to the network."</blockquote>
            <hr style={s.rule}/>
            <h2 style={s.h2}>The opportunity in numbers</h2>
            <div style={s.metaGrid}>
              {[
                { label:"Degraded acquisition",  val:"$200-600/ha",  note:"AUD -- NT comparable (Bendigo Bank, H1 2025)" },
                { label:"All-in treatment cost",  val:"~$350-780/ha", note:"AUD -- land + earthworks (base case)" },
                { label:"Productive exit value",  val:"$8,000-15,000/ha", note:"AUD -- N. Australia beef land (ABARES 2024)" },
                { label:"First carbon revenue",   val:"Year 2-3",     note:"ERF Soil Carbon -- after project registration" },
                { label:"Seed raise",             val:"AUD $2.5M",    note:"Equipment-only POC model -- no land acquisition" },
                { label:"The moat",               val:"HEIDI data",   note:"Compounds with every property added" },
              ].map(function(m) {
                return <div key={m.label} style={s.metaCell}><div style={s.metaVal}>{m.val}</div><div style={s.metaLabel}>{m.label}</div><div style={s.metaNote}>{m.note}</div></div>;
              })}
            </div>
            <hr style={s.rule}/>
            <h2 style={s.h2}>Why the price gap is structural</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:8 }}>
              {[
                { n:"01", label:"The land is cheap for the wrong reason", color:"#c4420a", body:"The market discounts degraded land because it cannot see the broken water cycle -- it sees bare compacted earth. TerraForm acquires the discount, then removes the cause of it." },
                { n:"02", label:"Autonomous earthworks close the cost gap", color:"#9a5a00", body:"GPS-guided autonomous earthworks change the cost structure permanently. The manufacturing margin between all-in treatment cost and exit value is real and repeatable. Every property is the same playbook." },
                { n:"03", label:"The ecological process runs on rainfall", color:"#0a6b47", body:"After earthworks are deployed, the ecological manufacturing process requires no further capital. Pioneer species germinate, root networks fracture hardpan, vegetation establishes. Capital deployed once. Value compounds for decades." },
              ].map(function(c) {
                return (
                  <div key={c.n} style={{ ...s.cardSm, borderTop:"3px solid "+c.color }}>
                    <div style={{ fontSize:22, fontFamily:"Georgia,serif", color:c.color, marginBottom:8, lineHeight:1 }}>{c.n}</div>
                    <div style={{ fontFamily:"system-ui,sans-serif", fontSize:13, fontWeight:500, color:"#1a1a18", marginBottom:8 }}>{c.label}</div>
                    <p style={{ fontSize:13, color:"#5f5e5a", lineHeight:1.7, marginBottom:0 }}>{c.body}</p>
                  </div>
                );
              })}
            </div>
            <hr style={s.rule}/>
            <h2 style={s.h2}>Four revenue streams. One property.</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { label:"Carbon credits",     note:"ERF Soil Carbon method. First issuance Year 2-3 after project registration.",              color:"#0a6b47", pct:0,  timing:"Year 2-3" },
                { label:"Data licensing",     note:"Telemetry, pasture imaging, carbon data licensed to processors, financiers, verifiers.",    color:"#3b33a0", pct:18, timing:"Year 2" },
                { label:"Cattle -- VF2.0",    note:"No physical fencing capital. Rotational grazing under SheepDog drone management.",            color:"#9a5a00", pct:36, timing:"Year 3-5" },
                { label:"Land appreciation",  note:"Degraded to productive pricing. Largest single value event. Crystallised at exit.",         color:"#c4420a", pct:54, timing:"Year 5-10" },
              ].map(function(str) {
                return (
                  <div key={str.label} style={{ display:"flex", alignItems:"center", gap:16, padding:"14px 16px", background:"#fff", border:"1px solid #e8e6e0", borderRadius:8 }}>
                    <div style={{ width:80, minWidth:80 }}>
                      <div style={{ fontFamily:"system-ui,sans-serif", fontSize:13, fontWeight:500, color:"#1a1a18" }}>{str.label}</div>
                      <div style={{ fontFamily:"system-ui,sans-serif", fontSize:11, color:str.color, marginTop:2 }}>{str.timing}</div>
                    </div>
                    <div style={{ flex:1, height:8, background:"#f0ede5", borderRadius:4, overflow:"hidden", position:"relative" }}>
                      <div style={{ position:"absolute", top:0, bottom:0, left:str.pct+"%", right:0, background:str.color, opacity:0.7, borderRadius:4 }}/>
                    </div>
                    <div style={{ width:240, minWidth:240, fontSize:12, fontFamily:"system-ui,sans-serif", color:"#888780", lineHeight:1.5 }}>{str.note}</div>
                  </div>
                );
              })}
            </div>
            <hr style={s.rule}/>
            <h2 style={s.h2}>The defensible position</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                { label:"HEIDI -- the data moat",        color:"#3b33a0", bg:"#f5f4ff", body:"Every property TerraForm operates builds the longitudinal dataset that makes HEIDI's models more accurate. A competitor entering in Year 5 starts from zero. The gap cannot be closed by capital alone -- only by time." },
                { label:"Near-zero land access cost",     color:"#c4420a", bg:"#fff5f0", body:"WA Diversification Leases, DPaW co-management, SA surrendered pastoral leases, and NT Aboriginal Land Trust JVs create a pathway to millions of hectares at nominal or zero acquisition cost." },
                { label:"Stacked environmental markets", color:"#0a6b47", bg:"#f0faf5", body:"A single property can simultaneously generate soil carbon ACCUs and Nature Repair Market biodiversity certificates. Legally confirmed -- one parcel, multiple income streams." },
                { label:"The long game",                 color:"#888780", bg:"#f9f8f5", body:"Every system TerraForm builds to restore a broken water cycle is, at its deepest logic, a system for making barren worlds habitable. Earth is the laboratory. The data platform, the autonomous fleet, the ecological manufacturing protocols -- all of it scales beyond this planet." },
              ].map(function(c) {
                return (
                  <div key={c.label} style={{ background:c.bg, border:"1px solid #e8e6e0", borderRadius:8, padding:"18px 20px" }}>
                    <div style={{ fontFamily:"system-ui,sans-serif", fontSize:13, fontWeight:500, color:c.color, marginBottom:8 }}>{c.label}</div>
                    <p style={{ fontSize:13, color:"#5f5e5a", lineHeight:1.7, marginBottom:0 }}>{c.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab==="stack" && (
          <div>
            <div style={s.eyebrow}>Business architecture</div>
            <h1 style={s.h1}>The five-layer stack</h1>
            <p style={s.body}>TerraForm Earth manufactures value -- it does not extract it from land that is already productive. Value concentrates at the layers that are hardest to see, hardest to replicate, and most foundational to everything above them.</p>
            <blockquote style={s.quote}>"The foundation is the acquisition. The manufacturing is the earthworks. The moat is the data. The return is the spread."</blockquote>
            <StackView/>
            <hr style={s.rule}/>
            <h2 style={s.h2}>Regeneration feedback loop</h2>
            <p style={s.body}>Layer 3 is the only layer that improves without human intervention and without cost. Each improvement feeds the next -- the system becomes more productive over time through its own operation.</p>
            <RegenLoop/>
          </div>
        )}

        {tab==="technology" && (
          <div>
            <div style={s.eyebrow}>Platform technology</div>
            <h1 style={s.h1}>HEIDI and the autonomous earthworks fleet</h1>
            <div style={{ ...s.card, borderLeft:"3px solid #3b33a0" }}>
              <h2 style={{ ...s.h2, marginBottom:4, color:"#3b33a0" }}>HEIDI -- the intelligence platform</h2>
              <div style={{ fontSize:13, fontFamily:"system-ui,sans-serif", color:"#888780", marginBottom:16, fontStyle:"italic" }}>The moat. Cannot be bought. Cannot be replicated. Only accumulated.</div>
              <p style={s.body}>HEIDI is not software that manages a property -- it is the accumulated institutional knowledge of every property TerraForm Earth has ever operated. Every paddock's specific response to rainfall. Every animal's individual behavioural profile. Every carbon cycle's measured trajectory. Every obstacle below the soil surface.</p>
              <p style={{ ...s.body, marginBottom:16 }}>A competitor entering in Year 5 does not start at Year 5. They start at Year 1 -- with no longitudinal data, no property-specific predictive models, no individual animal histories, no subsurface maps.</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {[
                  { label:"Data ingestion",         color:"#3b33a0", items:["Earthworks fleet -- position, task progress, soil sensor readings","Ear tag network -- continuous animal telemetry and behaviour state","Drone fleet -- multispectral imaging, thermal, carbon MRV","Environmental sensors -- rainfall, soil moisture, temperature"] },
                  { label:"Property world model",    color:"#3b33a0", items:["Single continuously updated model per property","Georeferenced subsurface obstacle map","Real-time carbon sequestration accounting at paddock resolution","Predictive flagging of conditions requiring human attention"] },
                  { label:"Autonomous coordination", color:"#3b33a0", items:["Earthworks fleet task sequencing and zone prioritisation","Drone seeding triggers on post-earthworks windows (24-72hr)","SheepDog drone dispatch from mob-state boundary predictions","Biochar and mulch application rate prescription by zone"] },
                  { label:"Intelligence interface",  color:"#3b33a0", items:["Natural language queries and commands -- phone, desktop, voice","Voice pathway directly to the drone in the field","Third-party API layer for data licensing","TerraOS: multi-property intelligence from 2029"] },
                ].map(function(block) {
                  return (
                    <div key={block.label} style={{ background:"#f5f4ff", border:"1px solid #e0defc", borderRadius:8, padding:14 }}>
                      <div style={{ fontSize:12, fontFamily:"system-ui,sans-serif", fontWeight:500, color:"#3b33a0", marginBottom:8, paddingBottom:6, borderBottom:"1px solid #e0defc" }}>{block.label}</div>
                      {block.items.map(function(it) { return <div key={it} style={{ fontSize:12, fontFamily:"system-ui,sans-serif", color:"#3d3d3a", padding:"4px 0", borderBottom:"1px solid #efeffc", lineHeight:1.5 }}>{it}</div>; })}
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop:14, padding:14, background:"#fff", border:"1px solid #e0defc", borderRadius:8, fontSize:13, fontFamily:"system-ui,sans-serif", color:"#3d3d3a", lineHeight:1.7 }}>
                <strong style={{ color:"#3b33a0" }}>Critical architectural decision: </strong>HEIDI's data schema, carbon model structure, API layer, and longitudinal learning architecture must be designed before the first property is operational. A poorly designed schema cannot be retrofitted without losing the longitudinal continuity that makes the data valuable. This is the one layer where cutting corners is most expensive in the long run.
              </div>
            </div>
            <h2 style={s.h2}>Data flywheel</h2>
            <Flywheel/>
            <hr style={s.rule}/>
            <h2 style={s.h2}>Autonomy transition timeline</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:28 }}>
              {[
                { label:"Tractor + JD Chisel Plow", sub:"Contour tillage",                    status:"Fully autonomous -- commercial launch 2026", sc:"#0a6b47", sbg:"#f0faf5" },
                { label:"SheepDog Drones (VF2.0)",    sub:"Virtual fencing + data collection",  status:"POC trial 2026 -- operational 2027",         sc:"#9a5a00", sbg:"#fffbf0" },
                { label:"Tractor + Yeomans Plow",   sub:"Contour subsoil aeration",           status:"Human-operated now -- autonomous ~2029",     sc:"#9a5a00", sbg:"#fffbf0" },
                { label:"Bobcat -- half-moon pits", sub:"Water harvesting earthworks",        status:"GPS-guided now -- autonomous fleet ~2030",   sc:"#9a5a00", sbg:"#fffbf0" },
                { label:"TerraOS",                  sub:"Central multi-property intelligence",status:"Building now -- operational 2029",            sc:"#3b33a0", sbg:"#f5f4ff" },
              ].map(function(item) {
                return (
                  <div key={item.label} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", background:"#fff", border:"1px solid #e8e6e0", borderRadius:8 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:"system-ui,sans-serif", fontSize:14, fontWeight:500, color:"#1a1a18" }}>{item.label}</div>
                      <div style={{ fontFamily:"system-ui,sans-serif", fontSize:12, color:"#888780" }}>{item.sub}</div>
                    </div>
                    <div style={{ padding:"4px 12px", borderRadius:4, background:item.sbg, color:item.sc, fontSize:12, fontFamily:"system-ui,sans-serif", fontWeight:500 }}>{item.status}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ ...s.card, background:"#f0faf5", borderColor:"#b3d9c8" }}>
              <h3 style={{ ...s.h3, color:"#0a6b47", marginBottom:8 }}>How the technology connects to rehydration</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[
                  { tech:"HEIDI digital elevation model",    reh:"Prescribes exact earthworks placement -- swale lines, pit density zones, valley floor spreader banks" },
                  { tech:"Subsurface sensor on Yeomans Plow",reh:"Maps calcrete and hardpan depth, determining where deep ripping is warranted beyond standard tillage" },
                  { tech:"Drone multispectral imaging",      reh:"Monitors vegetation establishment rates and identifies zones requiring drone seeding or zai pit intervention" },
                  { tech:"Soil moisture sensors",            reh:"Tracks infiltration improvement season-by-season, calibrating HEIDI's rehydration models for future prescriptions" },
                ].map(function(r) {
                  return (
                    <div key={r.tech} style={{ background:"#fff", border:"1px solid #d0edd8", borderRadius:6, padding:"10px 12px" }}>
                      <div style={{ fontSize:11, fontFamily:"system-ui,sans-serif", fontWeight:500, color:"#0a6b47", marginBottom:3 }}>{r.tech}</div>
                      <div style={{ fontSize:12, fontFamily:"system-ui,sans-serif", color:"#3d3d3a", lineHeight:1.5 }}>{r.reh}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab==="sheepdog" && (
          <div>
            <div style={s.eyebrow}>Autonomous livestock management</div>
            <h1 style={s.h1}>SheepDog — pressure and release at scale</h1>
            <p style={{ ...s.body, fontSize:17, maxWidth:640 }}>Current collar-based virtual fencing conflates three functions in one device: sensing position, computing a response, and delivering an aversive stimulus. VF2.0 separates them entirely. The ear tag senses. The algorithm computes. The drone acts. The animal never experiences anything it hasn't evolved to understand — pressure from a predator shape, and release when it moves away.</p>

            <div style={{ ...s.card, borderLeft:"3px solid #9a5a00", marginBottom:28 }}>
              <h3 style={{ ...s.h3, color:"#9a5a00", marginBottom:12 }}>Why this is not a better shock collar</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {[
                  { label:"Collar-based VF", color:"#c0392b", bg:"#fdf0ee", items:["Novel aversive stimulus -- no evolutionary reference","Device on animal delivers punishment","Welfare exposure and regulatory risk","Senses, computes, and acts in one unit","No data yield beyond containment"] },
                  { label:"SheepDog VF2.0",  color:"#0a6b47", bg:"#f0faf5", items:["Pressure + release -- evolved flight-zone response","Drone acts at distance -- animal never touched","Zero pain mechanism, zero welfare exposure","Three separated functions: sense / compute / act","Every flight yields pasture, carbon, thermal data"] },
                ].map(function(col) {
                  return (
                    <div key={col.label} style={{ background:col.bg, border:"1px solid #e8e6e0", borderRadius:8, padding:16 }}>
                      <div style={{ fontSize:12, fontFamily:"system-ui,sans-serif", fontWeight:500, color:col.color, marginBottom:10, paddingBottom:8, borderBottom:"1px solid #e8e6e0", letterSpacing:"0.04em" }}>{col.label}</div>
                      {col.items.map(function(it) { return <div key={it} style={{ fontSize:13, fontFamily:"system-ui,sans-serif", color:"#3d3d3a", padding:"4px 0", borderBottom:"1px solid #e8e6e040", lineHeight:1.5 }}>{it}</div>; })}
                    </div>
                  );
                })}
              </div>
            </div>

            <h2 style={s.h2}>Three-layer architecture</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:28 }}>
              {[
                { label:"Sensing",     sub:"GPS ear tag network",      color:"#0a6b47", items:["GPS positioning -- continuous","Behavioural telemetry (graze/ruminate/move)","Audio cue -- GPS-triggered, no aversion","Upgrades existing commercial ear tag"] },
                { label:"Computation", sub:"Mob-state algorithm",      color:"#3b33a0", items:["Mob cohesion and drift direction model","Predictive timing -- prevent, not correct","Pressure geometry: vector, altitude, hover","Identifies lead animals as leverage point"] },
                { label:"Actuation",   sub:"Autonomous SheepDog drone",color:"#9a5a00", items:["Pressure + release via flight-zone response","Multispectral + thermal data collection","No pain mechanism -- zero welfare exposure","Secondary: continuous pasture imaging"] },
              ].map(function(layer) {
                return (
                  <div key={layer.label} style={s.cardSm}>
                    <div style={{ fontSize:14, fontWeight:"bold", fontFamily:"system-ui,sans-serif", color:layer.color, marginBottom:2 }}>{layer.label}</div>
                    <div style={{ fontSize:12, fontFamily:"system-ui,sans-serif", color:"#888780", marginBottom:12, paddingBottom:10, borderBottom:"1px solid #e8e6e0" }}>{layer.sub}</div>
                    {layer.items.map(function(it) { return <div key={it} style={{ fontSize:13, fontFamily:"system-ui,sans-serif", color:"#3d3d3a", padding:"5px 0", borderBottom:"1px solid #f0ede5", lineHeight:1.4 }}>{it}</div>; })}
                  </div>
                );
              })}
            </div>

            <h2 style={s.h2}>The mob-state algorithm — four stages</h2>
            <p style={{ ...s.body, marginBottom:16 }}>Step through drift detection, intercept calculation, drone deployment, and mob redirection.</p>
            <div style={{ border:"1px solid #e8e6e0", borderRadius:8, overflow:"hidden", marginBottom:28 }}>
              <iframe srcDoc={SHEEPDOG_HTML} style={{ width:"100%", height:440, border:"none", display:"block" }} title="SheepDog algorithm"/>
            </div>

            <div style={{ ...s.card, background:"#f5f4ff", borderColor:"#c5c2f0", marginBottom:28 }}>
              <h3 style={{ ...s.h3, color:"#3b33a0", marginBottom:10 }}>Every flight is a data collection event</h3>
              <p style={{ ...s.body, fontSize:14, marginBottom:16 }}>The SheepDog drone does not return to base empty. Each intercept flight also produces a multispectral pasture biomass reading, a thermal animal health scan across the mob, and a georeferenced carbon data point for the paddock just traversed. Livestock management and carbon MRV are the same physical operation.</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                {[
                  { label:"Pasture imaging",  sub:"Multispectral biomass",     color:"#0a6b47", bg:"#f0faf5" },
                  { label:"Animal health",    sub:"Thermal scanning -- mob",   color:"#9a5a00", bg:"#fffbf0" },
                  { label:"Carbon MRV",       sub:"Paddock-level sequestration",color:"#3b33a0", bg:"#f5f4ff" },
                ].map(function(d) {
                  return (
                    <div key={d.label} style={{ background:d.bg, border:"1px solid #e8e6e0", borderRadius:8, padding:"14px 16px", textAlign:"center" }}>
                      <div style={{ fontFamily:"system-ui,sans-serif", fontSize:13, fontWeight:500, color:d.color, marginBottom:4 }}>{d.label}</div>
                      <div style={{ fontFamily:"system-ui,sans-serif", fontSize:12, color:"#888780" }}>{d.sub}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <hr style={s.rule}/>
            <h2 style={s.h2}>Deployment status</h2>
            <div style={{ background:"#fffbf0", border:"1px solid #e8e6e0", borderRadius:8, padding:"16px 20px", marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <div style={{ fontFamily:"system-ui,sans-serif", fontSize:13, fontWeight:500, color:"#1a1a18" }}>SheepDog drones -- VF2.0</div>
                <span style={{ padding:"3px 10px", borderRadius:4, background:"#fff", border:"1px solid #9a5a00", color:"#9a5a00", fontSize:11, fontFamily:"system-ui,sans-serif", fontWeight:500, whiteSpace:"nowrap" }}>POC trial 2026</span>
              </div>
              <p style={{ fontSize:13, fontFamily:"system-ui,sans-serif", color:"#3d3d3a", lineHeight:1.7, marginBottom:0 }}>Drone fleet is operational at proof-of-concept stage. CASA currently requires VLOS for commercial drone operations. Fully autonomous remote BVLOS requires a CASA approval -- timeline 12-18 months from lodgement. POC operations are VLOS-compliant. BVLOS not a prerequisite for seed-stage deployment.</p>
            </div>
            <div style={{ padding:14, background:"#fdf8f7", border:"1px solid #f5c6c2", borderRadius:8, marginBottom:28, fontSize:13, fontFamily:"system-ui,sans-serif", color:"#3d3d3a", lineHeight:1.7 }}>
              <strong style={{ color:"#c0392b" }}>IP status: </strong>VF2.0 invention disclosure filed March 12, 2026. Patent applications across all SheepDog systems are a 6-month priority target. Gap between disclosure and filing is active exposure.
            </div>

            <hr style={s.rule}/>
            <div style={{ ...s.card, background:"#f9f8f5" }}>
              <h3 style={{ ...s.h3, marginBottom:8 }}>The long game</h3>
              <p style={{ ...s.body, fontSize:14, marginBottom:0 }}>Every system built for autonomous mob management on degraded Australian land is, structurally, a surface robotics platform. SheepDog drones operating across 5,000 hectares of semi-arid terrain solve exactly the problems that planetary surface survey requires: navigation in featureless terrain, autonomous return-to-base, multi-unit coordination, and continuous environmental data collection. The application transfers directly.</p>
            </div>
          </div>
        )}

        {tab==="operations" && (
          <div>
            <div style={s.eyebrow}>Operations and team</div>
            <h1 style={s.h1}>From invention to deployment.</h1>
            <div style={{ ...s.card, background:"#f5f4ff", borderColor:"#c5c2f0", marginBottom:28 }}>
              <h3 style={{ ...s.h3, color:"#3b33a0", marginBottom:8 }}>This document is the first instance of TerraOS</h3>
              <p style={{ ...s.body, marginBottom:0, fontSize:14 }}>The investor reading this is not reading a static business plan -- they are interacting with the proto-nervous system of the product. Intended evolution: pitch feedback -- Q&A refinement -- adversarial stress-test -- regulatory compliance mapping -- operational dashboards.</p>
            </div>
            <h2 style={s.h2}>Founding team</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
              {[
                { role:"Founder & CEO", name:"Hobbs Magaret", color:"#1a1a18", body:"Regenerative grazing expert, author of HERD, and developer of the nonequilibrium thermodynamic framework underlying TerraForm Earth's ecological manufacturing methodology. TerraForm Earth is Hobbs's invention -- the five-layer stack, HEIDI architecture, Virtual Fencing 2.0, and the land manufacturing thesis all predate any co-founding discussions. Role: strategy, technology architecture, and on-property operations through proof-of-concept." },
                { role:"Co-Founder & Executive Chairman", name:"Matthew Warnken", color:"#0a6b47", body:"Established climate entrepreneur and founder of AgriProve -- Australia's leading soil carbon platform. Matthew brings deep expertise in carbon market infrastructure, regulatory engagement, and scaling climate technology businesses. Role: commercial strategy, investor relationships, and carbon market access." },
              ].map(function(m) {
                return (
                  <div key={m.name} style={{ ...s.card, borderTop:"3px solid "+m.color, marginBottom:0 }}>
                    <div style={{ fontSize:11, fontFamily:"system-ui,sans-serif", fontWeight:500, color:"#888780", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:4 }}>{m.role}</div>
                    <div style={{ fontSize:20, fontFamily:"Georgia,serif", color:"#1a1a18", marginBottom:10 }}>{m.name}</div>
                    <p style={{ fontSize:13, color:"#3d3d3a", lineHeight:1.7, marginBottom:0 }}>{m.body}</p>
                  </div>
                );
              })}
            </div>
            <div style={{ padding:14, background:"#fdf8f7", border:"1px solid #f5c6c2", borderRadius:8, marginBottom:28, fontSize:13, fontFamily:"system-ui,sans-serif", color:"#3d3d3a", lineHeight:1.7 }}>
              <strong style={{ color:"#c0392b" }}>IP ownership: </strong>All core IP -- HEIDI framework, Virtual Fencing 2.0 (invention disclosure filed March 12, 2026), ecological manufacturing methodology, thermodynamic framework -- is owned by Hobbs Magaret and predates any co-founding discussions. Formal co-founding and IP assignment agreement: 30-day priority. Must be completed before external capital is raised.
            </div>
            <h2 style={s.h2}>Seed raise -- AUD $2.5M</h2>
            <p style={s.body}>Funds a structured proof-of-concept on a partner-owned property under equipment-only revenue-sharing. No land acquisition capital required. The POC proves the technology and generates the dataset that de-risks the acquisition model for Series A.</p>
            <div style={{ ...s.metaGrid, marginBottom:28 }}>
              {[
                { label:"Equipment fleet",       val:"AUD $1.22M", note:"4x Bobcat CTL + JD 8R tractor + autonomy kits" },
                { label:"HEIDI / TerraOS build", val:"AUD $400k",  note:"Architecture, data schema, first-season pipeline" },
                { label:"POC deployment",        val:"AUD $430k",  note:"Staffing, temp accommodation, logistics Y0-1" },
                { label:"Regulatory + legal",    val:"AUD $300k",  note:"CASA, carbon registration, IP filings, co-founding structure" },
                { label:"Contingency",           val:"AUD $150k",  note:"Approx. 10% of total program cost" },
              ].map(function(m) { return <div key={m.label} style={s.metaCell}><div style={s.metaVal}>{m.val}</div><div style={s.metaLabel}>{m.label}</div><div style={s.metaNote}>{m.note}</div></div>; })}
            </div>
            <h2 style={s.h2}>Implementation phases</h2>
            <div style={{ marginBottom:28 }}>
              {[
                { ph:"Phase 0", t:"Months 1-6",  label:"Pre-deployment", color:"#3b33a0", items:["Land access agreement -- equipment-only revenue-sharing with partner property owner","Equipment procurement: 4x Bobcat CTL (T86) + JD 8R tractor + autonomy retrofit kits","HEIDI architecture and data schema design -- foundational, cannot be deferred","CASA BVLOS application lodgement and regulatory engagement","ERF Soil Carbon project registration with Clean Energy Regulator","Team hire: 2x equipment operators, 1x data systems engineer","Temporary modular accommodation established on property"] },
                { ph:"Phase 1", t:"Months 7-12", label:"Deployment",     color:"#9a5a00", items:["Multiple treatment configurations designed across comparable sub-catchments","Earthworks deployment scheduled against 4-week forward weather window","Bobcat fleet excavates pit network (semi-autonomous, GPS-guided)","Yeomans Plow run by human operator -- standard until autonomy achieved","HEIDI ingests sensor data and begins building property world model","First wet-season infiltration response measured across all configurations"] },
                { ph:"Phase 2", t:"Year 1-3",    label:"Operations",     color:"#0a6b47", items:["Vegetation establishment monitoring -- ground cover %, biomass, species composition","SheepDog drone VF2.0 conditioning and rollout as rover infrastructure becomes available","ERF Soil Carbon baseline measurement period; first ACCU issuance target Year 2-3","Data platform builds licensable dataset; first licensing conversations","POC outcomes documented to de-risk Series A narrative"] },
                { ph:"Phase 3", t:"Year 3+",     label:"Scale",          color:"#1a1a18", items:["Second property -- acquisition model viable with proven outcome data","Fleet expansion and TerraOS multi-property intelligence from 2029","Series A capital raise against first-property demonstrated returns","Transition from equipment-only to acquisition model as primary scaling vehicle"] },
              ].map(function(ph, i, arr) {
                var br = i===0 ? "8px 8px 0 0" : i===arr.length-1 ? "0 0 8px 8px" : "0";
                return (
                  <div key={ph.ph} style={{ padding:"18px 20px", background:i%2===0?"#f9f8f5":"#fff", border:"1px solid #e8e6e0", borderTop:i>0?"none":"1px solid #e8e6e0", borderRadius:br }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <div style={{ fontFamily:"system-ui,sans-serif", fontSize:11, fontWeight:500, color:ph.color, letterSpacing:"0.06em" }}>{ph.ph} -- {ph.t}</div>
                      <div style={{ fontFamily:"Georgia,serif", fontSize:15, color:"#1a1a18" }}>{ph.label}</div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4 }}>
                      {ph.items.map(function(it) { return <div key={it} style={{ fontSize:12, fontFamily:"system-ui,sans-serif", color:"#3d3d3a", lineHeight:1.5, paddingLeft:12, position:"relative" }}><span style={{ position:"absolute", left:0, color:ph.color }}>·</span>{it}</div>; })}
                    </div>
                  </div>
                );
              })}
            </div>
            <h2 style={s.h2}>Adaptive trial methodology</h2>
            <p style={s.body}>The first property is a structured scientific experiment. Multiple treatment configurations are deployed across comparable sub-catchments to identify the optimal combination of variables for each terrain and soil class.</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              {[
                { title:"Independent variables", items:["Pit density -- pits per hectare (range: 40-80)","Crescent geometry -- orientation relative to slope","Soil type class -- texture and compaction depth","Slope class -- gradient and hillslope position","Distance from ridge or valley floor"] },
                { title:"Dependent outcomes measured", items:["Infiltration rate -- before and after each rainfall event","Vegetation response -- species, cover %, biomass","Carrying capacity -- DSE/ha at 6-month intervals","Carbon accumulation -- tCO2e/ha/yr by configuration class","Water table response -- where instrumentation permits"] },
              ].map(function(block) {
                return (
                  <div key={block.title} style={s.cardSm}>
                    <h3 style={s.h3}>{block.title}</h3>
                    {block.items.map(function(v) { return <div key={v} style={{ fontSize:13, fontFamily:"system-ui,sans-serif", color:"#3d3d3a", padding:"5px 0", borderBottom:"1px solid #f0ede5", lineHeight:1.4 }}>{v}</div>; })}
                  </div>
                );
              })}
            </div>
            <div style={{ padding:14, background:"#f0faf5", border:"1px solid #b3d9c8", borderRadius:8, marginBottom:28, fontSize:13, fontFamily:"system-ui,sans-serif", color:"#3d3d3a", lineHeight:1.7 }}>
              <strong style={{ color:"#0a6b47" }}>The leap-frog logic: </strong>Moving from projected to proven outcomes removes the ecological timeline risk premium investors currently apply. First-property data is not just proof-of-concept -- it is the dataset that makes every subsequent property cheaper, faster, and more predictable. The 4-week forward weather window rhythm drives earthworks scheduling to maximise first-season infiltration response.
            </div>
            <h2 style={s.h2}>Autonomous equipment -- the honest picture</h2>
            {[
              { label:"Bobcat CTL -- half-moon pits",        status:"Semi-autonomous, Year 0", sc:"#9a5a00", sbg:"#fffbf0", body:"The Bobcat RogueX3 unveiled at CES 2026 is a concept prototype -- not commercially available. Near-term: standard Bobcat T86 (AUD $120-150k) with GPS-guided aftermarket autonomy retrofit (estimated AUD $30-60k -- no commercial product exists). Total per-machine capital modelled at AUD $180k. Full autonomous capability is a development milestone." },
              { label:"Tractor + Yeomans Plow",              status:"Human-operated, Year 0-2", sc:"#c0392b", sbg:"#fdf0ee", body:"John Deere's autonomous tractor kit is commercially available for the 8R series but is interoperable with JD implements only. The Yeomans Plow is a third-party implement. Near-term: Yeomans Plow operations require a human operator. Development pathway: custom JD integration or independent autonomy stack. Target: autonomous operation by Year 3. Year 0-2 staffing and OpEx implications are reflected in the financial model." },
              { label:"Rover -- drone base station",         status:"Development required",     sc:"#c0392b", sbg:"#fdf0ee", body:"The rover does not yet exist as a commercial product. Until available, the drone fleet requires fixed on-property infrastructure for docking and charging. This constraint is factored into Phase 0 logistics and the seed budget. Rover development is a Year 1-2 engineering milestone." },
            ].map(function(item, i) {
              return (
                <div key={i} style={{ background:item.sbg, border:"1px solid #e8e6e0", borderRadius:8, padding:"16px 20px", marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                    <div style={{ fontFamily:"system-ui,sans-serif", fontSize:13, fontWeight:500, color:"#1a1a18" }}>{item.label}</div>
                    <span style={{ padding:"3px 10px", borderRadius:4, background:"#fff", border:"1px solid "+item.sc, color:item.sc, fontSize:11, fontFamily:"system-ui,sans-serif", fontWeight:500, whiteSpace:"nowrap" }}>{item.status}</span>
                  </div>
                  <p style={{ fontSize:13, fontFamily:"system-ui,sans-serif", color:"#3d3d3a", lineHeight:1.7, marginBottom:0 }}>{item.body}</p>
                </div>
              );
            })}
            <hr style={s.rule}/>
            <h2 style={s.h2}>Staffing -- Year 0 to 2</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[
                { role:"Hobbs Magaret -- Founder & CEO",  type:"Full-time",             note:"On-property during deployment phases. Strategy, technical architecture, operational oversight." },
                { role:"Equipment operators x 2",         type:"Full-time employees",   note:"CTL supervision and Yeomans Plow operation until autonomous integration. On-property with temporary accommodation provided." },
                { role:"Data systems engineer x 1",       type:"Full-time employee",    note:"HEIDI architecture build, sensor integration, data pipeline. Remote-first with periodic on-property visits." },
                { role:"Legal counsel",                   type:"External -- Phase 0",   note:"IP filings, co-founding structure, carbon contracts, land access agreements." },
                { role:"Carbon consultant",               type:"External",              note:"ERF methodology registration, CER engagement, MRV protocol design." },
              ].map(function(r) {
                return (
                  <div key={r.role} style={{ display:"flex", gap:14, padding:"12px 16px", background:"#fff", border:"1px solid #e8e6e0", borderRadius:8, alignItems:"flex-start" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:"system-ui,sans-serif", fontSize:13, fontWeight:500, color:"#1a1a18" }}>{r.role}</div>
                      <div style={{ fontSize:12, fontFamily:"system-ui,sans-serif", color:"#888780", marginTop:2 }}>{r.note}</div>
                    </div>
                    <span style={{ padding:"3px 10px", borderRadius:4, background:"#f9f8f5", border:"1px solid #e8e6e0", color:"#3d3d3a", fontSize:11, fontFamily:"system-ui,sans-serif", whiteSpace:"nowrap" }}>{r.type}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab==="rehydration" && (
          <div>
            <div style={s.eyebrow}>Platform capability</div>
            <h1 style={s.h1}>Landscape rehydration techniques</h1>
            <p style={{ ...s.body, fontSize:17, maxWidth:640 }}>Degraded semi-arid land fails at multiple points simultaneously. Half-moon pits and the Yeomans Plow address two specific failure modes. This catalogue maps the full range of techniques -- and where each sits in the autonomous platform, as a HEIDI-prescribed addition, or as contractor-delivered work.</p>
            <div style={{ ...s.card, background:"#f0faf5", borderColor:"#b3d9c8", marginBottom:28 }}>
              <h3 style={{ ...s.h3, color:"#0a6b47", marginBottom:12 }}>Water cycle failure map</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[
                  { mode:"Sheet flow runoff on slopes",                zone:"Slope face",        tech:"Half-moon pits, contour bunds, swales" },
                  { mode:"Hardpan preventing deep infiltration",       zone:"Soil profile",      tech:"Yeomans Plow, deep ripping" },
                  { mode:"Concentrated flow eroding drainage lines",  zone:"Drainage lines",    tech:"Check dams, leaky weirs, brush packing" },
                  { mode:"Bare soil sealing on rainfall impact",       zone:"Surface",           tech:"Mulching, biochar, targeted seeding" },
                  { mode:"Floodout dispersal failure",                 zone:"Valley floors",     tech:"Floodout earthworks, contour banks" },
                  { mode:"Riparian degradation",                       zone:"Watercourses",      tech:"Rock and log structures, riparian planting" },
                ].map(function(r) {
                  return (
                    <div key={r.mode} style={{ background:"#fff", border:"1px solid #e8e6e0", borderRadius:6, padding:"12px 14px" }}>
                      <div style={{ fontSize:12, fontFamily:"system-ui,sans-serif", fontWeight:500, color:"#1a1a18", marginBottom:3 }}>{r.mode}</div>
                      <div style={{ fontSize:11, fontFamily:"system-ui,sans-serif", color:"#0a6b47", marginBottom:3 }}>{r.zone}</div>
                      <div style={{ fontSize:11, fontFamily:"system-ui,sans-serif", color:"#888780" }}>{r.tech}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <h2 style={s.h2}>Field diagrams</h2>
            <p style={{ ...s.body, marginBottom:12 }}>The core earthworks techniques and the infiltration mechanism they produce. Click any card to open.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:32 }}>
              {DIAGRAMS.filter(function(d) { return d.id !== "sheepdog"; }).map(function(d) {
                return (
                  <div key={d.id} onClick={function() { setActiveDiagram(d); }} style={{ background:"#fff", border:"1px solid #e8e6e0", borderRadius:8, padding:"20px 24px", cursor:"pointer", display:"flex", alignItems:"center", gap:16 }} onMouseEnter={function(e) { e.currentTarget.style.borderColor=d.color; }} onMouseLeave={function(e) { e.currentTarget.style.borderColor="#e8e6e0"; }}>
                    <div style={{ width:40, height:40, borderRadius:8, background:d.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="16" height="16" rx="3" stroke="#fff" strokeWidth="1.5"/><path d="M6 10h8M10 6v8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:"system-ui,sans-serif", fontSize:14, fontWeight:500, color:"#1a1a18", marginBottom:2 }}>{d.title}</div>
                      <div style={{ fontSize:13, color:"#888780", lineHeight:1.5 }}>{d.desc}</div>
                    </div>
                    <div style={{ fontFamily:"system-ui,sans-serif", fontSize:12, color:d.color, fontWeight:500, whiteSpace:"nowrap" }}>Open</div>
                  </div>
                );
              })}
            </div>
            <h2 style={s.h2}>Technique catalogue</h2>
            <p style={{ ...s.body, marginBottom:20 }}>Click any technique to expand.</p>
            {LAYERS_OPS.map(function(t) {
              var tl = t.tier===1 ? "Tier 1 -- Core autonomous platform" : t.tier===2 ? "Tier 2 -- HEIDI-prescribed addition" : "Tier 3 -- Manual / contractor";
              var tc2 = t.tier===1 ? "#0a6b47" : t.tier===2 ? "#9a5a00" : "#3b33a0";
              var tbg = t.tier===1 ? "#f0faf5" : t.tier===2 ? "#fffbf0" : "#f5f4ff";
              return <TechCard key={t.n} t={t} tierLabel={tl} tierColor={tc2} tierBg={tbg}/>;
            })}
            <hr style={s.rule}/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
              {[
                { tier:"Tier 1", label:"Integrate now",           color:"#0a6b47", bg:"#f0faf5", border:"#b3d9c8", items:["Swales","Drone seeding","Floodout earthworks"] },
                { tier:"Tier 2", label:"HEIDI-prescribed",        color:"#9a5a00", bg:"#fffbf0", border:"#f0d9b3", items:["Contour bunds","Deep ripping","Biochar application"] },
                { tier:"Tier 3", label:"Manual / contractor",     color:"#3b33a0", bg:"#f5f4ff", border:"#c5c2f0", items:["Check dams + leaky weirs","Brush packing + log dams","Zai pits","Mulching"] },
              ].map(function(t) {
                return (
                  <div key={t.tier} style={{ background:t.bg, border:"1px solid "+t.border, borderRadius:8, padding:16 }}>
                    <div style={{ fontSize:11, fontFamily:"system-ui,sans-serif", fontWeight:500, color:t.color, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:2 }}>{t.tier}</div>
                    <div style={{ fontSize:13, fontFamily:"system-ui,sans-serif", fontWeight:500, color:"#1a1a18", marginBottom:10, paddingBottom:8, borderBottom:"1px solid "+t.border }}>{t.label}</div>
                    {t.items.map(function(it) { return <div key={it} style={{ fontSize:13, fontFamily:"system-ui,sans-serif", color:"#3d3d3a", padding:"4px 0", borderBottom:"1px solid "+t.border+"80" }}>{it}</div>; })}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab==="land" && (
          <div>
            <div style={s.eyebrow}>Acquisition strategy</div>
            <h1 style={s.h1}>Near-zero cost access to Australia's most degraded land</h1>
            <blockquote style={s.quote}>"Acquire the right to operate on the most degraded land in Australia at near-zero cost, then get paid to let it recover."</blockquote>
            <p style={s.body}>Australia has tens of millions of hectares of degraded, abandoned, or government-held former pastoral land that is effectively worthless as a cattle operation -- but potentially highly valuable as a platform for stacked environmental markets. The worse the land, the stronger the additionality argument.</p>
            {[
              { n:"01", label:"WA Diversification Leases",    sub:"Unallocated Crown Land",        color:"#c4420a", lbg:"#fff5f0", body:"Western Australia's Diversification Lease covers 25 pastoral leases not renewed in 2015, which reverted to Unallocated Crown Land. No public tender required -- private treaty direct to the Minister for Lands. Permitted uses include carbon farming, conservation, renewable energy, and grazing. On genuinely degraded land with no competing bidders, rent could be nominal.", tags:["Private treaty only","No competitive tender","Carbon + grazing permitted"] },
              { n:"02", label:"DPaW/DBCA Co-management",     sub:"5M+ ha former pastoral land",   color:"#9a5a00", lbg:"#fffbf0", body:"WA's Department of Biodiversity holds over 5 million hectares of degraded former pastoral land -- many reserves never formally gazetted due to unresolved Native Title. TerraForm registers carbon and biodiversity projects on these reserves and splits ACCU revenue with the Crown. Government gets active land management for free. TerraForm gets access to millions of hectares at no acquisition cost.", tags:["No acquisition cost","Revenue share model","Government partnership"] },
              { n:"03", label:"SA Pastoral Board",           sub:"Surrendered and cancelled leases",color:"#0a6b47", lbg:"#f0faf5", body:"South Australia's Pastoral Board cancels abandoned leases, which revert to Crown pastoral land. Lease rents are set on a per-beast-area formula -- if the beast area is near zero due to degradation, so is the rent. Carbon and conservation explicitly permitted under 2024 SA Pastoral Act amendments.", tags:["Near-zero rent","2024 Act amendments","Carbon explicitly permitted"] },
              { n:"04", label:"NT Aboriginal Land Trust JVs",sub:"Strongest additionality argument",color:"#3b33a0", lbg:"#f5f4ff", body:"The most degraded cattle stations in Central Australia were sold to Aboriginal Land Trusts because they were flogged out with worn infrastructure. TerraForm structures as a joint venture: Traditional Owner group provides freehold access, TerraForm provides capital, project management, and market access. Freehold -- no government approval required.", tags:["Aboriginal freehold","Joint venture structure","No Native Title complexity"] },
            ].map(function(opt) {
              return (
                <div key={opt.n} style={{ ...s.card, borderLeft:"3px solid "+opt.color, marginBottom:16 }}>
                  <div style={{ display:"flex", gap:14, marginBottom:12, alignItems:"flex-start" }}>
                    <div style={{ fontSize:24, fontFamily:"Georgia,serif", color:opt.color, lineHeight:1, minWidth:32 }}>{opt.n}</div>
                    <div><div style={s.h3}>{opt.label}</div><div style={{ fontSize:13, fontFamily:"system-ui,sans-serif", color:"#888780" }}>{opt.sub}</div></div>
                  </div>
                  <p style={{ ...s.body, marginBottom:12, fontSize:15 }}>{opt.body}</p>
                  <div>{opt.tags.map(function(t) { return <span key={t} style={s.pill(opt.color)}>{t}</span>; })}</div>
                </div>
              );
            })}
            <div style={{ ...s.card, background:"#f0faf5", borderColor:"#b3d9c8" }}>
              <h3 style={{ ...s.h3, color:"#0a6b47", marginBottom:8 }}>Stacked environmental markets</h3>
              <p style={{ ...s.body, marginBottom:16, fontSize:15 }}>A single degraded property can simultaneously generate soil carbon ACCUs and Nature Repair Market biodiversity certificates. Legally confirmed -- one parcel, multiple income streams, no additional land required.</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {["Soil carbon ACCUs","Nature Repair certificates","Biodiversity rangelands","IFLM (if available)"].map(function(m) { return <span key={m} style={s.pill("#0a6b47")}>{m}</span>; })}
              </div>
            </div>
          </div>
        )}

        {tab==="financials" && (
          <div>
            <div style={s.eyebrow}>Financial model</div>
            <h1 style={s.h1}>Scenario modeller -- AUD, 5,000ha POC property</h1>
            <p style={s.body}>Toggle between acquisition model and equipment-only POC. Select best, base, or floor scenario. All figures in AUD. Carbon modelled on ERF Soil Carbon method -- Year 1 revenue is zero in all scenarios.</p>
            <div style={s.card}><FinChart/></div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
              <div style={s.cardSm}>
                <h3 style={s.h3}>Base case key metrics</h3>
                {[
                  { label:"Total CapEx (Year 0)",      val:"~AUD $3.5M",   sub:"Land + earthworks + fleet + HEIDI build" },
                  { label:"Carbon first issuance",     val:"Year 3",       sub:"ERF Soil Carbon -- 0.8 tCO2e/ha/yr at AUD $35/t" },
                  { label:"Data revenue onset",        val:"Year 2",       sub:"Growing to AUD $6/ha/yr by Year 10" },
                  { label:"Cattle onset",              val:"Year 5",       sub:"Growing to AUD $24/ha/yr by Year 10" },
                  { label:"Land arbitrage delta",      val:"$7,600/ha",    sub:"AUD $400 acquisition to $8,000 exit" },
                  { label:"Year 10 total return",      val:"~AUD $20M+",   sub:"With land exit -- base case acquisition model" },
                ].map(function(row) {
                  return (
                    <div key={row.label} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:"1px solid #f0ede5", alignItems:"center" }}>
                      <div>
                        <div style={{ fontSize:13, fontFamily:"system-ui,sans-serif", color:"#3d3d3a" }}>{row.label}</div>
                        <div style={{ fontSize:11, fontFamily:"system-ui,sans-serif", color:"#888780" }}>{row.sub}</div>
                      </div>
                      <div style={{ fontFamily:"system-ui,sans-serif", fontSize:15, fontWeight:"bold", color:"#1a1a18" }}>{row.val}</div>
                    </div>
                  );
                })}
              </div>
              <div>
                <div style={{ ...s.cardSm, marginBottom:12 }}>
                  <h3 style={s.h3}>Equipment-only model (POC)</h3>
                  <p style={{ ...s.body, fontSize:13, marginBottom:8 }}>CapEx = fleet only. No land on the balance sheet. Revenue share ~35% of livestock + carbon + data. No land appreciation -- faster and lower-risk path to first deployment. Proof-of-concept vehicle before acquisition model at scale.</p>
                  <p style={{ ...s.body, fontSize:13, marginBottom:0 }}>Carbon revenue from Year 2-3 offsets holding costs. The POC period is not a dead capital period.</p>
                </div>
                <div style={{ ...s.cardSm, background:"#f0faf5", borderColor:"#b3d9c8", textAlign:"center", padding:28 }}>
                  <div style={{ fontSize:11, fontFamily:"system-ui,sans-serif", color:"#0a6b47", fontWeight:500, marginBottom:8, letterSpacing:"0.06em", textTransform:"uppercase" }}>The land arbitrage</div>
                  <div style={{ fontSize:28, fontFamily:"Georgia,serif", color:"#1a1a18", marginBottom:4 }}>$400 to $8,000/ha</div>
                  <div style={{ fontSize:13, fontFamily:"system-ui,sans-serif", color:"#888780" }}>Base case. Structural gap. Manufactured by TerraForm.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab==="risks" && (
          <div>
            <div style={s.eyebrow}>Risk register</div>
            <h1 style={s.h1}>The honest risks</h1>
            <p style={s.body}>The most dangerous risk is not the most dramatic. A mispriced acquisition is fatal and silent -- it never announces itself as a failure until capital is already deployed and the spread is permanently impaired.</p>
            <RiskTable/>
            <div style={{ ...s.card, borderLeft:"3px solid #c0392b", marginTop:28, background:"#fdf8f7" }}>
              <h3 style={{ ...s.h3, color:"#c0392b", marginBottom:10 }}>The replication risk -- the only existential one</h3>
              <p style={{ ...s.body, marginBottom:0, fontSize:15 }}>The earthworks technique is documented in the literature. A well-capitalised competitor could deploy autonomous earthworks on degraded land. The moat is not the technique -- it is HEIDI's accumulated data, the operational playbook refined across multiple property cycles, and years of longitudinal data a new entrant cannot purchase or accelerate. The only defence is speed: build data platform depth before a competitor reaches meaningful scale.</p>
            </div>
          </div>
        )}

        {tab==="horizon" && (
          <div>
            <div style={s.eyebrow}>The long game</div>
            <h1 style={s.h1}>Earth is the laboratory.<br/>The frontier is beyond it.</h1>
            <p style={{ ...s.body, fontSize:17, maxWidth:640 }}>Every system TerraForm Earth builds to restore a broken water cycle on degraded Australian land is, in its deepest logic, a system for making barren worlds habitable. The work is not metaphorically related to terraforming. It is terraforming -- at the scale and in the conditions where the science can actually be validated.</p>
            <blockquote style={s.quote}>"The desert is not the problem. The desert is the laboratory. And the laboratory is the proof of concept for every world that has ever been written off as dead."</blockquote>
            <hr style={s.rule}/>
            <h2 style={s.h2}>Why degraded arid land is the right proving ground</h2>
            <p style={s.body}>Semi-arid degraded land in Australia shares more with the Martian surface than it does with a productive farm. Compacted, biologically inert regolith. No effective water cycle. Extreme temperature differentials. Minimal organic matter. A hardpan layer that prevents infiltration just as Martian permafrost prevents it there.</p>
            <p style={s.body}>This is why the proof-of-concept property matters far beyond its financial return. Every season of operational data is a data point in a much longer experiment: what does it take to turn a lifeless substrate into a productive biological system, using only what the environment provides?</p>
            <div style={{ ...s.metaGrid, marginBottom:28 }}>
              {[
                { label:"Australian arid", val:"~250mm/yr", note:"Rainfall -- available but unretained", c:"#9a5a00" },
                { label:"Lunar south pole", val:"Ice deposits", note:"Water present -- locked in regolith", c:"#3b33a0" },
                { label:"Martian surface", val:"~10-50mm/yr", note:"Water equivalent -- frozen and diffuse", c:"#c4420a" },
              ].map(function(m) {
                return (
                  <div key={m.label} style={s.metaCell}>
                    <div style={{ fontSize:11, fontFamily:"system-ui,sans-serif", color:m.c, fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:4 }}>{m.label}</div>
                    <div style={s.metaVal}>{m.val}</div>
                    <div style={s.metaNote}>{m.note}</div>
                  </div>
                );
              })}
            </div>
            <h2 style={s.h2}>What transfers directly</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:28 }}>
              {[
                { from:"HEIDI -- Earth property intelligence",         to:"Planetary management AI for closed-loop biosphere systems",    color:"#3b33a0" },
                { from:"SheepDog drones -- autonomous mob management",   to:"Surface survey, regolith sampling, habitat perimeter",          color:"#9a5a00" },
                { from:"Earthworks -- GPS-guided water interception",  to:"Regolith modification for ice extraction and water routing",    color:"#0a6b47" },
                { from:"Ecological manufacturing -- biological succession", to:"Soil engineering: introducing biology to inert substrate", color:"#c4420a" },
                { from:"Carbon MRV -- atmospheric and soil measurement", to:"Atmospheric composition monitoring, terraforming progress tracking", color:"#1155a0" },
              ].map(function(row, i) {
                return (
                  <div key={i} style={{ display:"flex", gap:0, alignItems:"stretch", borderRadius:8, overflow:"hidden", border:"1px solid #e8e6e0" }}>
                    <div style={{ flex:1, padding:"14px 16px", background:"#fff", fontSize:13, fontFamily:"system-ui,sans-serif", color:"#3d3d3a", lineHeight:1.5, borderRight:"1px solid #e8e6e0" }}>
                      <span style={{ display:"block", fontSize:11, color:"#888780", marginBottom:3, fontWeight:500, letterSpacing:"0.04em" }}>ON EARTH</span>{row.from}
                    </div>
                    <div style={{ width:32, display:"flex", alignItems:"center", justifyContent:"center", background:"#f9f8f5", fontSize:14, color:"#b4b2a9", flexShrink:0 }}>→</div>
                    <div style={{ flex:1, padding:"14px 16px", background:row.color+"0a", fontSize:13, fontFamily:"system-ui,sans-serif", color:"#3d3d3a", lineHeight:1.5 }}>
                      <span style={{ display:"block", fontSize:11, color:row.color, marginBottom:3, fontWeight:500, letterSpacing:"0.04em" }}>BEYOND EARTH</span>{row.to}
                    </div>
                  </div>
                );
              })}
            </div>
            <hr style={s.rule}/>
            <h2 style={s.h2}>The deeper argument for investors</h2>
            <p style={s.body}>Governments and space agencies are spending billions to solve problems that TerraForm Earth is solving on a commercial basis, in real conditions, with real accountability. The question of who builds the knowledge base for planetary-scale terraforming is open. It will be answered by an operator who has spent twenty years learning how broken substrates respond to precise physical interventions -- and who has the data to prove it.</p>
            <blockquote style={s.quote}>"Every property we restore is a chapter in a manual that does not yet exist. The manual for making worlds."</blockquote>
            <div style={{ ...s.card, background:"#f5f4ff", borderColor:"#c5c2f0" }}>
              <h3 style={{ ...s.h3, color:"#3b33a0", marginBottom:10 }}>The name was never a metaphor</h3>
              <p style={{ ...s.body, marginBottom:0, fontSize:15 }}>TerraForm Earth. To shape the Earth. The name was chosen because the work is literal -- reshaping land, restructuring water cycles, manufacturing ecological function where none visibly exists. But the word terraform entered the language as a vision for other worlds. The company sits at the intersection of both meanings. That is not an accident. It is the thesis.</p>
            </div>
          </div>
        )}

        {tab==="chat" && (
          <div>
            <div style={s.eyebrow}>Interactive</div>
            <h1 style={s.h1}>Talk to the business plan</h1>
            <p style={s.body}>Ask anything about TerraForm Earth -- the model, the technology, the risks, the financials, the operations. This AI has complete knowledge of the plan.</p>
            <Chat/>
          </div>
        )}

      </div>
    </div>
  );
}
