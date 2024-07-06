<img align="right" src="https://billrocha.netlify.app/Handmade.png" alt="Hand Made">

# Astro & PHP Application
<< [affiliate.freedomee.com](https://affiliate.freedomee.com) >>

To start local development, open a terminal and type the following (one command at a time):

```sh
git clone https://github.com/pedra/affiliate.git
cd affiliate
npm install
npm run dev
```

Open another terminal and type:

```sh
npm run php
```

Now you have two servers running. One managed by Astro at ```localhost:4321/``` and the other by PHP (which must be installed on your local machine) at ```localhost/```, where it will carry out final tests before deploying to the production server.

### 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── server/
│   └── public/
│   └── php/
│       └── lib/
│       └── module/
│       └── template/
│       └── .env
│       └── router.php
│       └──start.php
├── public/
│   └── .htaccess
│   └── index.php
│   └── < static files: css|js|img|etc... >
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
└── astro.config.mjs
└── postbuild.mjs
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

The ```server/php/``` directory is where the PHP server is written.

The Astro build is directed to the path ```server/public/``` used by the PHP server as a deposit for static files.

### 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./app/public/`    |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
| `npm run php` 			      | Start local PHP server at `localhost`            |

### 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

---

## ☕ Buy me a coffee ?!
**Bill Rocha** | [billrocha.netlify.app](https://billrocha.netlify.app) | prbr@ymail.com

_This software was written by human hands.._ <img align="left" src="https://billrocha.netlify.app/handmade_32.png" alt="Hand Made">
