import { __, __e, __c, __delay, __report, __toggleStatus } from "@scripts/utils"

export default class Profile2Class {

	eControls: [HTMLSpanElement] | null = null
	
	state = {
		on: { title: 'Approved', msg: 'Do you want to APPROVE this affiliate?'},
		off: { title: 'Disapproved', msg: 'Do you want to DISAPPROVE this affiliate?'}
	}

	Api: string = ''

	constructor(App: any) {
		this.Api = App.api
		this.eControls = __('.control span', true)
	}

	init() {
		this.eControls?.forEach(
			(a: any) => a.onclick =
				(e: any) => {
					const res = __toggleStatus(e, this.state)
					console.log("ToggleStatus", res)
				})
		
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
	}
}