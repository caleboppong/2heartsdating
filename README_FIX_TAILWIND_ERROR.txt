Tailwind/Next.js error fix

If you see:
"It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin"

you installed Tailwind v4 because package.json used "latest".
This project has now been pinned to Tailwind CSS v3, which works with the included postcss.config.js.

Run these commands inside the project folder:

1. Stop the dev server.
2. Delete old install files:
   - Windows PowerShell:
     Remove-Item -Recurse -Force node_modules, package-lock.json
   - Mac/Linux:
     rm -rf node_modules package-lock.json
3. Install again:
   npm install
4. Start again:
   npm run dev

Then open:
http://localhost:3000
