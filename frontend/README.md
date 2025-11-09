# Frontend
This folder contains the Next.js frontend for the `Most Similar Movies` project.
The functionality can be found in the `app` folder.
The most important files are the following:
- `./app/page.tsx` is the entry point where the homepage is rendered.
- The search bar where the user enters their search for a movie is defined in `./app/ui/search.tsx`.
- The table containing the movie results is defined in `./app/ui/results-list.tsx` as `ResultsList`
- The API call to the backend to get the movie recommendations based on the search query can be found in `./app/lib/api.ts`.

## Running the App Locally
1. `cd` into the `frontend` folder on your computer.
```shell
cd frontend
```

2. Install the required packages.
```shell
pnpm install
```

3. Run in development mode; the app will be live at [http://localhost:3000](http://localhost:3000).
```bash
pnpm run dev
```
If you are testing out the app, please ensure that the backend is running as well!
Instructions to do so can be found in the `./backend` folder [here](https://github.com/1cookspe/Most-Similar-Movies/tree/main/backend).
