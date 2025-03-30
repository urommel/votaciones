const q=Symbol.for("constructDateFrom");function y(n,e){return typeof n=="function"?n(e):n&&typeof n=="object"&&q in n?n[q](e):n instanceof Date?new n.constructor(e):new Date(e)}function l(n,e){return y(e||n,n)}let A={};function v(){return A}function W(n,e){var c,o,d,h;const t=v(),r=(e==null?void 0:e.weekStartsOn)??((o=(c=e==null?void 0:e.locale)==null?void 0:c.options)==null?void 0:o.weekStartsOn)??t.weekStartsOn??((h=(d=t.locale)==null?void 0:d.options)==null?void 0:h.weekStartsOn)??0,a=l(n,e==null?void 0:e.in),i=a.getDay(),u=(i<r?7:0)+i-r;return a.setDate(a.getDate()-u),a.setHours(0,0,0,0),a}function D(n,e){return W(n,{...e,weekStartsOn:1})}function j(n,e){const t=l(n,e==null?void 0:e.in),r=t.getFullYear(),a=y(t,0);a.setFullYear(r+1,0,4),a.setHours(0,0,0,0);const i=D(a),u=y(t,0);u.setFullYear(r,0,4),u.setHours(0,0,0,0);const c=D(u);return t.getTime()>=i.getTime()?r+1:t.getTime()>=c.getTime()?r:r-1}function N(n){const e=l(n),t=new Date(Date.UTC(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds()));return t.setUTCFullYear(e.getFullYear()),+n-+t}function R(n,...e){const t=y.bind(null,e.find(r=>typeof r=="object"));return e.map(t)}function H(n,e){const t=l(n,e==null?void 0:e.in);return t.setHours(0,0,0,0),t}function I(n,e,t){const[r,a]=R(t==null?void 0:t.in,n,e),i=H(r),u=H(a),c=+i-N(i),o=+u-N(u);return Math.round((c-o)/864e5)}function V(n,e){const t=j(n,e),r=y(n,0);return r.setFullYear(t,0,4),r.setHours(0,0,0,0),D(r)}function J(n){return n instanceof Date||typeof n=="object"&&Object.prototype.toString.call(n)==="[object Date]"}function $(n){return!(!J(n)&&typeof n!="number"||isNaN(+l(n)))}function z(n,e){const t=l(n,e==null?void 0:e.in);return t.setFullYear(t.getFullYear(),0,1),t.setHours(0,0,0,0),t}const U={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"1 second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"about 1 hour",other:"about {{count}} hours"},xHours:{one:"1 hour",other:"{{count}} hours"},xDays:{one:"1 day",other:"{{count}} days"},aboutXWeeks:{one:"about 1 week",other:"about {{count}} weeks"},xWeeks:{one:"1 week",other:"{{count}} weeks"},aboutXMonths:{one:"about 1 month",other:"about {{count}} months"},xMonths:{one:"1 month",other:"{{count}} months"},aboutXYears:{one:"about 1 year",other:"about {{count}} years"},xYears:{one:"1 year",other:"{{count}} years"},overXYears:{one:"over 1 year",other:"over {{count}} years"},almostXYears:{one:"almost 1 year",other:"almost {{count}} years"}},K=(n,e,t)=>{let r;const a=U[n];return typeof a=="string"?r=a:e===1?r=a.one:r=a.other.replace("{{count}}",e.toString()),t!=null&&t.addSuffix?t.comparison&&t.comparison>0?"in "+r:r+" ago":r};function Y(n){return(e={})=>{const t=e.width?String(e.width):n.defaultWidth;return n.formats[t]||n.formats[n.defaultWidth]}}const Z={full:"EEEE, MMMM do, y",long:"MMMM do, y",medium:"MMM d, y",short:"MM/dd/yyyy"},p={full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},ee={full:"{{date}} 'at' {{time}}",long:"{{date}} 'at' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},te={date:Y({formats:Z,defaultWidth:"full"}),time:Y({formats:p,defaultWidth:"full"}),dateTime:Y({formats:ee,defaultWidth:"full"})},ne={lastWeek:"'last' eeee 'at' p",yesterday:"'yesterday at' p",today:"'today at' p",tomorrow:"'tomorrow at' p",nextWeek:"eeee 'at' p",other:"P"},re=(n,e,t,r)=>ne[n];function k(n){return(e,t)=>{const r=t!=null&&t.context?String(t.context):"standalone";let a;if(r==="formatting"&&n.formattingValues){const u=n.defaultFormattingWidth||n.defaultWidth,c=t!=null&&t.width?String(t.width):u;a=n.formattingValues[c]||n.formattingValues[u]}else{const u=n.defaultWidth,c=t!=null&&t.width?String(t.width):n.defaultWidth;a=n.values[c]||n.values[u]}const i=n.argumentCallback?n.argumentCallback(e):e;return a[i]}}const ae={narrow:["B","A"],abbreviated:["BC","AD"],wide:["Before Christ","Anno Domini"]},ie={narrow:["1","2","3","4"],abbreviated:["Q1","Q2","Q3","Q4"],wide:["1st quarter","2nd quarter","3rd quarter","4th quarter"]},ue={narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],wide:["January","February","March","April","May","June","July","August","September","October","November","December"]},se={narrow:["S","M","T","W","T","F","S"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],wide:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},ce={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"}},oe={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"}},de=(n,e)=>{const t=Number(n),r=t%100;if(r>20||r<10)switch(r%10){case 1:return t+"st";case 2:return t+"nd";case 3:return t+"rd"}return t+"th"},fe={ordinalNumber:de,era:k({values:ae,defaultWidth:"wide"}),quarter:k({values:ie,defaultWidth:"wide",argumentCallback:n=>n-1}),month:k({values:ue,defaultWidth:"wide"}),day:k({values:se,defaultWidth:"wide"}),dayPeriod:k({values:ce,defaultWidth:"wide",formattingValues:oe,defaultFormattingWidth:"wide"})};function x(n){return(e,t={})=>{const r=t.width,a=r&&n.matchPatterns[r]||n.matchPatterns[n.defaultMatchWidth],i=e.match(a);if(!i)return null;const u=i[0],c=r&&n.parsePatterns[r]||n.parsePatterns[n.defaultParseWidth],o=Array.isArray(c)?me(c,g=>g.test(u)):he(c,g=>g.test(u));let d;d=n.valueCallback?n.valueCallback(o):o,d=t.valueCallback?t.valueCallback(d):d;const h=e.slice(u.length);return{value:d,rest:h}}}function he(n,e){for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t)&&e(n[t]))return t}function me(n,e){for(let t=0;t<n.length;t++)if(e(n[t]))return t}function le(n){return(e,t={})=>{const r=e.match(n.matchPattern);if(!r)return null;const a=r[0],i=e.match(n.parsePattern);if(!i)return null;let u=n.valueCallback?n.valueCallback(i[0]):i[0];u=t.valueCallback?t.valueCallback(u):u;const c=e.slice(a.length);return{value:u,rest:c}}}const ge=/^(\d+)(th|st|nd|rd)?/i,we=/\d+/i,ye={narrow:/^(b|a)/i,abbreviated:/^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,wide:/^(before christ|before common era|anno domini|common era)/i},be={any:[/^b/i,/^(a|c)/i]},Pe={narrow:/^[1234]/i,abbreviated:/^q[1234]/i,wide:/^[1234](th|st|nd|rd)? quarter/i},Me={any:[/1/i,/2/i,/3/i,/4/i]},Oe={narrow:/^[jfmasond]/i,abbreviated:/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,wide:/^(january|february|march|april|may|june|july|august|september|october|november|december)/i},ke={narrow:[/^j/i,/^f/i,/^m/i,/^a/i,/^m/i,/^j/i,/^j/i,/^a/i,/^s/i,/^o/i,/^n/i,/^d/i],any:[/^ja/i,/^f/i,/^mar/i,/^ap/i,/^may/i,/^jun/i,/^jul/i,/^au/i,/^s/i,/^o/i,/^n/i,/^d/i]},xe={narrow:/^[smtwf]/i,short:/^(su|mo|tu|we|th|fr|sa)/i,abbreviated:/^(sun|mon|tue|wed|thu|fri|sat)/i,wide:/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i},We={narrow:[/^s/i,/^m/i,/^t/i,/^w/i,/^t/i,/^f/i,/^s/i],any:[/^su/i,/^m/i,/^tu/i,/^w/i,/^th/i,/^f/i,/^sa/i]},De={narrow:/^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,any:/^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i},ve={any:{am:/^a/i,pm:/^p/i,midnight:/^mi/i,noon:/^no/i,morning:/morning/i,afternoon:/afternoon/i,evening:/evening/i,night:/night/i}},Se={ordinalNumber:le({matchPattern:ge,parsePattern:we,valueCallback:n=>parseInt(n,10)}),era:x({matchPatterns:ye,defaultMatchWidth:"wide",parsePatterns:be,defaultParseWidth:"any"}),quarter:x({matchPatterns:Pe,defaultMatchWidth:"wide",parsePatterns:Me,defaultParseWidth:"any",valueCallback:n=>n+1}),month:x({matchPatterns:Oe,defaultMatchWidth:"wide",parsePatterns:ke,defaultParseWidth:"any"}),day:x({matchPatterns:xe,defaultMatchWidth:"wide",parsePatterns:We,defaultParseWidth:"any"}),dayPeriod:x({matchPatterns:De,defaultMatchWidth:"any",parsePatterns:ve,defaultParseWidth:"any"})},Ye={code:"en-US",formatDistance:K,formatLong:te,formatRelative:re,localize:fe,match:Se,options:{weekStartsOn:0,firstWeekContainsDate:1}};function Te(n,e){const t=l(n,e==null?void 0:e.in);return I(t,z(t))+1}function Fe(n,e){const t=l(n,e==null?void 0:e.in),r=+D(t)-+V(t);return Math.round(r/6048e5)+1}function G(n,e){var h,g,M,O;const t=l(n,e==null?void 0:e.in),r=t.getFullYear(),a=v(),i=(e==null?void 0:e.firstWeekContainsDate)??((g=(h=e==null?void 0:e.locale)==null?void 0:h.options)==null?void 0:g.firstWeekContainsDate)??a.firstWeekContainsDate??((O=(M=a.locale)==null?void 0:M.options)==null?void 0:O.firstWeekContainsDate)??1,u=y((e==null?void 0:e.in)||n,0);u.setFullYear(r+1,0,i),u.setHours(0,0,0,0);const c=W(u,e),o=y((e==null?void 0:e.in)||n,0);o.setFullYear(r,0,i),o.setHours(0,0,0,0);const d=W(o,e);return+t>=+c?r+1:+t>=+d?r:r-1}function Ee(n,e){var c,o,d,h;const t=v(),r=(e==null?void 0:e.firstWeekContainsDate)??((o=(c=e==null?void 0:e.locale)==null?void 0:c.options)==null?void 0:o.firstWeekContainsDate)??t.firstWeekContainsDate??((h=(d=t.locale)==null?void 0:d.options)==null?void 0:h.firstWeekContainsDate)??1,a=G(n,e),i=y((e==null?void 0:e.in)||n,0);return i.setFullYear(a,0,r),i.setHours(0,0,0,0),W(i,e)}function Ce(n,e){const t=l(n,e==null?void 0:e.in),r=+W(t,e)-+Ee(t,e);return Math.round(r/6048e5)+1}function s(n,e){const t=n<0?"-":"",r=Math.abs(n).toString().padStart(e,"0");return t+r}const w={y(n,e){const t=n.getFullYear(),r=t>0?t:1-t;return s(e==="yy"?r%100:r,e.length)},M(n,e){const t=n.getMonth();return e==="M"?String(t+1):s(t+1,2)},d(n,e){return s(n.getDate(),e.length)},a(n,e){const t=n.getHours()/12>=1?"pm":"am";switch(e){case"a":case"aa":return t.toUpperCase();case"aaa":return t;case"aaaaa":return t[0];case"aaaa":default:return t==="am"?"a.m.":"p.m."}},h(n,e){return s(n.getHours()%12||12,e.length)},H(n,e){return s(n.getHours(),e.length)},m(n,e){return s(n.getMinutes(),e.length)},s(n,e){return s(n.getSeconds(),e.length)},S(n,e){const t=e.length,r=n.getMilliseconds(),a=Math.trunc(r*Math.pow(10,t-3));return s(a,e.length)}},P={midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},Q={G:function(n,e,t){const r=n.getFullYear()>0?1:0;switch(e){case"G":case"GG":case"GGG":return t.era(r,{width:"abbreviated"});case"GGGGG":return t.era(r,{width:"narrow"});case"GGGG":default:return t.era(r,{width:"wide"})}},y:function(n,e,t){if(e==="yo"){const r=n.getFullYear(),a=r>0?r:1-r;return t.ordinalNumber(a,{unit:"year"})}return w.y(n,e)},Y:function(n,e,t,r){const a=G(n,r),i=a>0?a:1-a;if(e==="YY"){const u=i%100;return s(u,2)}return e==="Yo"?t.ordinalNumber(i,{unit:"year"}):s(i,e.length)},R:function(n,e){const t=j(n);return s(t,e.length)},u:function(n,e){const t=n.getFullYear();return s(t,e.length)},Q:function(n,e,t){const r=Math.ceil((n.getMonth()+1)/3);switch(e){case"Q":return String(r);case"QQ":return s(r,2);case"Qo":return t.ordinalNumber(r,{unit:"quarter"});case"QQQ":return t.quarter(r,{width:"abbreviated",context:"formatting"});case"QQQQQ":return t.quarter(r,{width:"narrow",context:"formatting"});case"QQQQ":default:return t.quarter(r,{width:"wide",context:"formatting"})}},q:function(n,e,t){const r=Math.ceil((n.getMonth()+1)/3);switch(e){case"q":return String(r);case"qq":return s(r,2);case"qo":return t.ordinalNumber(r,{unit:"quarter"});case"qqq":return t.quarter(r,{width:"abbreviated",context:"standalone"});case"qqqqq":return t.quarter(r,{width:"narrow",context:"standalone"});case"qqqq":default:return t.quarter(r,{width:"wide",context:"standalone"})}},M:function(n,e,t){const r=n.getMonth();switch(e){case"M":case"MM":return w.M(n,e);case"Mo":return t.ordinalNumber(r+1,{unit:"month"});case"MMM":return t.month(r,{width:"abbreviated",context:"formatting"});case"MMMMM":return t.month(r,{width:"narrow",context:"formatting"});case"MMMM":default:return t.month(r,{width:"wide",context:"formatting"})}},L:function(n,e,t){const r=n.getMonth();switch(e){case"L":return String(r+1);case"LL":return s(r+1,2);case"Lo":return t.ordinalNumber(r+1,{unit:"month"});case"LLL":return t.month(r,{width:"abbreviated",context:"standalone"});case"LLLLL":return t.month(r,{width:"narrow",context:"standalone"});case"LLLL":default:return t.month(r,{width:"wide",context:"standalone"})}},w:function(n,e,t,r){const a=Ce(n,r);return e==="wo"?t.ordinalNumber(a,{unit:"week"}):s(a,e.length)},I:function(n,e,t){const r=Fe(n);return e==="Io"?t.ordinalNumber(r,{unit:"week"}):s(r,e.length)},d:function(n,e,t){return e==="do"?t.ordinalNumber(n.getDate(),{unit:"date"}):w.d(n,e)},D:function(n,e,t){const r=Te(n);return e==="Do"?t.ordinalNumber(r,{unit:"dayOfYear"}):s(r,e.length)},E:function(n,e,t){const r=n.getDay();switch(e){case"E":case"EE":case"EEE":return t.day(r,{width:"abbreviated",context:"formatting"});case"EEEEE":return t.day(r,{width:"narrow",context:"formatting"});case"EEEEEE":return t.day(r,{width:"short",context:"formatting"});case"EEEE":default:return t.day(r,{width:"wide",context:"formatting"})}},e:function(n,e,t,r){const a=n.getDay(),i=(a-r.weekStartsOn+8)%7||7;switch(e){case"e":return String(i);case"ee":return s(i,2);case"eo":return t.ordinalNumber(i,{unit:"day"});case"eee":return t.day(a,{width:"abbreviated",context:"formatting"});case"eeeee":return t.day(a,{width:"narrow",context:"formatting"});case"eeeeee":return t.day(a,{width:"short",context:"formatting"});case"eeee":default:return t.day(a,{width:"wide",context:"formatting"})}},c:function(n,e,t,r){const a=n.getDay(),i=(a-r.weekStartsOn+8)%7||7;switch(e){case"c":return String(i);case"cc":return s(i,e.length);case"co":return t.ordinalNumber(i,{unit:"day"});case"ccc":return t.day(a,{width:"abbreviated",context:"standalone"});case"ccccc":return t.day(a,{width:"narrow",context:"standalone"});case"cccccc":return t.day(a,{width:"short",context:"standalone"});case"cccc":default:return t.day(a,{width:"wide",context:"standalone"})}},i:function(n,e,t){const r=n.getDay(),a=r===0?7:r;switch(e){case"i":return String(a);case"ii":return s(a,e.length);case"io":return t.ordinalNumber(a,{unit:"day"});case"iii":return t.day(r,{width:"abbreviated",context:"formatting"});case"iiiii":return t.day(r,{width:"narrow",context:"formatting"});case"iiiiii":return t.day(r,{width:"short",context:"formatting"});case"iiii":default:return t.day(r,{width:"wide",context:"formatting"})}},a:function(n,e,t){const a=n.getHours()/12>=1?"pm":"am";switch(e){case"a":case"aa":return t.dayPeriod(a,{width:"abbreviated",context:"formatting"});case"aaa":return t.dayPeriod(a,{width:"abbreviated",context:"formatting"}).toLowerCase();case"aaaaa":return t.dayPeriod(a,{width:"narrow",context:"formatting"});case"aaaa":default:return t.dayPeriod(a,{width:"wide",context:"formatting"})}},b:function(n,e,t){const r=n.getHours();let a;switch(r===12?a=P.noon:r===0?a=P.midnight:a=r/12>=1?"pm":"am",e){case"b":case"bb":return t.dayPeriod(a,{width:"abbreviated",context:"formatting"});case"bbb":return t.dayPeriod(a,{width:"abbreviated",context:"formatting"}).toLowerCase();case"bbbbb":return t.dayPeriod(a,{width:"narrow",context:"formatting"});case"bbbb":default:return t.dayPeriod(a,{width:"wide",context:"formatting"})}},B:function(n,e,t){const r=n.getHours();let a;switch(r>=17?a=P.evening:r>=12?a=P.afternoon:r>=4?a=P.morning:a=P.night,e){case"B":case"BB":case"BBB":return t.dayPeriod(a,{width:"abbreviated",context:"formatting"});case"BBBBB":return t.dayPeriod(a,{width:"narrow",context:"formatting"});case"BBBB":default:return t.dayPeriod(a,{width:"wide",context:"formatting"})}},h:function(n,e,t){if(e==="ho"){let r=n.getHours()%12;return r===0&&(r=12),t.ordinalNumber(r,{unit:"hour"})}return w.h(n,e)},H:function(n,e,t){return e==="Ho"?t.ordinalNumber(n.getHours(),{unit:"hour"}):w.H(n,e)},K:function(n,e,t){const r=n.getHours()%12;return e==="Ko"?t.ordinalNumber(r,{unit:"hour"}):s(r,e.length)},k:function(n,e,t){let r=n.getHours();return r===0&&(r=24),e==="ko"?t.ordinalNumber(r,{unit:"hour"}):s(r,e.length)},m:function(n,e,t){return e==="mo"?t.ordinalNumber(n.getMinutes(),{unit:"minute"}):w.m(n,e)},s:function(n,e,t){return e==="so"?t.ordinalNumber(n.getSeconds(),{unit:"second"}):w.s(n,e)},S:function(n,e){return w.S(n,e)},X:function(n,e,t){const r=n.getTimezoneOffset();if(r===0)return"Z";switch(e){case"X":return _(r);case"XXXX":case"XX":return b(r);case"XXXXX":case"XXX":default:return b(r,":")}},x:function(n,e,t){const r=n.getTimezoneOffset();switch(e){case"x":return _(r);case"xxxx":case"xx":return b(r);case"xxxxx":case"xxx":default:return b(r,":")}},O:function(n,e,t){const r=n.getTimezoneOffset();switch(e){case"O":case"OO":case"OOO":return"GMT"+X(r,":");case"OOOO":default:return"GMT"+b(r,":")}},z:function(n,e,t){const r=n.getTimezoneOffset();switch(e){case"z":case"zz":case"zzz":return"GMT"+X(r,":");case"zzzz":default:return"GMT"+b(r,":")}},t:function(n,e,t){const r=Math.trunc(+n/1e3);return s(r,e.length)},T:function(n,e,t){return s(+n,e.length)}};function X(n,e=""){const t=n>0?"-":"+",r=Math.abs(n),a=Math.trunc(r/60),i=r%60;return i===0?t+String(a):t+String(a)+e+s(i,2)}function _(n,e){return n%60===0?(n>0?"-":"+")+s(Math.abs(n)/60,2):b(n,e)}function b(n,e=""){const t=n>0?"-":"+",r=Math.abs(n),a=s(Math.trunc(r/60),2),i=s(r%60,2);return t+a+e+i}const L=(n,e)=>{switch(n){case"P":return e.date({width:"short"});case"PP":return e.date({width:"medium"});case"PPP":return e.date({width:"long"});case"PPPP":default:return e.date({width:"full"})}},B=(n,e)=>{switch(n){case"p":return e.time({width:"short"});case"pp":return e.time({width:"medium"});case"ppp":return e.time({width:"long"});case"pppp":default:return e.time({width:"full"})}},qe=(n,e)=>{const t=n.match(/(P+)(p+)?/)||[],r=t[1],a=t[2];if(!a)return L(n,e);let i;switch(r){case"P":i=e.dateTime({width:"short"});break;case"PP":i=e.dateTime({width:"medium"});break;case"PPP":i=e.dateTime({width:"long"});break;case"PPPP":default:i=e.dateTime({width:"full"});break}return i.replace("{{date}}",L(r,e)).replace("{{time}}",B(a,e))},Ne={p:B,P:qe},He=/^D+$/,Qe=/^Y+$/,Xe=["D","DD","YY","YYYY"];function _e(n){return He.test(n)}function Le(n){return Qe.test(n)}function je(n,e,t){const r=Ge(n,e,t);if(console.warn(r),Xe.includes(n))throw new RangeError(r)}function Ge(n,e,t){const r=n[0]==="Y"?"years":"days of the month";return`Use \`${n.toLowerCase()}\` instead of \`${n}\` (in \`${e}\`) for formatting ${r} to the input \`${t}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`}const Be=/[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,Ae=/P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,Re=/^'([^]*?)'?$/,Ie=/''/g,Ve=/[a-zA-Z]/;function $e(n,e,t){var h,g,M,O,T,F,E,C;const r=v(),a=(t==null?void 0:t.locale)??r.locale??Ye,i=(t==null?void 0:t.firstWeekContainsDate)??((g=(h=t==null?void 0:t.locale)==null?void 0:h.options)==null?void 0:g.firstWeekContainsDate)??r.firstWeekContainsDate??((O=(M=r.locale)==null?void 0:M.options)==null?void 0:O.firstWeekContainsDate)??1,u=(t==null?void 0:t.weekStartsOn)??((F=(T=t==null?void 0:t.locale)==null?void 0:T.options)==null?void 0:F.weekStartsOn)??r.weekStartsOn??((C=(E=r.locale)==null?void 0:E.options)==null?void 0:C.weekStartsOn)??0,c=l(n,t==null?void 0:t.in);if(!$(c))throw new RangeError("Invalid time value");let o=e.match(Ae).map(m=>{const f=m[0];if(f==="p"||f==="P"){const S=Ne[f];return S(m,a.formatLong)}return m}).join("").match(Be).map(m=>{if(m==="''")return{isToken:!1,value:"'"};const f=m[0];if(f==="'")return{isToken:!1,value:Je(m)};if(Q[f])return{isToken:!0,value:m};if(f.match(Ve))throw new RangeError("Format string contains an unescaped latin alphabet character `"+f+"`");return{isToken:!1,value:m}});a.localize.preprocessor&&(o=a.localize.preprocessor(c,o));const d={firstWeekContainsDate:i,weekStartsOn:u,locale:a};return o.map(m=>{if(!m.isToken)return m.value;const f=m.value;(!(t!=null&&t.useAdditionalWeekYearTokens)&&Le(f)||!(t!=null&&t.useAdditionalDayOfYearTokens)&&_e(f))&&je(f,e,String(n));const S=Q[f[0]];return S(c,f,a.localize,d)}).join("")}function Je(n){const e=n.match(Re);return e?e[1].replace(Ie,"'"):n}export{k as a,Y as b,x as c,le as d,$e as f};
