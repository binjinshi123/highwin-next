# Highwin

An Electron application with React and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

The command will build the main process and preload scripts source code, and start a dev server for the renderer, and finally start the Electron app.

```bash
npm run dev --rendererOnly
```

The --rendererOnly option is only used for dev command to skip the main process and preload scripts builds, and start dev server for renderer only. This option will greatly increase dev command speed.

### Build

```bash
# For windows
npm run build:win

# For macOS
npm run build:mac

# For Linux
npm run build:linux
```

运行以上命令时要以管理员身份运行 `sudo npm run build:win`

## Distribution

### Electron Builder

A "complete solution to package and build a ready-for-distribution Electron app" that focuses on an integrated experience. [electron-builder](https://github.com/electron-userland/electron-builder) adds a single dependency and manages all further requirements internally.

`electron-builder` replaces features and modules used by the Electron maintainers (such as the auto-updater) with custom ones.

## Dev notes

Libraries

- [Motion](https://motion.dev/)
- [big.js](https://github.com/MikeMcl/big.js/): A small, fast JavaScript library for arbitrary-precision decimal arithmetic.

Shadcn components:

```bash
npx shadcn@latest add button card command context-menu dialog dropdown-menu input label navigation-menu popover progress resizable scroll-area select separator sonner switch table tabs toggle tooltip --overwrite
```

## Configuration

切换开发环境与生产环境

- index.html 中 Content-Security-Policy
- url-config.ts 中 isDev
- electron-builder.yml 和 dev-app-update.yml 中升级服务器
    - development: `http://10.1.240.46:5372/auto-updates`
    - production: `https://win.csmar.com:8400/auto-updates`
