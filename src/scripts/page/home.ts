import { __, __e, __c, __delay, __report } from "@scripts/utils"

export default class HomeClass {

	eContainer: HTMLElement | null = null
	eBtnSignin: HTMLElement | null = null

	eSignin: HTMLElement | null = null
	eEmail: HTMLElement | null = null
	ePassword: HTMLElement | null = null
	eBtnLogin: HTMLElement | null = null

	eImage: any = []
	counter: number = 0
	imgs: string[] = [
		"1.jpg",
		"2.jpg",
		"3.jpg",
		"4.jpg",
		"5.jpg",
		"6.jpg",
		"7.jpg",
		"9.jpg",
		"10.jpg"
	]

	Api: string = ''

	constructor(App: any) {
		this.Api = App.api
		this.eContainer = __('#carousel')
		this.eBtnSignin = __('#hom-signin')
		this.eSignin = __('#signin')
	}

	async init () {
		__e(() => this.goSignin(), this.eBtnSignin)
		this.imgs.forEach((v, i) => {
			const img = __c('img', { src: `/img/${v}`, alt: `Image ${i}` })
			this.eImage.push(img)
			this.eContainer?.append(img)
		})
		
		this.carousel()
	}

	async carousel (): Promise<any>{
		await __delay(6000)
		this.counter++
		if (this.counter >= this.imgs.length) this.counter = 0
		const img = this.eImage[this.counter]
		if(img) {
			this.eImage.forEach((v: any) => v.classList.remove('on'))
			img.classList.add('on')
		}
		return this.carousel()
	}

	goSignin () {
		const e = __c('div', {class: "input"}, __c('label', {}, 'E-mail'))
		this.eEmail = __c('input', {type: "email", id: "sgn-email", placeholder: "E-mail"})
		e.append(this.eEmail)

		const p = __c('div', { class: "input" }, __c('label', {}, 'Password'))
		this.ePassword = __c('input', { type: "password", id: "sgn-password", placeholder: "Password" })
		p.append(this.ePassword)

		this.eBtnLogin = __c('button', { id: "sgn-btn-login" }, 'Login')
		__e(() => this.login(), this.eBtnLogin)

		const f = __c('div', { class: "form" })
		f.append(e, p, this.eBtnLogin)
		this.eSignin?.append(f)
		this.eSignin?.classList.add('on')

		__e((e:any) => this.closeSignin(e) , this.eSignin)
	}

	async closeSignin (e:any, force:boolean = false) {
		if(force || e.target == this.eSignin) {
			this.eSignin?.classList.remove('on')
			await __delay(200)
			if (this.eSignin) this.eSignin.innerHTML = ''
		}
	}

	async login() {
		// @ts-ignore
		const email = this.eEmail?.value ?? ''
		//@ts-ignore
		const password = this.ePassword?.value ?? ''

		if(email == '' || password == '') return __report('Please, fill all fields')
		const frm = new FormData()
		frm.append('email', email)
		frm.append('password', password)
		
		const f = await fetch(this.Api + '/login', {
			method: 'POST',
			body: frm
		})
		
		if(f.status != 200) return __report('Login failed!')
		const res = await f.json()
		if(res){
			if(res.id && res.name) {
				location.href = '/profile'
			}
		}
		return __report('Login failed!')
	}
}