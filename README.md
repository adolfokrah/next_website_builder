## Project goal

To build user-friendly website building platform that enables non-technical users to customise pre-designed websites without requiring constant developer intervention. Users should be able to adjust website layouts, add or delete pages, and modify page content such as section titles, descriptions, and background images based on predefined settings provided by the developer. The platform should only prompt developer involvement for complex tasks like creating new sections and implementing advanced code functionalities

## Tools used

- Typescript: https://www.typescriptlang.org/
- Prisma: https://www.prisma.io/
- Next js: https://nextjs.org/
- Tailwindcss: https://tailwindcss.com/
- Shadcn/ui: https://ui.shadcn.com/
- PNPM: https://pnpm.io/

## Installing

Install [PNPM](https://pnpm.io/)

Clone repo

```bash
git clone https://github.com/adolfokrah/next_website_builder.git

cd builder-app
```

Install dependencies

```bash
pnpm i
```

Run migrations

```bash
	npx prisma migrate dev --name init
```

Run dev server

```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Run prisma studio

```bash
npx prisma studio
```
Open [http://localhost:5555](http://localhost:5555) with your browser to see prisma studio.
