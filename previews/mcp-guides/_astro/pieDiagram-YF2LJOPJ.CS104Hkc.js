import{p as N}from"./chunk-TMUBEWPD.CE349lqG.js";import{g as B,s as U,a as K,b as V,n as Z,o as j,_ as i,l as C,c as q,C as H,G as J,I as Q,K as z,e as X,v as Y,L as ee,D as te}from"./mermaid.core.G0e6CLe9.js";import{p as ae}from"./gitGraph-YCYPL57B.Bt9r6V19.js";import{o as re}from"./d3-scale.CFd6unT_.js";import"./preload-helper.B8ldop5L.js";import"./min.vND8ut6j.js";import"./_baseUniq.lk5BnRsv.js";var ie=te.pie,D={sections:new Map,showData:!1},h=D.sections,w=D.showData,se=structuredClone(ie),oe=i(()=>structuredClone(se),"getConfig"),ne=i(()=>{h=new Map,w=D.showData,Y()},"clear"),le=i(({label:e,value:t})=>{h.has(e)||(h.set(e,t),C.debug(`added new section: ${e}, with value: ${t}`))},"addSection"),ce=i(()=>h,"getSections"),de=i(e=>{w=e},"setShowData"),pe=i(()=>w,"getShowData"),G={getConfig:oe,clear:ne,setDiagramTitle:j,getDiagramTitle:Z,setAccTitle:V,getAccTitle:K,setAccDescription:U,getAccDescription:B,addSection:le,getSections:ce,setShowData:de,getShowData:pe},ge=i((e,t)=>{N(e,t),t.setShowData(e.showData),e.sections.map(t.addSection)},"populateDb"),ue={parse:i(async e=>{const t=await ae("pie",e);C.debug(t),ge(t,G)},"parse")},fe=i(e=>`
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
`,"getStyles"),he=fe,me=i(e=>{const t=[...e.entries()].map(s=>({label:s[0],value:s[1]})).sort((s,n)=>n.value-s.value);return ee().value(s=>s.value)(t)},"createPieArcs"),ve=i((e,t,F,s)=>{C.debug(`rendering pie chart
`+e);const n=s.db,$=q(),y=H(n.getConfig(),$.pie),T=40,o=18,p=4,c=450,m=c,v=J(t),l=v.append("g");l.attr("transform","translate("+m/2+","+c/2+")");const{themeVariables:a}=$;let[A]=Q(a.pieOuterStrokeWidth);A??=2;const _=y.textPosition,g=Math.min(m,c)/2-T,W=z().innerRadius(0).outerRadius(g),I=z().innerRadius(g*_).outerRadius(g*_);l.append("circle").attr("cx",0).attr("cy",0).attr("r",g+A/2).attr("class","pieOuterCircle");const b=n.getSections(),S=me(b),L=[a.pie1,a.pie2,a.pie3,a.pie4,a.pie5,a.pie6,a.pie7,a.pie8,a.pie9,a.pie10,a.pie11,a.pie12],d=re(L);l.selectAll("mySlices").data(S).enter().append("path").attr("d",W).attr("fill",r=>d(r.data.label)).attr("class","pieCircle");let E=0;b.forEach(r=>{E+=r}),l.selectAll("mySlices").data(S).enter().append("text").text(r=>(r.data.value/E*100).toFixed(0)+"%").attr("transform",r=>"translate("+I.centroid(r)+")").style("text-anchor","middle").attr("class","slice"),l.append("text").text(n.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const x=l.selectAll(".legend").data(d.domain()).enter().append("g").attr("class","legend").attr("transform",(r,u)=>{const f=o+p,O=f*d.domain().length/2,P=12*o,R=u*f-O;return"translate("+P+","+R+")"});x.append("rect").attr("width",o).attr("height",o).style("fill",d).style("stroke",d),x.data(S).append("text").attr("x",o+p).attr("y",o-p).text(r=>{const{label:u,value:f}=r.data;return n.getShowData()?`${u} [${f}]`:u});const M=Math.max(...x.selectAll("text").nodes().map(r=>r?.getBoundingClientRect().width??0)),k=m+T+o+p+M;v.attr("viewBox",`0 0 ${k} ${c}`),X(v,c,k,y.useMaxWidth)},"draw"),Se={draw:ve},Ae={parser:ue,db:G,renderer:Se,styles:he};export{Ae as diagram};
