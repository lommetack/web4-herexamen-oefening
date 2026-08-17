# React Router Framework Warmup

- Create a new React Router project via `npm create vite@latest` or `npm create react-router@latest`
- Don't worry too much about the TypeScript or the Tailwind CSS syntax.

## Routing

- Create a new route `/warmup` that renders a component displaying the text "This is a warmup"
- Add a link on the homepage to navigate to the `/warmup` route
- Add a link on the `/warmup` page to navigate back to the homepage

## Data

- Add a loader to the `/warmup` route that fetches data from `https://global-warming.org/api/temperature-api`
- Display the data in a (long) list on the `/warmup` page, something like: `Year: {entry.time}, Temperature Anomaly: {entry.station}`
- Set the ssr config to false in `react-router.config.ts` and restart your development server
- Fix the issue to successfully fetch the data on the client side
