import HomeClass from "@scripts/page/home"
import ProfileClass from '@scripts/page/profile'
import Profile2Class from '@scripts/page/profile2'
import JoinClass from '@scripts/page/join'
import CheckClass from '@scripts/page/check'

const App = new class AppClass {

	path: string[] = ['/']
	page: string = 'home'
	pages: {
		name: string,
		path: string,
		view: any,
	}[] = []
	api: string = ''

	constructor() {
		this.pages.push({ name: 'Home', path: '/', view: new HomeClass(this) })
		this.pages.push({ name: 'Profile', path: '/profile', view: new ProfileClass(this) })
		this.pages.push({ name: 'Profile2', path: '/profile2', view: new Profile2Class(this) })
		this.pages.push({ name: 'Join', path: '/c', view: new JoinClass(this) })
		this.pages.push({ name: 'Check', path: '/check', view: new CheckClass(this) })
		this.router()
	}

	router() {
		this.path = document.location.pathname.replace(/^\/|\/$/g, '').split('/')
		if (this.path[0] == '') this.path = ['/']

		let i = this.pages.findIndex(v => v.path == '/' + this.path[0].replace(/^\/|\/$/g, ''))
		if (i < 0) 
			i = 2 //return false

		this.page = this.pages[i].name
		this.pages[i].view ? this.pages[i].view.init(this.path) : null

		//console.log(`App::router started!\nPath: ${this.path}\nPage: ${this.page}`)
		// Service Worker install
		//'serviceWorker' in navigator && navigator.serviceWorker.register('/sw.js')
	}
}

export default App
document.addEventListener("astro:page-load", () => {
	App.router()
	//console.log('APP START ✨')

	// Service Worker install
	//'serviceWorker' in navigator && navigator.serviceWorker.register('/sw.js')
})


// Extras ...
// document.addEventListener("load", () => App.router())
// document.addEventListener("astro:before-preparation", e => console.log('astro:before-preparation', e))
// document.addEventListener("astro:after-preparation", e => console.log('astro:after-preparation', e))
// document.addEventListener("astro:before-swap", e => console.log('astro:before-swap', e))
// document.addEventListener("astro:after-swap", e => console.log('astro:after-swap', e))
// document.addEventListener("astro:after-swap", e => console.log('astro:after-swap', e))