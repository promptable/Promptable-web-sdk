# TypeScript NPM Package
Scaffold TypeScript npm packages using this template to bootstrap your next library.

This project includes:
- [TypeScript](https://www.typescriptlang.org/)
- [Rollup](https://rollupjs.org/)
- [Microsoft API Extractor](https://api-extractor.com/)
- [TypeDoc](https://typedoc.org/)

Versions of this template:
- [Vite TypeScript library npm package](https://github.com/jasonsturges/vite-typescript-npm-package)
- [Vite JavaScript library npm package](https://github.com/jasonsturges/vite-npm-package)
- [Rollup JavaScript library npm package](https://github.com/jasonsturges/npm-package-boilerplate)
- [Rollup TypeScript library npm package](https://github.com/jasonsturges/typescript-npm-package)


## Getting Started

Begin via any of the following:

- Press the "*Use this template*" button

- Use [degit](https://github.com/Rich-Harris/degit) to execute: 

    ```
    degit github:jasonsturges/typescript-npm-package
    ```
    
- Use [GitHub CLI](https://cli.github.com/) to execute: 

    ```
    gh repo create <name> --template="https://github.com/jasonsturges/typescript-npm-package"
    ```
    
- Simply `git clone`, delete the existing .git folder, and then:

    ```
    git init
    git add -A
    git commit -m "Initial commit"
    ````

Remember to use `npm search <term>` to avoid naming conflicts in the NPM Registery for your new package name.


## Usage

The following tasks are available for `npm run`:

- `dev`: Run Rollup in watch mode to detect changes to files during development
- `build`: Run Rollup to build a production release distributable
- `build:types`: Run Microsoft API Extractor to rollup a types declaration (`d.ts`) file 
- `docs`: Run TypeDoc for TSDoc generated documentation in the "*docs/*" folder
- `clean`: Remove all build artifacts


## Development

While test driven development (TDD) would be a good approach to develop your library, also consider creating an app for prototyping and local testing of your library.

To test within the library, consider using [Storybook](https://storybook.js.org/).  This approach runs a `storybook` script to load local source files for development.

Otherwise, follow these steps to test the package from another project:

**From your library project**, issue the `npm link` (or `yarn link`) command:

```
npm link
```

Start Rollup in watch mode:

```
npm run dev
```

**Create a test app project**, by doing the following:

To use your npm package library locally for development, create a new project in a separate folder:

```
mkdir test-app && cd test-app
npm init
```

Take the defaults from `npm init`; then, add TypeScript:

```
npm install typescript --save-dev
```

In the package.json of your test app, add the following two things:
- Set the `type` of your package to `module`
- Add a `start` script to execute your app

```json
"type": "module",
"scripts": {
  "start": "tsc && node index.js",
},
```

Link to your library using the `npm link <name>` (or `yarn link <name>`) command - be sure the `<name>` matches your library's package.json name.  For example:

```
npm link typescript-npm-package
```

Add a "*tsconfig.json*" file to your test app that includes a `baseUrl` and references the `paths` to your npm linked module.  Again, be sure the `paths` name matches your library's package.json name.  For example:

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "baseUrl": ".",
    "paths": {
      "typescript-npm-package": ["node_modules/typescript-npm-package/src"],
      "typescript-npm-package/*": ["node_modules/typescript-npm-package/src/*"]
    }
  }
}
```

Now, run your app via `npm start`.

As an example, if your library's "*index.ts*" file contained:

```ts
export const sayHi = () => {
  console.log("Hi");
};
```

...your test app would implement an import using your package name, such as:

```ts
import { sayHi } from "typescript-npm-package";

sayHi();
```


## Development Cleanup

Once development completes, `unlink` both your library and test app projects.

**From your test app project**, unlink the library using `npm unlink <name>` (or `yarn unlink <name>`) command:

```
npm unlink typescript-npm-package
```

**From your library project**, issue the `npm unlink` (or `yarn unlink`) command:

```
npm unlink
```


## Release Publishing

Update your `package.json` to next version number, and remember to tag a release.

Once ready to submit your package to the NPM Registry, execute the following tasks via `npm` (or `yarn`):

- `npm run clean` &mdash; Assure a clean build
- `npm run build` &mdash; Build the package
- `npm run build:types` &mdash; Build API Extractor d.ts declaration

Assure the proper npm login:

```
npm login
```

Submit your package to the registry:

```
npm publish --access public
```
