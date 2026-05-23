# 陈宇彬 · 个人博客

React + TypeScript + GSAP 构建的前端工程师作品集，视觉风格参考 [Google Antigravity](https://antigravity.google/)。

## 技术栈

- React 19 + TypeScript
- Vite 8
- GSAP + ScrollTrigger

## 开发

```bash
npm install
npm run dev
```

## 部署（GitHub Pages）

线上地址：https://Chyb18.github.io/HaKaer/

本地开发使用根目录 `index.html`（入口 `/src/main.tsx`），请访问 **http://localhost:5173/**。

推送到 GitHub 后，CI 会把构建产物写入根目录的 `index.html` 与 `assets/`（仅用于 Pages 发布）。若本地执行过 `npm run pages:sync` 导致 dev 异常，执行 `git restore index.html` 恢复即可。

推送到 `master` 后，GitHub Actions 会构建并部署。

**Settings → Pages → Source 请选 GitHub Actions**（推荐）。若选「Deploy from branch」，请用 `master` + `/ (root)`，且根目录需已有构建好的 `index.html` 与 `assets/`。

手动更新线上文件：

```bash
npm run build
npm run pages:sync
git add index.html assets .nojekyll
git commit -m "chore(pages): update built site"
git push
```

## 内容来源

- 项目经验：`项目经验.md`（14 个项目）
- CSDN：https://blog.csdn.net/chyb918
