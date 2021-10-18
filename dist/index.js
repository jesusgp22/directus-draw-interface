import{resolveComponent as t,openBlock as e,createElementBlock as i,createElementVNode as n,normalizeClass as s,createCommentVNode as o,createBlock as r,withCtx as a,createTextVNode as h,toDisplayString as c,createVNode as l}from"vue";
/*!
 * Signature Pad v3.0.0-beta.4 | https://github.com/szimek/signature_pad
 * (c) 2020 Szymon Nowak | Released under the MIT license
 */class d{constructor(t,e,i){this.x=t,this.y=e,this.time=i||Date.now()}distanceTo(t){return Math.sqrt(Math.pow(this.x-t.x,2)+Math.pow(this.y-t.y,2))}equals(t){return this.x===t.x&&this.y===t.y&&this.time===t.time}velocityFrom(t){return this.time!==t.time?this.distanceTo(t)/(this.time-t.time):0}}class u{constructor(t,e,i,n,s,o){this.startPoint=t,this.control2=e,this.control1=i,this.endPoint=n,this.startWidth=s,this.endWidth=o}static fromPoints(t,e){const i=this.calculateControlPoints(t[0],t[1],t[2]).c2,n=this.calculateControlPoints(t[1],t[2],t[3]).c1;return new u(t[1],i,n,t[2],e.start,e.end)}static calculateControlPoints(t,e,i){const n=t.x-e.x,s=t.y-e.y,o=e.x-i.x,r=e.y-i.y,a=(t.x+e.x)/2,h=(t.y+e.y)/2,c=(e.x+i.x)/2,l=(e.y+i.y)/2,u=Math.sqrt(n*n+s*s),m=Math.sqrt(o*o+r*r),v=m/(u+m),p=c+(a-c)*v,f=l+(h-l)*v,g=e.x-p,_=e.y-f;return{c1:new d(a+g,h+_),c2:new d(c+g,l+_)}}length(){let t,e,i=0;for(let n=0;n<=10;n+=1){const s=n/10,o=this.point(s,this.startPoint.x,this.control1.x,this.control2.x,this.endPoint.x),r=this.point(s,this.startPoint.y,this.control1.y,this.control2.y,this.endPoint.y);if(n>0){const n=o-t,s=r-e;i+=Math.sqrt(n*n+s*s)}t=o,e=r}return i}point(t,e,i,n,s){return e*(1-t)*(1-t)*(1-t)+3*i*(1-t)*(1-t)*t+3*n*(1-t)*t*t+s*t*t*t}}class m{constructor(t,e={}){this.canvas=t,this.options=e,this._handleMouseDown=t=>{1===t.which&&(this._mouseButtonDown=!0,this._strokeBegin(t))},this._handleMouseMove=t=>{this._mouseButtonDown&&this._strokeMoveUpdate(t)},this._handleMouseUp=t=>{1===t.which&&this._mouseButtonDown&&(this._mouseButtonDown=!1,this._strokeEnd(t))},this._handleTouchStart=t=>{if(t.preventDefault(),1===t.targetTouches.length){const e=t.changedTouches[0];this._strokeBegin(e)}},this._handleTouchMove=t=>{t.preventDefault();const e=t.targetTouches[0];this._strokeMoveUpdate(e)},this._handleTouchEnd=t=>{if(t.target===this.canvas){t.preventDefault();const e=t.changedTouches[0];this._strokeEnd(e)}},this.velocityFilterWeight=e.velocityFilterWeight||.7,this.minWidth=e.minWidth||.5,this.maxWidth=e.maxWidth||2.5,this.throttle="throttle"in e?e.throttle:16,this.minDistance="minDistance"in e?e.minDistance:5,this.dotSize=e.dotSize||function(){return(this.minWidth+this.maxWidth)/2},this.penColor=e.penColor||"black",this.backgroundColor=e.backgroundColor||"rgba(0,0,0,0)",this.onBegin=e.onBegin,this.onEnd=e.onEnd,this._strokeMoveUpdate=this.throttle?function(t,e=250){let i,n,s,o=0,r=null;const a=()=>{o=Date.now(),r=null,i=t.apply(n,s),r||(n=null,s=[])};return function(...h){const c=Date.now(),l=e-(c-o);return n=this,s=h,l<=0||l>e?(r&&(clearTimeout(r),r=null),o=c,i=t.apply(n,s),r||(n=null,s=[])):r||(r=window.setTimeout(a,l)),i}}(m.prototype._strokeUpdate,this.throttle):m.prototype._strokeUpdate,this._ctx=t.getContext("2d"),this.clear(),this.on()}clear(){const{_ctx:t,canvas:e}=this;t.fillStyle=this.backgroundColor,t.clearRect(0,0,e.width,e.height),t.fillRect(0,0,e.width,e.height),this._data=[],this._reset(),this._isEmpty=!0}fromDataURL(t,e={},i){const n=new Image,s=e.ratio||window.devicePixelRatio||1,o=e.width||this.canvas.width/s,r=e.height||this.canvas.height/s;this._reset(),n.onload=()=>{this._ctx.drawImage(n,0,0,o,r),i&&i()},n.onerror=t=>{i&&i(t)},n.src=t,this._isEmpty=!1}toDataURL(t="image/png",e){switch(t){case"image/svg+xml":return this._toSVG();default:return this.canvas.toDataURL(t,e)}}on(){this.canvas.style.touchAction="none",this.canvas.style.msTouchAction="none",window.PointerEvent?this._handlePointerEvents():(this._handleMouseEvents(),"ontouchstart"in window&&this._handleTouchEvents())}off(){this.canvas.style.touchAction="auto",this.canvas.style.msTouchAction="auto",this.canvas.removeEventListener("pointerdown",this._handleMouseDown),this.canvas.removeEventListener("pointermove",this._handleMouseMove),document.removeEventListener("pointerup",this._handleMouseUp),this.canvas.removeEventListener("mousedown",this._handleMouseDown),this.canvas.removeEventListener("mousemove",this._handleMouseMove),document.removeEventListener("mouseup",this._handleMouseUp),this.canvas.removeEventListener("touchstart",this._handleTouchStart),this.canvas.removeEventListener("touchmove",this._handleTouchMove),this.canvas.removeEventListener("touchend",this._handleTouchEnd)}isEmpty(){return this._isEmpty}fromData(t){this.clear(),this._fromData(t,(({color:t,curve:e})=>this._drawCurve({color:t,curve:e})),(({color:t,point:e})=>this._drawDot({color:t,point:e}))),this._data=t}toData(){return this._data}_strokeBegin(t){const e={color:this.penColor,points:[]};"function"==typeof this.onBegin&&this.onBegin(t),this._data.push(e),this._reset(),this._strokeUpdate(t)}_strokeUpdate(t){if(0===this._data.length)return void this._strokeBegin(t);const e=t.clientX,i=t.clientY,n=this._createPoint(e,i),s=this._data[this._data.length-1],o=s.points,r=o.length>0&&o[o.length-1],a=!!r&&n.distanceTo(r)<=this.minDistance,h=s.color;if(!r||!r||!a){const t=this._addPoint(n);r?t&&this._drawCurve({color:h,curve:t}):this._drawDot({color:h,point:n}),o.push({time:n.time,x:n.x,y:n.y})}}_strokeEnd(t){this._strokeUpdate(t),"function"==typeof this.onEnd&&this.onEnd(t)}_handlePointerEvents(){this._mouseButtonDown=!1,this.canvas.addEventListener("pointerdown",this._handleMouseDown),this.canvas.addEventListener("pointermove",this._handleMouseMove),document.addEventListener("pointerup",this._handleMouseUp)}_handleMouseEvents(){this._mouseButtonDown=!1,this.canvas.addEventListener("mousedown",this._handleMouseDown),this.canvas.addEventListener("mousemove",this._handleMouseMove),document.addEventListener("mouseup",this._handleMouseUp)}_handleTouchEvents(){this.canvas.addEventListener("touchstart",this._handleTouchStart),this.canvas.addEventListener("touchmove",this._handleTouchMove),this.canvas.addEventListener("touchend",this._handleTouchEnd)}_reset(){this._lastPoints=[],this._lastVelocity=0,this._lastWidth=(this.minWidth+this.maxWidth)/2,this._ctx.fillStyle=this.penColor}_createPoint(t,e){const i=this.canvas.getBoundingClientRect();return new d(t-i.left,e-i.top,(new Date).getTime())}_addPoint(t){const{_lastPoints:e}=this;if(e.push(t),e.length>2){3===e.length&&e.unshift(e[0]);const t=this._calculateCurveWidths(e[1],e[2]),i=u.fromPoints(e,t);return e.shift(),i}return null}_calculateCurveWidths(t,e){const i=this.velocityFilterWeight*e.velocityFrom(t)+(1-this.velocityFilterWeight)*this._lastVelocity,n=this._strokeWidth(i),s={end:n,start:this._lastWidth};return this._lastVelocity=i,this._lastWidth=n,s}_strokeWidth(t){return Math.max(this.maxWidth/(t+1),this.minWidth)}_drawCurveSegment(t,e,i){const n=this._ctx;n.moveTo(t,e),n.arc(t,e,i,0,2*Math.PI,!1),this._isEmpty=!1}_drawCurve({color:t,curve:e}){const i=this._ctx,n=e.endWidth-e.startWidth,s=2*Math.floor(e.length());i.beginPath(),i.fillStyle=t;for(let t=0;t<s;t+=1){const i=t/s,o=i*i,r=o*i,a=1-i,h=a*a,c=h*a;let l=c*e.startPoint.x;l+=3*h*i*e.control1.x,l+=3*a*o*e.control2.x,l+=r*e.endPoint.x;let d=c*e.startPoint.y;d+=3*h*i*e.control1.y,d+=3*a*o*e.control2.y,d+=r*e.endPoint.y;const u=Math.min(e.startWidth+r*n,this.maxWidth);this._drawCurveSegment(l,d,u)}i.closePath(),i.fill()}_drawDot({color:t,point:e}){const i=this._ctx,n="function"==typeof this.dotSize?this.dotSize():this.dotSize;i.beginPath(),this._drawCurveSegment(e.x,e.y,n),i.closePath(),i.fillStyle=t,i.fill()}_fromData(t,e,i){for(const n of t){const{color:t,points:s}=n;if(s.length>1)for(let i=0;i<s.length;i+=1){const n=s[i],o=new d(n.x,n.y,n.time);this.penColor=t,0===i&&this._reset();const r=this._addPoint(o);r&&e({color:t,curve:r})}else this._reset(),i({color:t,point:s[0]})}}_toSVG(){const t=this._data,e=Math.max(window.devicePixelRatio||1,1),i=this.canvas.width/e,n=this.canvas.height/e,s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute("width",this.canvas.width.toString()),s.setAttribute("height",this.canvas.height.toString()),this._fromData(t,(({color:t,curve:e})=>{const i=document.createElement("path");if(!(isNaN(e.control1.x)||isNaN(e.control1.y)||isNaN(e.control2.x)||isNaN(e.control2.y))){const n=`M ${e.startPoint.x.toFixed(3)},${e.startPoint.y.toFixed(3)} C ${e.control1.x.toFixed(3)},${e.control1.y.toFixed(3)} ${e.control2.x.toFixed(3)},${e.control2.y.toFixed(3)} ${e.endPoint.x.toFixed(3)},${e.endPoint.y.toFixed(3)}`;i.setAttribute("d",n),i.setAttribute("stroke-width",(2.25*e.endWidth).toFixed(3)),i.setAttribute("stroke",t),i.setAttribute("fill","none"),i.setAttribute("stroke-linecap","round"),s.appendChild(i)}}),(({color:t,point:e})=>{const i=document.createElement("circle"),n="function"==typeof this.dotSize?this.dotSize():this.dotSize;i.setAttribute("r",n.toString()),i.setAttribute("cx",e.x.toString()),i.setAttribute("cy",e.y.toString()),i.setAttribute("fill",t),s.appendChild(i)}));const o=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${i} ${n}" width="${i}" height="${n}">`;let r=s.innerHTML;if(void 0===r){const t=document.createElement("dummy"),e=s.childNodes;t.innerHTML="";for(let i=0;i<e.length;i+=1)t.appendChild(e[i].cloneNode(!0));r=t.innerHTML}return"data:image/svg+xml;base64,"+btoa(o+r+"</svg>")}}var v={props:{value:{type:[String,Object],default:null},disabled:{type:Boolean,default:!1},folder:{type:String,default:void 0}},emits:["input"],inject:["system"],mounted(){const t=this.$el.querySelectorAll("canvas")[0];this.canvas=t;const e=new m(t,{onEnd:this.onStrokeEnd});this.signaturePad=e,this.resizeCanvas()},data(){const t=this.system.addTokenToURL;return{touched:!1,error:null,materializeAssetUrl:e=>t(function(){const t=window.location.pathname.split("/"),e=t.indexOf("admin");return t.slice(0,e).join("/")+"/"}()+`assets/${e}`),src:null}},unmounted(){this.signaturePad.off()},methods:{clear(){this.touched=!1,this.error=null,this.signaturePad.clear()},confirm(){this.error=null,this.signaturePad.isEmpty()&&(this.error="Introduce una firma para confirmar");const t=this.signaturePad.toDataURL("image/svg+xml");console.log(this.$props.folder),(async(t,e,i)=>{console.log(i,!!i);const n=await(await fetch(t)).blob(),s=new FormData,o=`firma-${Date.now()}.svg`;s.append("title",o),s.append("type","image/svg+xml"),s.append("filename_disk",o),i&&s.append("folder",i),s.append("file",n);try{return(await e.api.post("/files",s)).data.data}catch(t){const i=e.useNotificationsStore(),n=t.response?.data?.errors?.[0]?.extensions?.code||t?.extensions?.code||"UNKNOWN",s=t.response?.data?.errors?.[0]?.message||t.message||void 0;console.warn(t),i.add({title:`errors.${n}`,text:s,type:"error",dialog:!0,error:t})}})(t,this.system,this.$props.folder).then((e=>{this.$emit("input",e.id),this.src=t}))},resizeCanvas(){var t=Math.max(window.devicePixelRatio||1,1);const e=this.canvas;e.width=e.offsetWidth*t,e.height=e.offsetHeight*t,e.getContext("2d").scale(t,t),this.signaturePad.clear()},onStrokeEnd(){this.touched=!0}}};const p={class:"wrapper"},f={class:"signature-input",ref:"canvas"},g={key:0},_={class:"actions-wrapper"},y=h("Limpiar "),w=h("Confirmar "),x={key:0},E=["src"];var b=[],M=[];!function(t,e){if(t&&"undefined"!=typeof document){var i,n=!0===e.prepend?"prepend":"append",s=!0===e.singleTag,o="string"==typeof e.container?document.querySelector(e.container):document.getElementsByTagName("head")[0];if(s){var r=b.indexOf(o);-1===r&&(r=b.push(o)-1,M[r]={}),i=M[r]&&M[r][n]?M[r][n]:M[r][n]=a()}else i=a();65279===t.charCodeAt(0)&&(t=t.substring(1)),i.styleSheet?i.styleSheet.cssText+=t:i.appendChild(document.createTextNode(t))}function a(){var t=document.createElement("style");if(t.setAttribute("type","text/css"),e.attributes)for(var i=Object.keys(e.attributes),s=0;s<i.length;s++)t.setAttribute(i[s],e.attributes[i[s]]);var r="prepend"===n?"afterbegin":"beforeend";return o.insertAdjacentElement(r,t),t}}("\n.wrapper {\n  position: relative;\n  width: 400px;\n}\n.signature-input {\n  min-height: var(--input-height-tall);\n  color: var(--foreground-subdued);\n  border: 2px dashed var(--border-normal);\n  border-radius: var(--border-radius);\n  transition: var(--fast) var(--transition);\n  transition-property: color, border-color, background-color;\n  width: 100%;\n}\n.actions-wrapper {\n  display: flex;\n  width: 100%;\n  justify-content: space-between;\n  align-items: center;\n}\n.mb-1 {\n  margin-bottom: 16px;\n}\n.hidden {\n  display: none;\n}\n",{}),v.render=function(d,u,m,v,b,M){const P=t("v-notice"),k=t("v-icon"),D=t("v-button");return e(),i("div",p,[n("div",{class:s({hidden:!!m.value||b.src})},[n("canvas",f,null,512),!1===b.touched?(e(),i("span",g,"Toca la pantalla para firmar")):o("v-if",!0),b.error?(e(),r(P,{key:1,type:"danger",class:"mb-1"},{default:a((()=>[h(c(b.error),1)])),_:1})):o("v-if",!0),n("div",_,[l(D,{onClick:M.clear,secondary:""},{default:a((()=>[y,l(k,{name:"clear"})])),_:1},8,["onClick"]),l(D,{onClick:M.confirm},{default:a((()=>[w,l(k,{name:"check"})])),_:1},8,["onClick"])])],2),m.value||b.src?(e(),i("div",x,[n("img",{src:m.value?b.materializeAssetUrl(m.value):b.src,alt:"firma",role:"presentation"},null,8,E)])):o("v-if",!0)])},v.__file="src/interface.vue";var P={id:"binar-signature",name:"Signature",description:"Draw a signature",icon:"gesture",component:v,types:["uuid"],groups:["file"],relational:!0,options:[{field:"folder",name:"$t:interfaces.system-folder.folder",type:"uuid",meta:{width:"full",interface:"system-folder",note:"$t:interfaces.system-folder.field_hint"},schema:{default_value:void 0}}],recommendedDisplays:["image"]};export{P as default};
