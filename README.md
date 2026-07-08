# Welcome to React Router + Cloudflare Workers!

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/react-router-starter-template)

![React Router Starter Template Preview](https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/bfdc2f85-e5c9-4c92-128b-3a6711249800/public)

<!-- dash-content-start -->

A modern, production-ready template for building full-stack React applications using [React Router](https://reactrouter.com/) and the [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/).

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)
- 🔎 Built-in Observability to monitor your Worker
<!-- dash-content-end -->

## Getting Started

Outside of this repo, you can start a new project with this template using [C3](https://developers.cloudflare.com/pages/get-started/c3/) (the `create-cloudflare` CLI):

```bash
npm create cloudflare@latest -- --template=cloudflare/templates/react-router-starter-template
```

A live public deployment of this template is available at [https://react-router-starter-template.templates.workers.dev](https://react-router-starter-template.templates.workers.dev)

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Typegen

Generate types for your Cloudflare bindings in `wrangler.json`:

```sh
npm run typegen
```

## Building for Production

Create a production build:

```bash
npm run build
```

## Previewing the Production Build

Preview the production build locally:

```bash
npm run preview
```

## Deployment

If you don't have a Cloudflare account, [create one here](https://dash.cloudflare.com/sign-up)! Go to your [Workers dashboard](https://dash.cloudflare.com/?to=%2F%3Aaccount%2Fworkers-and-pages) to see your [free custom Cloudflare Workers subdomain](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/) on `*.workers.dev`.

Once that's done, you can build your app:

```sh
npm run build
```

And deploy it:

```sh
npm run deploy
```

To deploy a preview URL:

```sh
npx wrangler versions upload
```

You can then promote a version to production after verification or roll it out progressively.

```sh
npx wrangler versions deploy
```

## Project Structure 

mycloud/
├── app/
│   ├── root.tsx                 # মূল রুট কম্পোনেন্ট
│   ├── entry.client.tsx         # ক্লায়েন্ট সাইড এন্ট্রি পয়েন্ট
│   ├── entry.server.tsx         # সার্ভার সাইড এন্ট্রি পয়েন্ট
│   ├── welcome/
│   │   └── welcome.tsx          # ওয়েলকাম পেজ
│   ├── routes/
│   │   ├── _index.tsx           # হোম পেজ
│   │   ├── login.tsx            # লগইন পেজ
│   │   ├── signup.tsx           # সাইনআপ পেজ
│   │   ├── dashboard.tsx        # ড্যাশবোর্ড
│   │   ├── files/
│   │   │   ├── _index.tsx       # ফাইল লিস্ট পেজ
│   │   │   ├── [id].tsx         # ফাইল ডিটেইল পেজ
│   │   │   └── shared/
│   │   │       └── [id].tsx     # শেয়ার করা ফাইল পেজ
│   │   └── profile/
│   │       └── _index.tsx       # প্রোফাইল পেজ
│   ├── components/
│   │   ├── FileCard.tsx         # ফাইল কার্ড কম্পোনেন্ট
│   │   ├── FileGrid.tsx         # ফাইল গ্রিড কম্পোনেন্ট
│   │   ├── FileManager.tsx      # মূল ফাইল ম্যানেজার কম্পোনেন্ট
│   │   ├── Navigation.tsx       # নেভিগেশন বার
│   │   ├── AuthForm.tsx         # অথ ফর্ম কম্পোনেন্ট
│   │   └── UploadButton.tsx     # আপলোড বাটন কম্পোনেন্ট
│   ├── lib/
│   │   ├── auth.ts              # অথেনটিকেশন ফাংশন
│   │   ├── storage.ts           # স্টোরেজ (R2) ফাংশন
│   │   └── utils.ts             # ইউটিলিটি ফাংশন
│   └── app.css                  # গ্লোবাল স্টাইল
├── workers/
│   └── app.ts                   # Cloudflare Worker এন্ট্রি পয়েন্ট
├── public/
│   ├── favicon.ico
│   └── logo.svg
├── .gitignore
├── .env                         # এনভায়রনমেন্ট ভ্যারিয়েবল
├── package.json
├── react-router.config.ts       # React Router কনফিগ
├── vite.config.ts               # Vite কনফিগ
├── wrangler.toml                # Cloudflare Wrangler কনফিগ
├── worker-configuration.d.ts    # Worker টাইপ ডিফিনিশন
└── README.md
