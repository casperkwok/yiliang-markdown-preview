import{p as N}from"./chunk-353BL4L5-BpnRVjVT.js";import{a as i,g as B,s as U,b as Q,c as V,v as Z,t as j,l as C,d as q,G as H,L as J,N as K,O as z,P as X,f as Y,A as ee,Q as te,I as ae}from"./diagram-math-kerwj6V3.js";import{p as re}from"./treemap-6Y5VK53G-C6ztfbxX.js";import"./react-vendor-CwmUxUDx.js";import"./milkdown-Bq6YiaW2.js";import"./_baseUniq-CufGf3BB.js";import"./_basePickBy-DkvrKdwc.js";import"./clone-C4B-P3cH.js";var ie=ae.pie,D={sections:new Map,showData:!1},h=D.sections,w=D.showData,se=structuredClone(ie),oe=i(()=>structuredClone(se),"getConfig"),ne=i(()=>{h=new Map,w=D.showData,ee()},"clear"),le=i(({label:e,value:t})=>{h.has(e)||(h.set(e,t),C.debug(`added new section: ${e}, with value: ${t}`))},"addSection"),ce=i(()=>h,"getSections"),de=i(e=>{w=e},"setShowData"),pe=i(()=>w,"getShowData"),G={getConfig:oe,clear:ne,setDiagramTitle:j,getDiagramTitle:Z,setAccTitle:V,getAccTitle:Q,setAccDescription:U,getAccDescription:B,addSection:le,getSections:ce,setShowData:de,getShowData:pe},ge=i((e,t)=>{N(e,t),t.setShowData(e.showData),e.sections.map(t.addSection)},"populateDb"),ue={parse:i(async e=>{const t=await re("pie",e);C.debug(t),ge(t,G)},"parse")},fe=i(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,"getStyles"),he=fe,me=i(e=>{const t=[...e.entries()].map(s=>({label:s[0],value:s[1]})).sort((s,n)=>n.value-s.value);return te().value(s=>s.value)(t)},"createPieArcs"),ve=i((e,t,F,s)=>{C.debug(`rendering pie chart
`+e);const n=s.db,y=q(),T=H(n.getConfig(),y.pie),$=40,o=18,p=4,c=450,m=c,v=J(t),l=v.append("g");l.attr("transform","translate("+m/2+","+c/2+")");const{themeVariables:a}=y;let[A]=K(a.pieOuterStrokeWidth);A??=2;const _=T.textPosition,g=Math.min(m,c)/2-$,O=z().innerRadius(0).outerRadius(g),P=z().innerRadius(g*_).outerRadius(g*_);l.append("circle").attr("cx",0).attr("cy",0).attr("r",g+A/2).attr("class","pieOuterCircle");const b=n.getSections(),S=me(b),W=[a.pie1,a.pie2,a.pie3,a.pie4,a.pie5,a.pie6,a.pie7,a.pie8,a.pie9,a.pie10,a.pie11,a.pie12],d=X(W);l.selectAll("mySlices").data(S).enter().append("path").attr("d",O).attr("fill",r=>d(r.data.label)).attr("class","pieCircle");let E=0;b.forEach(r=>{E+=r}),l.selectAll("mySlices").data(S).enter().append("text").text(r=>(r.data.value/E*100).toFixed(0)+"%").attr("transform",r=>"translate("+P.centroid(r)+")").style("text-anchor","middle").attr("class","slice"),l.append("text").text(n.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const x=l.selectAll(".legend").data(d.domain()).enter().append("g").attr("class","legend").attr("transform",(r,u)=>{const f=o+p,L=f*d.domain().length/2,M=12*o,R=u*f-L;return"translate("+M+","+R+")"});x.append("rect").attr("width",o).attr("height",o).style("fill",d).style("stroke",d),x.data(S).append("text").attr("x",o+p).attr("y",o-p).text(r=>{const{label:u,value:f}=r.data;return n.getShowData()?`${u} [${f}]`:u});const I=Math.max(...x.selectAll("text").nodes().map(r=>r?.getBoundingClientRect().width??0)),k=m+$+o+p+I;v.attr("viewBox",`0 0 ${k} ${c}`),Y(v,c,k,T.useMaxWidth)},"draw"),Se={draw:ve},_e={parser:ue,db:G,renderer:Se,styles:he};export{_e as diagram};
