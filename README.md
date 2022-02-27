# Lei Zhang's Personal Portfolio

This site is built with

- [Next.js](https://nextjs.org/)
- [MDX](https://mdxjs.com/)
- [Prism themes](https://github.com/PrismJS/prism-themes)
- [Contentlayer](https://www.contentlayer.dev)
- [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)

## Versions

- v1.0.0: [Source code](https://github.com/PassionZale/lovchun.com-next)

## Getting Started

First, install the dependencies

```bash
npm install
```

and run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

#### `npm run dev`

to start development server

#### `npm run start`

to start production server

#### `npm run build`

to generate production build. The built assets will be in under `/.next` directory.

#### `npm run export`

to export the app to static HTML, which can be run standalone without the need of a Node.js server.

#### `npm run deploy`

to deploy the static app from `npm run export` to github pages. The deployment is triggered by merging into `gh-pages` branch.