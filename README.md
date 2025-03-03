# Dragons of Mugloar

This is an implementation of frontend and backend solutions for Dragons of Mugloar, Bigbank's home assignment. It consistenly scores over 1000 points on auto-play.

## Autoplay

1. Starts a new game
2. Fetches a list of ads
3. Picks the best ads to solve and solves them
4. Buys items to improve its chances
5. Repeats from step two until lives run out

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Project Setup

```sh
yarn
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

### Type-Check, Compile and Minify for Production

```sh
yarn build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
yarn test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
yarn build

# Runs the end-to-end tests
yarn test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```
