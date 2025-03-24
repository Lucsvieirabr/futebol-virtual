import{a0 as F,a2 as A,a1 as l,a4 as a,s as T,a7 as P,a8 as V,K as v,g as _,o as w,c as S,b as E,aa as h,a as f,w as b,a9 as s,l as M,F as U,k as C,h as j,al as H}from"./CAdTuWl1.js";import{s as N,a as $}from"./BqbA0dF3.js";import{s as R}from"./D6Aev5DK.js";import{s as q}from"./tHumGTzr.js";var G={root:function(e){var n=e.props;return["p-orderlist p-component",{"p-orderlist-striped":n.stripedRows}]},controls:"p-orderlist-controls",container:"p-orderlist-list-container",header:"p-orderlist-header",list:"p-orderlist-list",item:function(e){var n=e.instance,o=e.item,r=e.id;return["p-orderlist-item",{"p-highlight":n.isSelected(o),"p-focus":r===n.focusedOptionId}]}},W=F.extend({name:"orderlist",classes:G}),z={name:"BaseOrderList",extends:V,props:{modelValue:{type:Array,default:null},selection:{type:Array,default:null},dataKey:{type:String,default:null},listStyle:{type:null,default:null},metaKeySelection:{type:Boolean,default:!1},autoOptionFocus:{type:Boolean,default:!0},focusOnHover:{type:Boolean,default:!0},responsive:{type:Boolean,default:!0},breakpoint:{type:String,default:"960px"},stripedRows:{type:Boolean,default:!1},tabindex:{type:Number,default:0},listProps:{type:null,default:null},moveUpButtonProps:{type:null,default:null},moveTopButtonProps:{type:null,default:null},moveDownButtonProps:{type:null,default:null},moveBottomButtonProps:{type:null,default:null},ariaLabelledby:{type:String,default:null},ariaLabel:{type:String,default:null}},style:W,provide:function(){return{$parentInstance:this}}};function d(t){return Y(t)||X(t)||Q(t)||J()}function J(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Q(t,e){if(t){if(typeof t=="string")return L(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);if(n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set")return Array.from(t);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return L(t,e)}}function X(t){if(typeof Symbol<"u"&&t[Symbol.iterator]!=null||t["@@iterator"]!=null)return Array.from(t)}function Y(t){if(Array.isArray(t))return L(t)}function L(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,o=new Array(e);n<e;n++)o[n]=t[n];return o}var Z={name:"OrderList",extends:z,inheritAttrs:!1,emits:["update:modelValue","reorder","update:selection","selection-change","focus","blur"],itemTouched:!1,reorderDirection:null,styleElement:null,list:null,data:function(){return{id:this.$attrs.id,d_selection:this.selection,focused:!1,focusedOptionIndex:-1}},watch:{"$attrs.id":function(e){this.id=e||A()}},beforeUnmount:function(){this.destroyStyle()},updated:function(){this.reorderDirection&&(this.updateListScroll(),this.reorderDirection=null)},mounted:function(){this.id=this.id||A(),this.responsive&&this.createStyle()},methods:{getItemKey:function(e,n){return this.dataKey?l.resolveFieldData(e,this.dataKey):n},getPTOptions:function(e,n,o){return this.ptm(n,{context:{active:this.isSelected(e),focused:"".concat(this.id,"_").concat(o)===this.focusedOptionId}})},isSelected:function(e){return l.findIndexInList(e,this.d_selection)!=-1},onListFocus:function(e){this.focused=!0,this.findCurrentFocusedIndex(),this.scrollInView(this.focusedOptionIndex),this.$emit("focus",e)},onListBlur:function(e){this.focused=!1,this.focusedOptionIndex=-1,this.$emit("blur",e)},onListKeyDown:function(e){switch(e.code){case"ArrowDown":this.onArrowDownKey(e);break;case"ArrowUp":this.onArrowUpKey(e);break;case"Home":this.onHomeKey(e);break;case"End":this.onEndKey(e);break;case"Enter":case"NumpadEnter":this.onEnterKey(e);break;case"Space":this.onSpaceKey(e);break;case"KeyA":e.ctrlKey&&(this.d_selection=d(this.modelValue),this.$emit("update:selection",this.d_selection),e.preventDefault())}},onOptionMouseDown:function(e,n){this.changeFocusedOptionIndex(n)},onOptionMouseMove:function(e){this.focusOnHover&&this.focused&&this.changeFocusedOptionIndex(e)},onArrowDownKey:function(e){var n=this.focusedOptionIndex!==-1?this.findNextOptionIndex():this.findFirstSelectedOptionIndex();this.changeFocusedOptionIndex(n),e.shiftKey&&this.onEnterKey(e),e.preventDefault()},onArrowUpKey:function(e){var n=this.focusedOptionIndex!==-1?this.findPrevOptionIndex():this.findLastSelectedOptionIndex();this.changeFocusedOptionIndex(n),e.shiftKey&&this.onEnterKey(e),e.preventDefault()},onHomeKey:function(e){if(e.ctrlKey&&e.shiftKey){var n=this.findMatchedOptionIndex();this.d_selection=d(this.modelValue).slice(0,n+1),this.$emit("update:selection",this.d_selection),this.$emit("selection-change",{originalEvent:e,value:this.d_selection})}else this.changeFocusedOptionIndex(0);e.preventDefault()},onEndKey:function(e){if(e.ctrlKey&&e.shiftKey){var n=this.findMatchedOptionIndex();this.d_selection=d(this.modelValue).slice(n,items.length),this.$emit("update:selection",this.d_selection),this.$emit("selection-change",{originalEvent:e,value:this.d_selection})}else this.changeFocusedOptionIndex(this.findAllItems().length-1);e.preventDefault()},onEnterKey:function(e){var n=this.findMatchedOptionIndex();this.onItemClick(e,this.modelValue[n],n),e.preventDefault()},onSpaceKey:function(e){if(e.preventDefault(),e.shiftKey&&this.d_selection&&this.d_selection.length>0){var n=l.findIndexInList(this.d_selection[0],d(this.modelValue)),o=this.findMatchedOptionIndex();this.d_selection=d(this.modelValue).slice(Math.min(n,o),Math.max(n,o)+1),this.$emit("update:selection",this.d_selection),this.$emit("selection-change",{originalEvent:e,value:this.d_selection})}else this.onEnterKey(e)},findAllItems:function(){return a.find(this.list,'[data-pc-section="item"]')},findFocusedItem:function(){return a.findSingle(this.list,'[data-pc-section="item"][id='.concat(this.focusedOptionIndex,"]"))},findCurrentFocusedIndex:function(){this.focusedOptionIndex===-1&&(this.focusedOptionIndex=this.findFirstSelectedOptionIndex(),this.autoOptionFocus&&this.focusedOptionIndex===-1&&(this.focusedOptionIndex=this.findFirstFocusedOptionIndex()))},findFirstFocusedOptionIndex:function(){var e=a.findSingle(this.list,'[data-pc-section="item"]');return a.getAttribute(e,"id")},findFirstSelectedOptionIndex:function(){if(this.hasSelectedOption){var e=a.findSingle(this.list,'[data-p-highlight="true"]');return a.getAttribute(e,"id")}return-1},findLastSelectedOptionIndex:function(){if(this.hasSelectedOption){var e=a.find(this.list,'[data-p-highlight="true"]');return l.findIndexInList(e[e.length-1],this.list.children)}return-1},findMatchedOptionIndex:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:this.focusedOptionIndex,n=this.findAllItems();return d(n).findIndex(function(o){return o.id===e})},findNextOptionIndex:function(){var e=this.findMatchedOptionIndex();return e>-1?e+1:0},findPrevOptionIndex:function(){var e=this.findMatchedOptionIndex();return e>-1?e-1:0},changeFocusedOptionIndex:function(e){var n=this.findAllItems(),o=e>=n.length?n.length-1:e<0?0:e;this.focusedOptionIndex=n[o]?n[o].getAttribute("id"):-1,this.scrollInView(this.focusedOptionIndex)},scrollInView:function(e){var n=a.findSingle(this.list,'[data-pc-section="item"][id="'.concat(e,'"]'));n&&n.scrollIntoView&&n.scrollIntoView({block:"nearest",inline:"start",behavior:"smooth"})},moveUp:function(e){if(this.d_selection){for(var n=d(this.modelValue),o=0;o<this.d_selection.length;o++){var r=this.d_selection[o],i=l.findIndexInList(r,n);if(i!==0){var c=n[i],u=n[i-1];n[i-1]=c,n[i]=u}else break}this.reorderDirection="up",this.$emit("update:modelValue",n),this.$emit("reorder",{originalEvent:e,value:n,direction:this.reorderDirection})}},moveTop:function(e){if(this.d_selection){for(var n=d(this.modelValue),o=0;o<this.d_selection.length;o++){var r=this.d_selection[o],i=l.findIndexInList(r,n);if(i!==0){var c=n.splice(i,1)[0];n.unshift(c)}else break}this.reorderDirection="top",this.$emit("update:modelValue",n),this.$emit("reorder",{originalEvent:e,value:n,direction:this.reorderDirection})}},moveDown:function(e){if(this.d_selection){for(var n=d(this.modelValue),o=this.d_selection.length-1;o>=0;o--){var r=this.d_selection[o],i=l.findIndexInList(r,n);if(i!==n.length-1){var c=n[i],u=n[i+1];n[i+1]=c,n[i]=u}else break}this.reorderDirection="down",this.$emit("update:modelValue",n),this.$emit("reorder",{originalEvent:e,value:n,direction:this.reorderDirection})}},moveBottom:function(e){if(this.d_selection){for(var n=d(this.modelValue),o=this.d_selection.length-1;o>=0;o--){var r=this.d_selection[o],i=l.findIndexInList(r,n);if(i!==n.length-1){var c=n.splice(i,1)[0];n.push(c)}else break}this.reorderDirection="bottom",this.$emit("update:modelValue",n),this.$emit("reorder",{originalEvent:e,value:n,direction:this.reorderDirection})}},onItemClick:function(e,n,o){this.itemTouched=!1;var r=l.findIndexInList(n,this.d_selection),i=r!=-1,c=this.itemTouched?!1:this.metaKeySelection,u=this.findAllItems()[o].getAttribute("id");if(this.focusedOptionIndex=u,c){var I=e.metaKey||e.ctrlKey;i&&I?this.d_selection=this.d_selection.filter(function(D,y){return y!==r}):(this.d_selection=I?this.d_selection?d(this.d_selection):[]:[],l.insertIntoOrderedArray(n,o,this.d_selection,this.modelValue))}else i?this.d_selection=this.d_selection.filter(function(D,y){return y!==r}):(this.d_selection=this.d_selection?d(this.d_selection):[],l.insertIntoOrderedArray(n,o,this.d_selection,this.modelValue));this.$emit("update:selection",this.d_selection),this.$emit("selection-change",{originalEvent:e,value:this.d_selection})},onItemTouchEnd:function(){this.itemTouched=!0},updateListScroll:function(){var e=a.find(this.list,'[data-pc-section="item"][data-p-highlight="true"]');if(e&&e.length)switch(this.reorderDirection){case"up":a.scrollInView(this.list,e[0]);break;case"top":this.list.scrollTop=0;break;case"down":a.scrollInView(this.list,e[e.length-1]);break;case"bottom":this.list.scrollTop=this.list.scrollHeight;break}},createStyle:function(){if(!this.styleElement&&!this.isUnstyled){var e;this.$el.setAttribute(this.attributeSelector,""),this.styleElement=document.createElement("style"),this.styleElement.type="text/css",a.setAttribute(this.styleElement,"nonce",(e=this.$primevue)===null||e===void 0||(e=e.config)===null||e===void 0||(e=e.csp)===null||e===void 0?void 0:e.nonce),document.head.appendChild(this.styleElement);var n=`
@media screen and (max-width: `.concat(this.breakpoint,`) {
    .p-orderlist[`).concat(this.attributeSelector,`] {
        flex-direction: column;
    }

    .p-orderlist[`).concat(this.attributeSelector,`] .p-orderlist-controls {
        padding: var(--content-padding);
        flex-direction: row;
    }

    .p-orderlist[`).concat(this.attributeSelector,`] .p-orderlist-controls .p-button {
        margin-right: var(--inline-spacing);
        margin-bottom: 0;
    }

    .p-orderlist[`).concat(this.attributeSelector,`] .p-orderlist-controls .p-button:last-child {
        margin-right: 0;
    }
}
`);this.styleElement.innerHTML=n}},destroyStyle:function(){this.styleElement&&(document.head.removeChild(this.styleElement),this.styleElement=null)},moveDisabled:function(){if(!this.d_selection||!this.d_selection.length)return!0},listRef:function(e){this.list=e?e.$el:void 0}},computed:{attributeSelector:function(){return A()},focusedOptionId:function(){return this.focusedOptionIndex!==-1?this.focusedOptionIndex:null},moveUpAriaLabel:function(){return this.$primevue.config.locale.aria?this.$primevue.config.locale.aria.moveUp:void 0},moveTopAriaLabel:function(){return this.$primevue.config.locale.aria?this.$primevue.config.locale.aria.moveTop:void 0},moveDownAriaLabel:function(){return this.$primevue.config.locale.aria?this.$primevue.config.locale.aria.moveDown:void 0},moveBottomAriaLabel:function(){return this.$primevue.config.locale.aria?this.$primevue.config.locale.aria.moveBottom:void 0},hasSelectedOption:function(){return l.isNotEmpty(this.d_selection)}},components:{OLButton:T,AngleUpIcon:q,AngleDownIcon:R,AngleDoubleUpIcon:N,AngleDoubleDownIcon:$},directives:{ripple:P}};function g(t){"@babel/helpers - typeof";return g=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},g(t)}function k(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter(function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable})),n.push.apply(n,o)}return n}function K(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?k(Object(n),!0).forEach(function(o){ee(t,o,n[o])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):k(Object(n)).forEach(function(o){Object.defineProperty(t,o,Object.getOwnPropertyDescriptor(n,o))})}return t}function ee(t,e,n){return e=te(e),e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function te(t){var e=ne(t,"string");return g(e)=="symbol"?e:String(e)}function ne(t,e){if(g(t)!="object"||!t)return t;var n=t[Symbol.toPrimitive];if(n!==void 0){var o=n.call(t,e||"default");if(g(o)!="object")return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}var ie=["id","onClick","onMousedown","onMousemove","aria-selected","data-p-highlight","data-p-focused"];function oe(t,e,n,o,r,i){var c=v("AngleUpIcon"),u=v("OLButton"),I=v("AngleDoubleUpIcon"),D=v("AngleDownIcon"),y=v("AngleDoubleDownIcon"),x=_("ripple");return w(),S("div",s({class:t.cx("root")},t.ptmi("root")),[E("div",s({class:t.cx("controls")},t.ptm("controls")),[h(t.$slots,"controlsstart"),f(u,s({type:"button",onClick:i.moveUp,"aria-label":i.moveUpAriaLabel,disabled:i.moveDisabled()},t.moveUpButtonProps,{pt:t.ptm("moveUpButton"),unstyled:t.unstyled}),{icon:b(function(){return[h(t.$slots,"moveupicon",{},function(){return[f(c,s(t.ptm("moveUpButton").icon,{"data-pc-section":"moveupicon"}),null,16)]})]}),_:3},16,["onClick","aria-label","disabled","pt","unstyled"]),f(u,s({type:"button",onClick:i.moveTop,"aria-label":i.moveTopAriaLabel,disabled:i.moveDisabled()},t.moveTopButtonProps,{pt:t.ptm("moveTopButton"),unstyled:t.unstyled}),{icon:b(function(){return[h(t.$slots,"movetopicon",{},function(){return[f(I,s(t.ptm("moveTopButton").icon,{"data-pc-section":"movetopicon"}),null,16)]})]}),_:3},16,["onClick","aria-label","disabled","pt","unstyled"]),f(u,s({type:"button",onClick:i.moveDown,"aria-label":i.moveDownAriaLabel,disabled:i.moveDisabled()},t.moveDownButtonProps,{pt:t.ptm("moveDownButton"),unstyled:t.unstyled}),{icon:b(function(){return[h(t.$slots,"movedownicon",{},function(){return[f(D,s(t.ptm("moveDownButton").icon,{"data-pc-section":"movedownicon"}),null,16)]})]}),_:3},16,["onClick","aria-label","disabled","pt","unstyled"]),f(u,s({type:"button",onClick:i.moveBottom,"aria-label":i.moveBottomAriaLabel,disabled:i.moveDisabled()},t.moveBottomButtonProps,{pt:t.ptm("moveBottomButton"),unstyled:t.unstyled}),{icon:b(function(){return[h(t.$slots,"movebottomicon",{},function(){return[f(y,s(t.ptm("moveBottomButton").icon,{"data-pc-section":"movebottomicon"}),null,16)]})]}),_:3},16,["onClick","aria-label","disabled","pt","unstyled"]),h(t.$slots,"controlsend")],16),E("div",s({class:t.cx("container")},t.ptm("container")),[t.$slots.header?(w(),S("div",s({key:0,class:t.cx("header")},t.ptm("header")),[h(t.$slots,"header")],16)):M("",!0),f(H,s({ref:i.listRef,id:r.id+"_list",name:"p-orderlist-flip",tag:"ul",class:t.cx("list"),style:t.listStyle,role:"listbox","aria-multiselectable":"true",tabindex:t.tabindex,"aria-activedescendant":r.focused?i.focusedOptionId:void 0,"aria-label":t.ariaLabel,"aria-labelledby":t.ariaLabelledby,onFocus:i.onListFocus,onBlur:i.onListBlur,onKeydown:i.onListKeyDown},K(K(K({},t.listProps),t.ptm("list")),t.ptm("transition"))),{default:b(function(){return[(w(!0),S(U,null,C(t.modelValue,function(m,p){return j((w(),S("li",s({key:i.getItemKey(m,p),id:r.id+"_"+p,role:"option",class:t.cx("item",{item:m,id:"".concat(r.id,"_").concat(p)}),onClick:function(O){return i.onItemClick(O,m,p)},onTouchend:e[0]||(e[0]=function(){return i.onItemTouchEnd&&i.onItemTouchEnd.apply(i,arguments)}),onMousedown:function(O){return i.onOptionMouseDown(O,p)},onMousemove:function(O){return i.onOptionMouseMove(p)},"aria-selected":i.isSelected(m)},i.getPTOptions(m,"item",p),{"data-p-highlight":i.isSelected(m),"data-p-focused":"".concat(r.id,"_").concat(p)===i.focusedOptionId}),[h(t.$slots,"item",{item:m,index:p})],16,ie)),[[x]])}),128))]}),_:3},16,["id","class","style","tabindex","aria-activedescendant","aria-label","aria-labelledby","onFocus","onBlur","onKeydown"])],16)],16)}Z.render=oe;export{Z as default};
