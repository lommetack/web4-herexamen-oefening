# Cat Browser App

This application lets users browse and discover different cat breeds using data from The Cat API. It features sections for breed details, favorites, random cat images, and more – all rendered with a clean, component-based architecture.

## Before we start

- Make an account on [The Cat API](https://thecatapi.com/) and copy your API key.
- Change `.env.example` to `.env` and set your API key as the VITE_API_KEY variable value.
- Set your VITE_USER_ID to something unique for you. This is important for the favorites

## Exercise: Build the App Step-by-Step

The basic UI components (like the cat cards, layout, and static styling) and the API helper functions (in `app/services/catApi.js`) are already provided. Your task is to implement the integration with React Router's data loading and action-handling mechanisms. Specifically, you will implement the following:

### 1. Implement Client-Side Data Loaders

Implement "clientLoader" functions for each route to fetch the necessary data. For example:

- In **Breeds** (`app/routes/breeds.jsx`): Write a clientLoader that calls `fetchBreeds` and returns the list of breeds.
- In **Breed Details** (`app/routes/breed-details.jsx`): Implement a clientLoader that gets the `breedId` from the route parameters and calls `fetchBreedDetails`. Additionally, load 8 random cat images for that breed using `fetchRandomCats` (take a look at the comment block of that function to figure out how to do that). Return both the breed details and the 8 random cat images.
- In **Random Cats** (`app/routes/random.jsx`): Create a clientLoader that uses `fetchRandomCats`.
- In **Favorites** (`app/routes/favorites.jsx`): Create a clientLoader that uses `fetchFavorites` (note: we will remove this one later on...)
  
### 2. Create Client Actions for Mutations

Implement a "clientAction" function to handle the user-initiated data mutation to mark a cat as a favorite. This can be done from the CatCard component. Since we can't set an action on a regular component and we use this component on multiple routes, we can create a _new_ route for this.

- **Favorite a cat**
  - In **Favorites Action** (`app/routes/favorites-action.jsx`): Write a clientAction that reads the form data (e.g., image ID) and calls `addToFavorites`
  - In **CatCard** (`app/components/CatCard.jsx`): call that action with a [fetcher](https://reactrouter.com/start/framework/actions#calling-actions-with-a-fetcher). Try to show the current fetcher state next to the heart symbol.
  - Check in the inspector if this works. You should be able to favorite a cat from the random page and from the breeds-detail page. Note: you can only favorite the same cat once. We will handle the like/not-liked status later
- **De-favorite a cat**
  - In **Favorites** (`app/routes/favorites.jsx`): Write a clientAction that handles de removal of a favorite. It's very similar to the previous action you wrote.

### 3. Leverage React Router features

- **Prevent reload after like**  
  Did you noticed that you get new cats when liking one? This is because all routes are revalidated after an action. We can [opt out](https://reactrouter.com/start/framework/route-module#shouldrevalidate) of this behavior if we want.
  - Let a `shouldRevalidate` function return false on the **random** and **breed-details** page
- **Load favorites once**
  We need a list of the favorites on the **favorites** page, but also to check if a cat on a **CatCard** is a favorite or not. So we need it on almost all the pages. We will fetch this data in the sidebar and call it from there. By using [useRouteLoaderData](https://api.reactrouter.com/v7/functions/react_router.useRouteLoaderData.html) you can get data for a given route by route ID.
  - In **sidebar** (`/app/layouts/sidebar.jsx`): Create a clientLoader that uses `fetchFavorites`
  - In **routes** (`app/routes.js`): Add an id to the layout route. It's a bit tricky to specify this on a layout route. But this [reference extract](https://api.reactrouter.com/v7/functions/_react_router_dev.routes.layout.html) should help you out.
  - In **Favorites** (`app/routes/favorites.jsx`): Remove the clientLoader, we don't need it there anymore. Use `useRouteLoaderData` to request the favorites from the sidebar.
  - In **CatCard** (`app/components/CatCard.jsx`):  Use `useRouteLoaderData` to request the favorites from the sidebar. You can use this data to check if the current cat is a favorite and show the appropriate heart emoji (❤️/🤍). You can also implement an optimistic UI pattern here.
- **Global Pending Navigation**
  We can show a loading indicator while the page renders.
  In **sidebar** (`app/layouts/sidebar.jsx`): Implement a [Global Pending Navigation](https://reactrouter.com/start/framework/pending-ui#global-pending-navigation) by using `<div className="global-spinner">Loading...</div>` The css is already implemented.
