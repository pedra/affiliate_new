const a=(c,e=!1)=>document[`querySelector${e?"All":""}`](c)||null,f=(c,e="document",s="click")=>{let t=e!=null&&typeof e=="object"?e:e=="document"||!e||e==""||e==null?document:a(e,!0);return t==null||t.length==0?!1:(t[0]?t:[t]).forEach(i=>i.addEventListener(s,c))},r=(c="div",e={},s=!1)=>{const t=document.createElement(c);for(let i in e)t.setAttribute(i,e[i]);switch(typeof s){case"boolean":break;case"string":t.innerHTML=s;break;case"object":t.appendChild(s);break}return t},v=c=>(typeof c=="number"?c:new Date().getTime()).toString(36),h=c=>new Promise(e=>setTimeout(e,c)),u=(c=!0)=>{if(console.log("Glass:",c?"true":"false"),c===!1)return a(".__glass").classList.remove("active");let e=a(".__glass");if(!e){let s=r("div",{class:"__glass active"},r("div",{class:"loader"}));a("body").appendChild(s);return}e.classList.add("active")},l=async(c,e="",s=null,t=null)=>{s=s||null,t=t||2e3+c.length*40,e="__rep-"+(e=="info"||e=="i"?"info":e=="warn"||e=="w"?"warn":"alert");const i="__"+v(),o=r("div",{class:`__rep-content ${e}`,id:i},r("span",{class:"__report_i material-symbols-outlined pulse"},"close"));o.innerHTML+=c,f(async p=>{const m=p.currentTarget;m.classList.remove("active"),await h(400),m.remove()},o);let n=a("#__report");n||(n=r("div",{class:"__report",id:"__report"}),a("body").appendChild(n)),n?.appendChild(o),await h(500),a("#"+i).classList.add("active"),await h(t);const d=a("#"+i);d&&(d.classList.remove("active"),await h(400),d.remove())},g=(c,e,s=!0)=>{const t=c.currentTarget;if(t.classList.contains("disabled"))return!1;let i=t.innerHTML.replace("toggle_","")=="on"?"off":"on";return e[i].msg&&!confirm(e[i].msg)?!1:(t.previousElementSibling.innerHTML=e[i].title,s?(t.innerHTML=`toggle_${i}`,t.classList[i=="off"?"add":"remove"]("off"),t.dataset.status=i=="on"?"1":"0",i):(t.remove(),i))};class y{eContainer=null;eBtnSignin=null;eSignin=null;eEmail=null;ePassword=null;eBtnLogin=null;eImage=[];counter=0;imgs=["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","9.jpg","10.jpg"];Api="";constructor(e){this.Api=e.api,this.eContainer=a("#carousel"),this.eBtnSignin=a("#hom-signin"),this.eSignin=a("#signin")}async init(){f(()=>this.goSignin(),this.eBtnSignin),this.imgs.forEach((e,s)=>{const t=r("img",{src:`/img/${e}`,alt:`Image ${s}`});this.eImage.push(t),this.eContainer?.append(t)}),this.carousel()}async carousel(){await h(6e3),this.counter++,this.counter>=this.imgs.length&&(this.counter=0);const e=this.eImage[this.counter];return e&&(this.eImage.forEach(s=>s.classList.remove("on")),e.classList.add("on")),this.carousel()}goSignin(){const e=r("div",{class:"input"},r("label",{},"E-mail"));this.eEmail=r("input",{type:"email",id:"sgn-email",placeholder:"E-mail"}),e.append(this.eEmail);const s=r("div",{class:"input"},r("label",{},"Password"));this.ePassword=r("input",{type:"password",id:"sgn-password",placeholder:"Password"}),s.append(this.ePassword),this.eBtnLogin=r("button",{id:"sgn-btn-login"},"Login"),f(()=>this.login(),this.eBtnLogin);const t=r("div",{class:"form"});t.append(e,s,this.eBtnLogin),this.eSignin?.append(t),this.eSignin?.classList.add("on"),f(i=>this.closeSignin(i),this.eSignin)}async closeSignin(e,s=!1){(s||e.target==this.eSignin)&&(this.eSignin?.classList.remove("on"),await h(200),this.eSignin&&(this.eSignin.innerHTML=""))}async login(){const e=this.eEmail?.value??"",s=this.ePassword?.value??"";if(e==""||s=="")return l("Please, fill all fields");const t=new FormData;t.append("email",e),t.append("password",s);const i=await fetch(this.Api+"/login",{method:"POST",body:t});if(i.status!=200)return l("Login failed!");const o=await i.json();return o&&o.id&&o.name&&(location.href="/profile"),l("Login failed!")}}class w{eControls=null;eAffiliates=null;data={registered:[],verified:[],approved:[],enabled:[]};user={id:0,name:"",level:"user",action:"",link:"",code:""};state={on:{title:"Approved",msg:`Do you want to APPROVE this affiliate?
✨ Attention: This will be IRREVERSIBLE! ✨`},off:{title:"Disapproved",msg:`Do you want to DISAPPROVE this affiliate?
✨ Attention: This will be IRREVERSIBLE! ✨`}};Api="";constructor(e){this.Api=e.api,this.eAffiliates=a("#affiliates")}async init(){if(u(),!await this.getAffiliates())return u(!1),!1;this.eControls=a(".control span",!0),this.eControls?.forEach(s=>s.onclick=t=>{const i=g(t,this.state,!1);if(i===!1)return;const o=t.currentTarget;this.setState(o.dataset.id,i=="on")}),a(".aft-plus",!0).forEach(s=>s.onclick=t=>{const i=t.currentTarget.parentElement.parentElement.nextSibling;let o=!i.classList.contains("on");a(".data",!0).forEach(n=>{n.classList.remove("on"),n.previousElementSibling.querySelector(".aft-plus").innerHTML="add"}),i.classList[o?"add":"remove"]("on"),t.currentTarget.innerHTML=o?"remove":"add"}),u(!1)}async getAffiliates(){try{const s=await(await fetch(`${this.Api}/a/affiliates`)).json();if(s){if(s.error==!1&&s.data){const t=s.data;return this.user={id:t.id,name:t.name,level:t.level,action:t.level=="user"?"approved":"enabled",link:t.link,code:t.code},this.data.registered=t.registered??[],this.data.verified=t.verified??[],this.data.approved=t.approved??[],this.data.enabled=t.enabled??[],this.mountAffiliates()}if(s.error==!0&&s.msg&&s.link)return this.mountAffiliates(s.msg,s.link)}}catch{}return l("Error to get affiliates!<br>Try again..."),!1}mountAffiliates(e=!1,s=!1){if(e)return this.eAffiliates&&(this.eAffiliates.innerHTML=`<div class="aft-empty">${e}<br>Share your COLLABOCRATIC invite link to multiply commercial opportunities and scale your interconnected revenue streams: <b>${s}</b>.<br>Be Free, Be Freedom eE!</div>`),!1;const t=this.user.level;a(".user h1").innerText=this.user.name,this.state.on.title=this.user.action;const i=t=="user"?[].concat(this.data.verified,this.data.registered,this.data.approved,this.data.enabled):[].concat(this.data.approved,this.data.verified,this.data.registered,this.data.enabled);let o="<table><tr><th>Name</th><th>Code</th><th>Status</th><th>Action</th></tr>";return i.map(n=>{let d=t=="user"&&n.status=="verified"||t=="adm"&&n.status=="approved"?`<div>${n.status}</div>
				<span class="material-symbols-outlined off" 
					data-status="0" 
					data-id=${n.uid}>toggle_off</span>`:n.status;o+=`<tr>
            	<td>${n.name}</td>
            	<td>${n.code}</td>
            	<td><div class="control">${d}</div></td>
            	<td><span class="material-symbols-outlined aft-plus">add</span></td>
				<tr class="data">
					<td colspan="4">
						<div class="data-content">
							<div class="top">
								<div><label>Phone:</label>${n.phonecode} ${n.phone}</div>
								<div><label>Email:</label>${n.email}</div>
								<div><label>Company:</label>${n.company}</div>
								<div><label>Country:</label>${n.country}</div>
				${n.password!==!1?`<div><label>Password:</label>${n.password}</div>`:""}
							</div>				
							<div class="project">${n.projects.split(",").map(p=>`<span>${p}</span>`).join("")}</div>
						</div>
					</td>
				</tr>`}),this.eAffiliates&&(this.eAffiliates.innerHTML=o+"</table>"),!0}async setState(e,s){const t=new FormData;t.append("id",e),t.append("set",s?"1":"0"),t.append("state",this.user.action);try{const o=await(await fetch(`${this.Api}/a/setstatus`,{method:"POST",body:t})).json();o&&(o.error&&this.init(),l(o.msg,"info"))}catch{this.init(),l("I couldn't access the server!")}}}class b{eControls=null;state={on:{title:"Approved",msg:"Do you want to APPROVE this affiliate?"},off:{title:"Disapproved",msg:"Do you want to DISAPPROVE this affiliate?"}};Api="";constructor(e){this.Api=e.api,this.eControls=a(".control span",!0)}init(){this.eControls?.forEach(e=>e.onclick=s=>{const t=g(s,this.state);console.log("ToggleStatus",t)}),a(".aft-plus",!0).forEach(e=>e.onclick=s=>{const t=s.currentTarget.parentElement.parentElement.nextSibling;let i=!t.classList.contains("on");a(".data",!0).forEach(o=>{o.classList.remove("on"),o.previousElementSibling.querySelector(".aft-plus").innerHTML="add"}),t.classList[i?"add":"remove"]("on"),s.currentTarget.innerHTML=i?"remove":"add"})}}let C=class{eAvatar=null;eProjects=null;eFormCountry=null;eSubmit=null;aftName=null;aftId=null;aftCode=null;user=[];state={on:{title:"I want"},off:{title:"No thanks"}};eCountry=null;eCountryResult=null;countries=[];Api="";constructor(e){this.Api=e.api,this.getCountries()}async init(){this.aftName=a("#aft-name").value,this.aftId=a("#aft-id").value,this.aftCode=a("#aft-code").value,this.eAvatar=a("#aft-avatar"),this.eProjects=a(".selector span",!0),this.eFormCountry=a("#form-country"),this.eSubmit=a("#form-submit"),this.eCountry=a("#form-country"),this.eCountryResult=a("#country-result"),this.eProjects?.forEach(e=>f(s=>g(s,this.state),e)),f(()=>this.focusCountry(),this.eCountry,"focus"),f(()=>this.searchCountry(),this.eCountry,"keyup"),f(e=>this.blurCountry(e),this.eCountry,"blur"),f(()=>this.blurCountryRes(),this.eCountryResult,"blur"),f(()=>this.submit(),this.eSubmit)}async submit(){u();const e=this.validate();if(e===!1)return u(!1);if(this.eProjects?.forEach(t=>{t.dataset.status=="1"&&e.projects.push(t.dataset.name)}),e.projects=e.projects.join(","),e.projects.length==0||e.projects.indexOf("around")==-1)return u(!1),l("Please select at least one project");const s=new FormData;for(let t in e)s.append(t,e[t]);try{const i=await(await fetch(this.Api+"/a/submit",{method:"POST",body:s})).json();if(i&&i.error===!1)return u(!1),this.pageCode(i);i&&i.msg&&(u(!1),l(i.msg))}catch{}u(!1),l("Please try again later.","info")}validate(){const e=a("#form-name"),s=a("#form-email"),t=a("#form-password"),i=a("#form-cpassword"),o=a("#form-country"),n=a("#form-phone"),d=a("#form-company");return e.value?s.value?t.value?t.value.length<8?(l("Your password is longer than 8 characters"),!1):i.value?i.value!==t.value?(l("Passwords do not match"),!1):!o.value||o.dataset.id==""?(l("Please select your country"),!1):!n.value||n.value.length<6?(l("Please enter your phone number"),!1):d.value?{affiliate:this.aftId,name:e.value,email:s.value,password:t.value,country:o.dataset.id,phone:n.value,company:d.value,projects:[]}:(l("Please enter your company"),!1):(l("Please confirm your password"),!1):(l("Please enter your password"),!1):(l("Please enter your email"),!1):(l("Please enter your name"),!1)}focusCountry(){this.eCountry.value="",this.eCountry.dataset.id="",a(".form-input:has(#form-phone) .divput div").innerHTML="code"}searchCountry(){const e=this.eCountry?.value??"";this.eCountryResult?.classList.add("on"),this.eCountryResult.innerHTML="";let s=4;this.countries.map(t=>{if(s>0){const i=t.name.toLowerCase()??t.name;let o=t.native||"";try{o=t.native.toLowerCase()}catch{}if(i.indexOf(e.toLowerCase())>-1||o.indexOf(e.toLowerCase())>-1){s--;const n=r("li",{"data-id":t.id,"data-phone":t.phonecode,"data-name":t.name},`<span>${t.name}</span><span>${t.native}</span>`);f(d=>this.selectCountry(d.currentTarget.dataset),n),this.eCountryResult?.append(n)}}}),this.eCountryResult?.classList[this.eCountryResult?.innerHTML!=""?"add":"remove"]("on")}async selectCountry(e){this.eCountry.value=e.name,this.eCountry.dataset.id=e.id,a(".form-input:has(#form-phone) .divput div").innerHTML=e.phone,this.eCountryResult?.classList.remove("on"),await h(2e3),this.eCountryResult.innerHTML=""}async blurCountry(e){e.target.dataset.id||(e.target.value=""),a(".form-input:has(#form-phone) .divput div").innerHTML="code",await h(400),this.eCountryResult?.classList.remove("on")}blurCountryRes(){this.eCountryResult?.classList.remove("on")}async getCountries(){try{const s=await(await fetch(this.Api+"/a/countries")).json();if(s&&s.length>0)return this.countries=s,!0}catch{}return!1}pageCode(e){a("main .container").innerHTML="";const s=r("h1",{},"Thank you for registering!"),t=r("p",{},"Your personal COLLABOCRATIC Link is: <b>"+e.link+" </b>"),i=r("p",{},"Share it with responsible entrepreneurs, opinion makers, investors and consumers. We have sent a verification code to your email. Please check your spam folder as well."),o=r("p",{},"Enter the code below."),n=r("input",{id:"verify-code",placeholder:"999999"}),d=r("button",{},"Verify"),p=r("div",{class:"code"});p.append(n,d);const m=r("div",{class:"join-verify"});m.append(s,t,i,o,p),a(".container").append(m),f(()=>this.verify(),d)}async verify(){const e=a("#verify-code").value??"",s=new FormData;s.append("code",e),u();try{const t=await fetch(this.Api+"/a/verify",{method:"POST",body:s});if(t.status!=200)return u(!1),l("Verification failed!<br>Try again.");const i=await t.json();if(i&&i.error==!1&&i.verified==!0)return u(!1),this.pageLogin(e)}catch{}u(!1),l("Invalid code!<br>Try again...")}pageLogin(e){a("main .container").innerHTML="";const s=r("h1",{},"Verified successfully!"),t=r("h2",{},"Sign in now!"),i=r("div",{class:"input"},r("label",{},"E-mail"));i.append(r("input",{type:"email",id:"sgn-email",placeholder:"E-mail"}));const o=r("div",{class:"input"},r("label",{},"Password"));o.append(r("input",{type:"password",id:"sgn-password",placeholder:"Password"}));const n=r("button",{id:"sgn-btn-login"},"Login");f(()=>this.login(e),n);const d=r("div",{class:"form"});d.append(i,o,n);const p=r("div",{class:"join-verify",id:"join-verify"});p.append(s,t,d),a(".container").append(p)}async login(e){const s=a("#sgn-email").value??"",t=a("#sgn-password").value??"";if(s==""||t=="")return l("Please, fill all fields");const i=new FormData;i.append("email",s),i.append("password",t),i.append("verification_key",e),u();try{const o=await fetch(this.Api+"/login",{method:"POST",body:i});if(o.status!=200)return u(!1),l("Login failed!");const n=await o.json();n&&n.id&&n.name&&(location.href="/profile")}catch{}return u(!1),l("Login failed!")}};class L{Api="";constructor(e){this.Api=e.api}async init(){f(()=>this.login(),a(".form button"))}async login(){const e=a("#sgn-email").value??"",s=a("#sgn-password").value??"";if(e==""||s=="")return l("Please, fill all fields");const t=a("#sgn-code").value??"";if(t=="")return location.href="/";if(e==""||s=="")return l("Please, fill all fields");const i=new FormData;i.append("email",e),i.append("password",s),i.append("verification_link",t),u();try{const o=await fetch(this.Api+"/login",{method:"POST",body:i});if(o.status!=200)return u(!1),l("Login failed!");const n=await o.json();n&&n.id&&n.name&&(location.href="/profile")}catch{}return u(!1),l("Login failed!")}}const P=new class{path=["/"];page="home";pages=[];api="";constructor(){this.pages.push({name:"Home",path:"/",view:new y(this)}),this.pages.push({name:"Profile",path:"/profile",view:new w(this)}),this.pages.push({name:"Profile2",path:"/profile2",view:new b(this)}),this.pages.push({name:"Join",path:"/c",view:new C(this)}),this.pages.push({name:"Check",path:"/check",view:new L(this)}),this.router()}router(){this.path=document.location.pathname.replace(/^\/|\/$/g,"").split("/"),this.path[0]==""&&(this.path=["/"]);let e=this.pages.findIndex(s=>s.path=="/"+this.path[0].replace(/^\/|\/$/g,""));e<0&&(e=2),this.page=this.pages[e].name,this.pages[e].view&&this.pages[e].view.init(this.path)}};document.addEventListener("astro:page-load",()=>{P.router()});
