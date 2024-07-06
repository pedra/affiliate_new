const n=(c,t=!1)=>document[`querySelector${t?"All":""}`](c)||null,f=(c,t="document",a="click")=>{let e=t!=null&&typeof t=="object"?t:t=="document"||!t||t==""||t==null?document:n(t,!0);return e==null||e.length==0?!1:(e[0]?e:[e]).forEach(s=>s.addEventListener(a,c))},o=(c="div",t={},a=!1)=>{const e=document.createElement(c);for(let s in t)e.setAttribute(s,t[s]);switch(typeof a){case"boolean":break;case"string":e.innerHTML=a;break;case"object":e.appendChild(a);break}return e},v=c=>(typeof c=="number"?c:new Date().getTime()).toString(36),p=c=>new Promise(t=>setTimeout(t,c)),d=(c=!0)=>{if(console.log("Glass:",c?"true":"false"),c===!1)return n(".__glass").classList.remove("active");let t=n(".__glass");if(!t){let a=o("div",{class:"__glass active"},o("div",{class:"loader"}));n("body").appendChild(a);return}t.classList.add("active")},l=async(c,t="",a=null,e=null)=>{a=a||null,e=e||2e3+c.length*40,t="__rep-"+(t=="info"||t=="i"?"info":t=="warn"||t=="w"?"warn":"alert");const s="__"+v(),i=o("div",{class:`__rep-content ${t}`,id:s},o("span",{class:"__report_i material-symbols-outlined pulse"},"close"));i.innerHTML+=c,f(async h=>{const m=h.currentTarget;m.classList.remove("active"),await p(400),m.remove()},i);let r=n("#__report");r||(r=o("div",{class:"__report",id:"__report"}),n("body").appendChild(r)),r?.appendChild(i),await p(500),n("#"+s).classList.add("active"),await p(e);const u=n("#"+s);u&&(u.classList.remove("active"),await p(400),u.remove())},g=(c,t,a=!0)=>{const e=c.currentTarget;if(e.classList.contains("disabled"))return!1;let s=e.innerHTML.replace("toggle_","")=="on"?"off":"on";return t[s].msg&&!confirm(t[s].msg)?!1:(e.previousElementSibling.innerHTML=t[s].title,a?(e.innerHTML=`toggle_${s}`,e.classList[s=="off"?"add":"remove"]("off"),e.dataset.status=s=="on"?"1":"0",s):(e.remove(),s))};class y{eContainer=null;eBtnSignin=null;eSignin=null;eEmail=null;ePassword=null;eBtnLogin=null;eImage=[];counter=0;imgs=["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","9.jpg","10.jpg"];Api="";constructor(t){this.Api=t.api,this.eContainer=n("#carousel"),this.eBtnSignin=n("#hom-signin"),this.eSignin=n("#signin")}async init(){f(()=>this.goSignin(),this.eBtnSignin),this.imgs.forEach((t,a)=>{const e=o("img",{src:`/img/${t}`,alt:`Image ${a}`});this.eImage.push(e),this.eContainer?.append(e)}),this.carousel()}async carousel(){await p(6e3),this.counter++,this.counter>=this.imgs.length&&(this.counter=0);const t=this.eImage[this.counter];return t&&(this.eImage.forEach(a=>a.classList.remove("on")),t.classList.add("on")),this.carousel()}goSignin(){const t=o("div",{class:"input"},o("label",{},"E-mail"));this.eEmail=o("input",{type:"email",id:"sgn-email",placeholder:"E-mail"}),t.append(this.eEmail);const a=o("div",{class:"input"},o("label",{},"Password"));this.ePassword=o("input",{type:"password",id:"sgn-password",placeholder:"Password"}),a.append(this.ePassword),this.eBtnLogin=o("button",{id:"sgn-btn-login"},"Login"),f(()=>this.login(),this.eBtnLogin);const e=o("div",{class:"form"});e.append(t,a,this.eBtnLogin),this.eSignin?.append(e),this.eSignin?.classList.add("on"),f(s=>this.closeSignin(s),this.eSignin)}async closeSignin(t,a=!1){(a||t.target==this.eSignin)&&(this.eSignin?.classList.remove("on"),await p(200),this.eSignin&&(this.eSignin.innerHTML=""))}async login(){const t=this.eEmail?.value??"",a=this.ePassword?.value??"";if(t==""||a=="")return l("Please, fill all fields");const e=new FormData;e.append("email",t),e.append("password",a);const s=await fetch(this.Api+"/login",{method:"POST",body:e});if(s.status!=200)return l("Login failed!");const i=await s.json();return i&&i.data&&i.data.id&&i.data.name&&(location.href="/profile"),l("Login failed!")}}class w{eControls=null;eAffiliates=null;data={registered:[],verified:[],approved:[],enabled:[]};user={id:0,name:"",level:"user",action:""};state={on:{title:"Approved",msg:`Do you want to APPROVE this affiliate?
✨ Attention: This will be IRREVERSIBLE! ✨`},off:{title:"Disapproved",msg:`Do you want to DISAPPROVE this affiliate?
✨ Attention: This will be IRREVERSIBLE! ✨`}};Api="";constructor(t){this.Api=t.api,this.eAffiliates=n("#affiliates")}async init(){if(d(),!await this.getAffiliates())return d(!1),!1;this.eControls=n(".control span",!0),this.eControls?.forEach(a=>a.onclick=e=>{const s=g(e,this.state,!1);if(s===!1)return;const i=e.currentTarget;this.setState(i.dataset.id,s=="on")}),n(".aft-plus",!0).forEach(a=>a.onclick=e=>{const s=e.currentTarget.parentElement.parentElement.nextSibling;let i=!s.classList.contains("on");n(".data",!0).forEach(r=>{r.classList.remove("on"),r.previousElementSibling.querySelector(".aft-plus").innerHTML="add"}),s.classList[i?"add":"remove"]("on"),e.currentTarget.innerHTML=i?"remove":"add"}),d(!1)}async getAffiliates(){try{const a=await(await fetch(`${this.Api}/a/affiliates`)).json();if(a&&a.error==!1&&a.data){if(a.data.error==!1&&a.data.data){const e=a.data.data;return this.user={id:e.id,name:e.name,level:e.level,action:e.level=="user"?"approved":"enabled"},this.data.registered=e.registered??[],this.data.verified=e.verified??[],this.data.approved=e.approved??[],this.data.enabled=e.enabled??[],this.mountAffiliates()}if(a.data.error==!0&&a.data.msg)return this.mountAffiliates(a.data.msg)}}catch{}return l("Error to get affiliates!<br>Try again..."),!1}mountAffiliates(t=!1){if(t)return this.eAffiliates&&(this.eAffiliates.innerHTML=`<div class="aft-empty">${t}</div>`),!1;const a=this.user.level;n(".user h1").innerText=this.user.name,this.state.on.title=this.user.action;const e=a=="user"?[].concat(this.data.verified,this.data.registered,this.data.approved,this.data.enabled):[].concat(this.data.approved,this.data.verified,this.data.registered,this.data.enabled);let s="<table><tr><th>Name</th><th>Code</th><th>Status</th><th>Action</th></tr>";return e.map(i=>{let r=a=="user"&&i.status=="verified"||a=="adm"&&i.status=="approved"?`<div>${i.status}</div>
				<span class="material-symbols-outlined off" 
					data-status="0" 
					data-id=${i.uid}>toggle_off</span>`:i.status;s+=`<tr>
            	<td>${i.name}</td>
            	<td>${i.code}</td>
            	<td><div class="control">${r}</div></td>
            	<td><span class="material-symbols-outlined aft-plus">add</span></td>
				<tr class="data">
					<td colspan="4">
						<div class="data-content">
							<div class="top">
								<div><label>Phone:</label>${i.phonecode} ${i.phone}</div>
								<div><label>Email:</label>${i.email}</div>
								<div><label>Company:</label>${i.company}</div>
								<div><label>Country:</label>${i.country}</div>
				${i.password!==!1?`<div><label>Password:</label>${i.password}</div>`:""}
							</div>				
							<div class="project">${i.projects.split(",").map(u=>`<span>${u}</span>`).join("")}</div>
						</div>
					</td>
				</tr>`}),this.eAffiliates&&(this.eAffiliates.innerHTML=s+"</table>"),!0}async setState(t,a){const e=new FormData;e.append("id",t),e.append("set",a?"1":"0"),e.append("state",this.user.action);try{const i=await(await fetch(`${this.Api}/a/setstatus`,{method:"POST",body:e})).json();i&&i.error==!1&&i.data&&(i.data.error&&this.init(),l(i.data.msg,"info"))}catch{this.init(),l("I couldn't access the server!")}}}class b{eControls=null;state={on:{title:"Approved",msg:"Do you want to APPROVE this affiliate?"},off:{title:"Disapproved",msg:"Do you want to DISAPPROVE this affiliate?"}};Api="";constructor(t){this.Api=t.api,this.eControls=n(".control span",!0)}init(){this.eControls?.forEach(t=>t.onclick=a=>{const e=g(a,this.state);console.log("ToggleStatus",e)}),n(".aft-plus",!0).forEach(t=>t.onclick=a=>{const e=a.currentTarget.parentElement.parentElement.nextSibling;let s=!e.classList.contains("on");n(".data",!0).forEach(i=>{i.classList.remove("on"),i.previousElementSibling.querySelector(".aft-plus").innerHTML="add"}),e.classList[s?"add":"remove"]("on"),a.currentTarget.innerHTML=s?"remove":"add"})}}let C=class{eAvatar=null;eProjects=null;eFormCountry=null;eSubmit=null;aftName=null;aftId=null;aftCode=null;user=[];state={on:{title:"I want"},off:{title:"No thanks"}};eCountry=null;eCountryResult=null;countries=[];Api="";constructor(t){this.Api=t.api,this.getCountries()}async init(){this.aftName=n("#aft-name").value,this.aftId=n("#aft-id").value,this.aftCode=n("#aft-code").value,this.eAvatar=n("#aft-avatar"),this.eProjects=n(".selector span",!0),this.eFormCountry=n("#form-country"),this.eSubmit=n("#form-submit"),this.eCountry=n("#form-country"),this.eCountryResult=n("#country-result"),this.eProjects?.forEach(t=>f(a=>g(a,this.state),t)),f(()=>this.focusCountry(),this.eCountry,"focus"),f(()=>this.searchCountry(),this.eCountry,"keyup"),f(t=>this.blurCountry(t),this.eCountry,"blur"),f(()=>this.blurCountryRes(),this.eCountryResult,"blur"),f(()=>this.submit(),this.eSubmit)}async submit(){d();const t=this.validate();if(t===!1)return d(!1);if(this.eProjects?.forEach(e=>{e.dataset.status=="1"&&t.projects.push(e.dataset.name)}),t.projects=t.projects.join(","),t.projects.length==0||t.projects.indexOf("around")==-1)return d(!1),l("Please select at least one project");const a=new FormData;for(let e in t)a.append(e,t[e]);try{const s=await(await fetch(this.Api+"/a/submit",{method:"POST",body:a})).json();if(s&&s.error===!1&&s.data&&s.data.error===!1)return d(!1),this.pageCode(s.data);s&&s.data&&s.data.msg&&(d(!1),l(s.data.msg))}catch{}d(!1),l("Please try again later.","info")}validate(){const t=n("#form-name"),a=n("#form-email"),e=n("#form-password"),s=n("#form-cpassword"),i=n("#form-country"),r=n("#form-phone"),u=n("#form-company");return t.value?a.value?e.value?e.value.length<8?(l("Your password is longer than 8 characters"),!1):s.value?s.value!==e.value?(l("Passwords do not match"),!1):!i.value||i.dataset.id==""?(l("Please select your country"),!1):!r.value||r.value.length<6?(l("Please enter your phone number"),!1):u.value?{affiliate:this.aftId,name:t.value,email:a.value,password:e.value,country:i.dataset.id,phone:r.value,company:u.value,projects:[]}:(l("Please enter your company"),!1):(l("Please confirm your password"),!1):(l("Please enter your password"),!1):(l("Please enter your email"),!1):(l("Please enter your name"),!1)}focusCountry(){this.eCountry.value="",this.eCountry.dataset.id="",n(".form-input:has(#form-phone) .divput div").innerHTML="code"}searchCountry(){const t=this.eCountry?.value??"";this.eCountryResult?.classList.add("on"),this.eCountryResult.innerHTML="";let a=4;this.countries.map(e=>{if(a>0){const s=e.name.toLowerCase()??e.name;let i=e.native||"";try{i=e.native.toLowerCase()}catch{}if(s.indexOf(t.toLowerCase())>-1||i.indexOf(t.toLowerCase())>-1){a--;const r=o("li",{"data-id":e.id,"data-phone":e.phonecode,"data-name":e.name},`<span>${e.name}</span><span>${e.native}</span>`);f(u=>this.selectCountry(u.currentTarget.dataset),r),this.eCountryResult?.append(r)}}}),this.eCountryResult?.classList[this.eCountryResult?.innerHTML!=""?"add":"remove"]("on")}async selectCountry(t){this.eCountry.value=t.name,this.eCountry.dataset.id=t.id,n(".form-input:has(#form-phone) .divput div").innerHTML=t.phone,this.eCountryResult?.classList.remove("on"),await p(2e3),this.eCountryResult.innerHTML=""}async blurCountry(t){t.target.dataset.id||(t.target.value=""),n(".form-input:has(#form-phone) .divput div").innerHTML="code",await p(400),this.eCountryResult?.classList.remove("on")}blurCountryRes(){this.eCountryResult?.classList.remove("on")}async getCountries(){try{const a=await(await fetch(this.Api+"/a/countries")).json();if(a&&a.error==!1&&a.data)return this.countries=a.data,!0}catch{}return!1}pageCode(t){n("main .container").innerHTML="";const a=o("h1",{},"Thank you for registering!"),e=o("p",{},"Your personal sharing link is: <b>"+t.link+" </b>"),s=o("p",{},"-- Share it all over the planet!"),i=o("p",{},"We have sent a verification code to your email.<br>Enter the code below:"),r=o("input",{id:"verify-code",placeholder:"999999"}),u=o("button",{},"Verify"),h=o("div",{class:"code"});h.append(r,u);const m=o("div",{class:"join-verify"});m.append(a,e,s,i,h),n(".container").append(m),f(()=>this.verify(),u)}async verify(){const t=n("#verify-code").value??"",a=new FormData;a.append("code",t),d();try{const e=await fetch(this.Api+"/a/verify",{method:"POST",body:a});if(e.status!=200)return d(!1),l("Verification failed!<br>Try again.");const s=await e.json();if(s&&s.error==!1&&s.data&&s.data.verified==!0)return d(!1),this.pageLogin(t)}catch{}d(!1),l("Invalid code!<br>Try again...")}pageLogin(t){n("main .container").innerHTML="";const a=o("h1",{},"Verified successfully!"),e=o("h2",{},"Sign in now!"),s=o("div",{class:"input"},o("label",{},"E-mail"));s.append(o("input",{type:"email",id:"sgn-email",placeholder:"E-mail"}));const i=o("div",{class:"input"},o("label",{},"Password"));i.append(o("input",{type:"password",id:"sgn-password",placeholder:"Password"}));const r=o("button",{id:"sgn-btn-login"},"Login");f(()=>this.login(t),r);const u=o("div",{class:"form"});u.append(s,i,r);const h=o("div",{class:"join-verify",id:"join-verify"});h.append(a,e,u),n(".container").append(h)}async login(t){const a=n("#sgn-email").value??"",e=n("#sgn-password").value??"";if(a==""||e=="")return l("Please, fill all fields");const s=new FormData;s.append("email",a),s.append("password",e),s.append("verification_key",t),d();try{const i=await fetch(this.Api+"/login",{method:"POST",body:s});if(i.status!=200)return d(!1),l("Login failed!");const r=await i.json();r&&r.data&&r.data.id&&r.data.name&&(location.href="/profile")}catch{}return d(!1),l("Login failed!")}};class L{Api="";constructor(t){this.Api=t.api}async init(){f(()=>this.login(),n(".form button"))}async login(){const t=n("#sgn-email").value??"",a=n("#sgn-password").value??"";if(t==""||a=="")return l("Please, fill all fields");const e=n("#sgn-code").value??"";if(e=="")return location.href="/";if(t==""||a=="")return l("Please, fill all fields");const s=new FormData;s.append("email",t),s.append("password",a),s.append("verification_link",e),d();try{const i=await fetch(this.Api+"/login",{method:"POST",body:s});if(i.status!=200)return d(!1),l("Login failed!");const r=await i.json();r&&r.data&&r.data.id&&r.data.name&&(location.href="/profile")}catch{}return d(!1),l("Login failed!")}}const P=new class{path=["/"];page="home";pages=[];api="http://localhost";constructor(){this.pages.push({name:"Home",path:"/",view:new y(this)}),this.pages.push({name:"Profile",path:"/profile",view:new w(this)}),this.pages.push({name:"Profile2",path:"/profile2",view:new b(this)}),this.pages.push({name:"Join",path:"/c",view:new C(this)}),this.pages.push({name:"Check",path:"/check",view:new L(this)}),this.router()}router(){this.path=document.location.pathname.replace(/^\/|\/$/g,"").split("/"),this.path[0]==""&&(this.path=["/"]);let t=this.pages.findIndex(a=>a.path=="/"+this.path[0].replace(/^\/|\/$/g,""));t<0&&(t=2),this.page=this.pages[t].name,this.pages[t].view&&this.pages[t].view.init(this.path)}};document.addEventListener("astro:page-load",()=>{P.router()});
