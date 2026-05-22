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

仓库根目录的 `index.html`、`assets/` 为**构建产物**（由 CI 或下面命令生成）。本地开发入口为 `index.dev.html`（`npm run dev` 会自动使用）。

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
