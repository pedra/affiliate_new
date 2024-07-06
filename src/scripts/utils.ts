

// QuerySelector e: element (string: '.class') | a: all elements (boolean: true)
//@ts-ignore
export const __ = (e, a = false) => document[`querySelector${a ? "All" : ""}`](e) || null

// AddEventListener a: action (function) | e: element (string|HTML Node) | v: event type (strng: 'click')
export const __e = (a:any, e:any = 'document', v:string = "click") => {
	let c:any = e != null && 'object' == typeof e ? e :
		(e == 'document' || !e || e == "" || e == null ? document : __(e, true))
	if (c == null || c.length == 0) return false
	return (!c[0] ? [c] : c).forEach((x:any) => x.addEventListener(v, a))
}

// Create Element
export const __c = (type:string = 'div', a:any = {}, content:any = false) => {
	const e = document.createElement(type)
	// @ts-ignore
	for (let x in a) e.setAttribute(x, a[x])
	switch (typeof content) {
		case 'boolean': break
		case 'string': e.innerHTML = content; break
		case 'object': e.appendChild(content); break
	}
	return e
}

// Converte um INTEIRO para a base 36 ou gera um randômico usando a DATA atual (timestamp)
export const __random = (n?: number): string => ('number' == typeof n ? n : new Date().getTime()).toString(36)
export const __randomize = (max: any): number => Math.floor(Math.random() * parseInt(max + 0))

export const __delay = (ms: number) => new Promise(r => setTimeout(r, ms))

export const __glass = (a:boolean = true) => {console.log('Glass:', a ? 'true' : 'false')
	if (a === false) return __('.__glass').classList.remove('active')
	let g = __('.__glass')
	if (!g) {
		let b: any = __c('div', { class: '__glass active' }, __c('div', { class: 'loader'}))
		__('body').appendChild(b)
		return
	}
	g.classList.add('active')
}

// Mostra mensagem na tela
export const __report = async (
	text: string,
	type: string = '',
	extra: any = null,
	tempo: number | any = null
): Promise<void> => {
	extra = extra || null
	tempo = tempo || 2000 + text.length * 40
	type = '__rep-' + ((type == 'info' || type == 'i') ? "info" : (type == 'warn' || type == 'w') ? "warn" : "alert")

	const id = '__'+__random()

	const c = __c('div', { class: `__rep-content ${type}`, id }, 
		__c('span', { class: '__report_i material-symbols-outlined pulse' }, 'close'))
	c.innerHTML += text

	__e(async (e: any):Promise<void> => {
		const x = e.currentTarget
		x.classList.remove('active')
		await __delay(400)
		x.remove()
	}, c)
	
	let r = __('#__report')
	if(!r) {
		r = __c('div', { class: '__report', id: '__report' })
		__('body').appendChild(r)
	}
	r?.appendChild(c)

	await __delay(500)
	__('#'+id).classList.add('active')
	
	await __delay(tempo)
	const e = __('#' + id)
	if (e) {
		e.classList.remove('active')
		await __delay(400)
		e.remove()
	}
}

export const __toggleStatus = (e: any, state: any, reversible: boolean = true): string | boolean => {
	const x = e.currentTarget
	if (x.classList.contains('disabled')) return false

	let a: string = x.innerHTML.replace('toggle_', '') == 'on' ? 'off' : 'on'

	if (state[a].msg) {
		const r = confirm(state[a].msg)
		if (!r) return false
	}

	x.previousElementSibling.innerHTML = state[a].title
	if(!reversible) {
		x.remove()
		return a
	}

	x.innerHTML = `toggle_${a}`
	x.classList[a == 'off' ? 'add' : 'remove']('off')
	x.dataset.status = a == 'on' ? '1' : '0'

	return a
}