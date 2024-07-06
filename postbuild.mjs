import { readFileSync, writeFileSync, existsSync, rmdirSync, unlinkSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
// import astroConfig from './astro.config.mjs'

const PUBLIC_DIR = resolve("./server/public")
const TEMPLATE_DIR = resolve("./server/php/template/page")
const PAGES = ['join', 'profile', 'profile2', 'check', 'page404', 'typecode', 'verified']


// Clear template/page
const d = readdirSync(TEMPLATE_DIR)
for(let f of d){
	unlinkSync(resolve(TEMPLATE_DIR, f))
}

/*
	1 - Search for "PAGES" in PUBLIC_DIR
	
	2 - Read the content of 'PAGES[<actual>]/index.html'
	
	3 - Replace all occurrences of [[...]] with <?php echo ... ?>

	4 - Write the content in 'TEMPLATE_DIR/PAGES[<actual>].php'
	
	5 - Delete PUBLIC_DIR/<PAGES[<actual>]>.

*/

PAGES.forEach(page => {
	const dir = `${PUBLIC_DIR}/${page}`
	if (existsSync(dir)) {
		let content = readFileSync(`${dir}/index.html`, 'utf-8')
		content = String(content).replaceAll(/(\[\[(.*?)\]\])/g, e => e.replace('[[', '<?=$').replace(']]', '?>'))
		writeFileSync(`${TEMPLATE_DIR}/${page}.php`, content)

		// delete original directory
		rmdirSync(dir, { recursive: true })
	}
})

// Move /astro/public/index.html to /public/index.php
const index = `${PUBLIC_DIR}/index.html`
if(existsSync(index)) {
	let content = readFileSync(index, 'utf-8')
	content = String(content).replaceAll(/(\[\[(.*?)\]\])/g, e => e.replace('[[', '<?=$').replace(']]', '?>'))
	writeFileSync(`${TEMPLATE_DIR}/index.php`, content)

	// delete original file
	unlinkSync(index, { recursive: true })
}

process.exit(0)