import { __, __e, __c, __delay, __glass, __report, __toggleStatus } from "@scripts/utils"

export default class JoinClass {

	eAvatar: HTMLImageElement | null = null
	eProjects: [HTMLSpanElement] | null = null
	
	eFormCountry: HTMLInputElement | null = null
	eSubmit: HTMLButtonElement | null = null
	
	aftName: string | null = null
	aftId: string | null = null
	aftCode: string | null = null

	user = []
	state = {
		on: { title: 'I want' },
		off: { title: 'No thanks' }
	}
	
	eCountry: HTMLInputElement | null = null
	eCountryResult: HTMLDivElement | null = null
	countries = []

	Api: string = ''

	constructor(App: any) {
		this.Api = App.api
		this.getCountries()
	}

	async init() {
		this.aftName = __('#aft-name').value
		this.aftId = __('#aft-id').value
		this.aftCode = __('#aft-code').value

		this.eAvatar = __('#aft-avatar')
		this.eProjects = __('.selector span', true)

		this.eFormCountry = __('#form-country')
		this.eSubmit = __('#form-submit')

		this.eCountry = __('#form-country')
		this.eCountryResult = __('#country-result')

		this.eProjects?.forEach((a: any) => __e((e: any) => __toggleStatus(e, this.state), a))
	
		__e(() => this.focusCountry(), this.eCountry, 'focus')
		__e(() => this.searchCountry(), this.eCountry, 'keyup')
		__e((e: any) => this.blurCountry(e), this.eCountry, 'blur')
		__e(() => this.blurCountryRes(), this.eCountryResult, 'blur')
		__e(()=>this.submit(), this.eSubmit)
	}

	// SUBMIT ------------------------------------------------------------------
	async submit() {
		__glass()
		const data = this.validate()
		if (data === false) return __glass(false)

		this.eProjects?.forEach((a: any) => { if(a.dataset.status == '1') data.projects.push(a.dataset.name) })
		data.projects = data.projects.join(',')
		
		if (data.projects.length == 0) {
			__glass(false)
			return __report('Please select at least one project')
		}
		
		const frm = new FormData()
		for(let i in data){
			frm.append(i, data[i])
		}

		try{
			const f = await fetch(this.Api + '/a/submit', { method: 'POST', body: frm })
			const j = await f.json()
			if(j && j.error === false){
				__glass(false)
				return this.pageCode(j)
			}

			if(j && j.msg) {
				__glass(false)
				__report(j.msg)
			}

		}catch(e){}

		__glass(false)
		__report('Please try again later.', 'info')

	}

	validate(): any | boolean {
		const name = __('#form-name')
		const email = __('#form-email')
		const password = __('#form-password')
		const cpassword = __('#form-cpassword')
		const country = __('#form-country')
		const phone = __('#form-phone')
		const company = __('#form-company')

		if (!name.value) {
			__report('Please enter your name')
			return false
		}
		if (!email.value) {
			__report('Please enter your email')
			return false
		}

		if (!password.value) {
			__report('Please enter your password')
			return false
		}
		if (password.value.length < 8) {
			__report('Your password is longer than 8 characters')
			return false
		}
		if (!cpassword.value) {
			__report('Please confirm your password')
			return false
		}
		if (cpassword.value !== password.value) {
			__report('Passwords do not match')
			return false
		}

		if (!country.value) {
			__report('Please select your country')
			return false
		}
		if (country.dataset.id == "") {
			__report('Please select your country')
			return false
		}

		if (!phone.value || phone.value.length < 6) {
			__report('Please enter your phone number')
			return false
		}

		if (!company.value) {
			__report('Please enter your company')
			return false
		}

		return {
			affiliate: this.aftId,
			name: name.value,
			email: email.value,
			password: password.value,
			country: country.dataset.id,
			phone: phone.value,
			company: company.value,
			projects: []
		}
	}

	// COUNTRY -----------------------------------------------------------------
	focusCountry() {
		// @ts-ignore
		this.eCountry.value = ''
		// @ts-ignore
		this.eCountry.dataset.id = ''
		__('.form-input:has(#form-phone) .divput div').innerHTML = 'code'
	}

	searchCountry() {
		const t = this.eCountry?.value ?? ''
		this.eCountryResult?.classList.add('on')
		// @ts-ignore
		this.eCountryResult.innerHTML = ''

		let len = 4
		this.countries.map((a: any) => {
			if(len > 0) { 
			const na = a.name.toLowerCase() ?? a.name
			let nat = a.native || ''
			try{nat = a.native.toLowerCase()} catch(e){}

				if (na.indexOf(t.toLowerCase()) > -1 ||
					nat.indexOf(t.toLowerCase()) > -1) {
					len --
					const l = __c('li', { 'data-id': a.id, 'data-phone': a.phonecode, 'data-name': a.name }, `<span>${a.name}</span><span>${a.native}</span>`)
					__e((e:any) => this.selectCountry(e.currentTarget.dataset), l) 
					this.eCountryResult?.append(l)
				}
			}
		})

		this.eCountryResult?.classList[this.eCountryResult?.innerHTML != '' ? 'add' : 'remove']('on')
	}

	async selectCountry(d:any) {
		// @ts-ignore
		this.eCountry.value = d.name
		// @ts-ignore
		this.eCountry.dataset.id = d.id

		__('.form-input:has(#form-phone) .divput div').innerHTML = d.phone

		this.eCountryResult?.classList.remove('on')
		await __delay(2000)
		// @ts-ignore
		this.eCountryResult.innerHTML = ''
	}

	async blurCountry(e: any) {
		if(!e.target.dataset.id) e.target.value = ''
		__('.form-input:has(#form-phone) .divput div').innerHTML = 'code'

		await __delay(400)
		this.eCountryResult?.classList.remove('on')
	}

	blurCountryRes() {
		this.eCountryResult?.classList.remove('on')
	}

	async getCountries(){
		try{
			const f = await fetch(this.Api + '/a/countries')
			const j = await f.json()
		
			if(j && j.length > 0){
				this.countries = j
				return true
			}
		} catch(e){}
		return false
	}

	// PAGE CODE ---------------------------------------------------------------
	pageCode(data: any) {
		__('main .container').innerHTML = ''

		const h1 = __c('h1', {}, 'Thank you for registering!')
		const p1 = __c('p', {}, 'Your personal COLLABOCRATIC Link is: <b>' + data.link + ' </b>')
		const p2 = __c('p', {}, 'Share it with responsible entrepreneurs, opinion makers, investors and consumers.')
		const p3 = __c('p', {}, 'We have sent a verification code to your email. Please check your spam folder as well.')
		const p4 = __c('p', {}, 'Enter the code below.')

		const ip = __c('input', {id: 'verify-code', placeholder: '999999'})
		const bt = __c('button', {}, 'Verify')
		const ci = __c('div', { class: "code" })
		ci.append(ip, bt)

		const jv = __c('div', { class: "join-verify" })
		jv.append(h1, p1, p2, p3, p4, ci)
		 __('.container').append(jv)

		__e(() => this.verify(), bt)
	}

	async verify() {

		const code = __('#verify-code').value ?? ''

		const frm = new FormData()
		frm.append('code', code)

		__glass()
		try{
			const f = await fetch(this.Api + '/a/verify', {
				method: 'POST',
				body: frm
			})

			if (f.status != 200) {
				__glass(false)
				return __report('Verification failed!<br>Try again.')
			}

			const j = await f.json()
			if(	j && 
				j.error == false && 
				j.verified == true ){
				__glass(false)
				return this.pageLogin(code)
			}
		} catch(e){}

		__glass(false)
		__report('Invalid code!<br>Try again...')
	}

	// PAGE LOGIN --------------------------------------------------------------
	pageLogin(code:string){
		__('main .container').innerHTML = ''

		const h1 = __c('h1', {}, 'Verified successfully!')
		const h2 = __c('h2', {}, 'Sign in now!')

		// form login
		const e = __c('div', { class: "input" }, __c('label', {}, 'E-mail'))
		e.append(__c('input', { type: "email", id: "sgn-email", placeholder: "E-mail" }))

		const p = __c('div', { class: "input" }, __c('label', {}, 'Password'))
		p.append(__c('input', { type: "password", id: "sgn-password", placeholder: "Password" }))

		const button = __c('button', { id: "sgn-btn-login" }, 'Login')
		__e(() => this.login(code), button)

		const f = __c('div', { class: "form" })
		f.append(e, p, button)

		const jv = __c('div', { class: "join-verify", id: "join-verify" })
		jv.append(h1, h2, f)
		__('.container').append(jv)	
	}

	async login(code:string) {

		const email = __('#sgn-email').value ?? ''
		const password = __('#sgn-password').value ?? ''

		if (email == '' || password == '') return __report('Please, fill all fields')
		const frm = new FormData()
		frm.append('email', email)
		frm.append('password', password)
		frm.append('verification_key', code)

		__glass()
		try{
			const f = await fetch(this.Api + '/login', {
				method: 'POST',
				body: frm
			})

			if (f.status != 200) {
				__glass(false)
				return __report('Login failed!')
			}

			const res = await f.json()
			if (res && res.id && res.name) {
				location.href = '/profile'
			}
		} catch(e){}

		__glass(false)
		return __report('Login failed!')
	}
}