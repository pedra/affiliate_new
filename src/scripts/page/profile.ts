import { __, __e, __c, __delay, __glass, __report, __toggleStatus } from "@scripts/utils"

export default class ProfileClass {

	eControls: [HTMLSpanElement] | null = null
	eAffiliates: HTMLDivElement | null = null

	data = {
		registered: [],
		verified: [],
		approved: [],
		enabled: []
	}

	user = {
		id: 0,
		name: '',
		level: 'user',
		action: '',
		link: '',
		code: '',
	}
	
	state = {
		on: { title: 'Approved', 
		msg: 'Do you want to APPROVE this affiliate?\n✨ Attention: This will be IRREVERSIBLE! ✨'},
		off: { title: 'Disapproved', msg: 'Do you want to DISAPPROVE this affiliate?\n✨ Attention: This will be IRREVERSIBLE! ✨'}
	}

	Api: string = ''

	constructor(App: any) {
		this.Api = App.api
		this.eAffiliates = __('#affiliates')
	}

	async init() {
		__glass()
		const g = await this.getAffiliates()
		if(!g) {
			__glass(false)
			return false
		}

		this.eControls = __('.control span', true)
		this.eControls?.forEach(
			(a: any) => a.onclick =
				(e: any) => {
					const res = __toggleStatus(e, this.state, false)
					if(res === false) return
					const t = e.currentTarget
					this.setState(
						t.dataset.id,
						res == 'on' ? true : false)})
		
		__('.aft-plus', true).forEach((a: any) => a.onclick = (e: any) => {
			const t = e.currentTarget.parentElement.parentElement.nextSibling
			let c = t.classList.contains('on') ? false : true
			__('.data', true).forEach((d: any) => {
				d.classList.remove('on')
				d.previousElementSibling.querySelector('.aft-plus').innerHTML = 'add'
			})
			t.classList[c ? 'add' : 'remove']('on')
			e.currentTarget.innerHTML = c ? 'remove' : 'add'
		})

		__glass(false)
	}

	async getAffiliates() {		
		try{
			const f = await fetch(`${this.Api}/a/affiliates`)
			const j = await f.json()

			if( j ){
				if(j.error == false && j.data){
					const d = j.data
					this.user = {
						id: d.id,
						name: d.name,
						level: d.level,
						action: d.level == 'user' ? 'approved' : 'enabled',
						link: d.link,
						code: d.code
					}
					this.data.registered = d.registered ?? []
					this.data.verified = d.verified ?? []
					this.data.approved = d.approved ?? []
					this.data.enabled = d.enabled ?? []

					return this.mountAffiliates()
				}	
				if(j.error == true && j.msg && j.link) return this.mountAffiliates(j.msg, j.link)
			}
		} catch(e){}

		__report('Error to get affiliates!<br>Try again...')
		return false
	}

	mountAffiliates(msg: string | boolean = false, link: string | boolean = false) {
		if (msg) {
			if (this.eAffiliates) this.eAffiliates.innerHTML = `<div class="aft-empty">${msg}<br>Share your COLLABOCRATIC invite link to multiply commercial opportunities and scale your interconnected revenue streams: <b>${link}</b>.<br>Be Free, Be Freedom eE!</div>`
			return false
		}

		const level = this.user.level 		

		__('.user h1').innerText = this.user.name
		this.state.on.title = this.user.action		

		// Priority ...
		const d = level == 'user' ? 
			[].concat(
				this.data.verified, 
				this.data.registered, 
				this.data.approved,
				this.data.enabled
			) : 			
			[].concat(
				this.data.approved, 
				this.data.verified, 
				this.data.registered, 
				this.data.enabled
			)

		let o = "<table><tr><th>Name</th><th>Code</th><th>Status</th><th>Action</th></tr>"
		d.map((a: any) => {
			let status = (level == 'user' && a.status == 'verified') ||
				(level == 'adm' && a.status == 'approved') ? `<div>${a.status}</div>
				<span class="material-symbols-outlined off" 
					data-status="0" 
					data-id=${a.uid}>toggle_off</span>` : a.status

			o += `<tr>
            	<td>${a.name}</td>
            	<td>${a.code}</td>
            	<td><div class="control">${status}</div></td>
            	<td><span class="material-symbols-outlined aft-plus">add</span></td>
				<tr class="data">
					<td colspan="4">
						<div class="data-content">
							<div class="top">
								<div><label>Phone:</label>${a.phonecode} ${a.phone}</div>
								<div><label>Email:</label>${a.email}</div>
								<div><label>Company:</label>${a.company}</div>
								<div><label>Country:</label>${a.country}</div>
				${a.password !== false ? `<div><label>Password:</label>${a.password}</div>` : ""}
							</div>				
							<div class="project">${a.projects.split(',').map((a: any) => `<span>${a}</span>`).join('') }</div>
						</div>
					</td>
				</tr>`
		})

		if(this.eAffiliates) this.eAffiliates.innerHTML = o + '</table>'
		return true
	}

	async setState(id: any, set: boolean) {
		const frm = new FormData()
		frm.append('id', id)
		frm.append('set', set ? '1' : '0')
		frm.append('state', this.user.action)
		try {
			const f = await fetch(`${this.Api}/a/setstatus`, {
				method: 'POST',
				body: frm
			})
			const j = await f.json()
			if(j) {
				if(j.error) this.init()
				__report(j.msg, 'info')
			}
		} catch(e){
			this.init()
			__report("I couldn't access the server!")
		}
	}
}