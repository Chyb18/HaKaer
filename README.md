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

**必须在仓库 Settings → Pages 中选择 Source: GitHub Actions**（不要选 Deploy from branch `master`），否则会直接发布源码里的 `index.html`，浏览器会 404 请求 `/src/main.tsx`。

推送到 `master` 后会自动执行 `.github/workflows/deploy.yml` 构建并发布。

也可手动发布到 `gh-pages` 分支：

```bash
npm run deploy
```

若使用 `gh-pages` 分支作为 Pages 源，请在 Settings → Pages 里选 branch `gh-pages` / root。

## 内容来源

- 项目经验：`项目经验.md`（14 个项目）
- CSDN：https://blog.csdn.net/chyb918
