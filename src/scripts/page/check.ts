import { __, __e, __glass, __report } from "@scripts/utils"

export default class JoinClass {

	Api: string = ''

	constructor(App: any) {
		this.Api = App.api
	}

	async init() {
		__e(() => this.login(), __('.form button'))
	}

	async login() {
		const email = __('#sgn-email').value ?? ''
		const password = __('#sgn-password').value ?? ''
		if (email == '' || password == '') return __report('Please, fill all fields')

		const code = __('#sgn-code').value ?? ''
		if (code == '') return location.href = '/'
		
		if (email == '' || password == '') 
			return __report('Please, fill all fields')
		
		const frm = new FormData()
		frm.append('email', email)
		frm.append('password', password)
		frm.append('verification_link', code)
		
		__glass()
		try {
			const f = await fetch(this.Api + '/login', {
				method: 'POST',
				body: frm
			})

			if (f.status != 200) {
				__glass(false)
				return __report('Login failed!')
			}

			const res = await f.json()
			if (res && res.data && res.data.id && res.data.name)
				location.href = '/profile'
		} catch(e){}

		__glass(false)
		return __report('Login failed!')
	}
}