# Playwright demo
Miłosz Jura, 2025
## Introduction
This is a demo of implementing [Playwright](https://playwright.dev/) simple framework and tests for [Writer.js](https://github.com/alirezakefayati/writer.js/) application, that was also built by me :)


## Environment setup
1. Install Node.js - [Node.js download](https://nodejs.org/en/download)
2. Install and init playwright with npm
```
npm init playwright@latest
npm init playwright@latest
```
3. Run tests
```
npx playwright test
```
At this point, all tests should be passed.


## Project structure
```
src/
├── config.js // config, like url to web app
├── locators.js // page locators as css selectors
└── writejs.js // functions to operate on Write.js app
tests/
└── writerjs_functionality_tests.spec.js // functional 
```
## Contact Author
Feel free to contact me using this email - milosz.m.jura@gmail.com
