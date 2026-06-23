# 部署为永久公开网站

本项目是**纯静态站点**(无后端、无需构建)。运行所需文件只有:
`index.html`、`styles.css`、`js/`、`vendor/`。

已整理好 **`deploy/`** 文件夹(2.7M,仅含运行所需文件,已剔除 node_modules 与未用到的 three 插件),可直接上传。
也可用 **`regen-rankine-3d-site.zip`**(601K,解压即同上)。

> 所有资源路径都是相对路径(`./vendor/...`、`./js/...`),因此部署到域名根目录或子路径(如 `user.github.io/repo/`)都能正常工作。

---

## 方法 A — Netlify Drop(最快,拖拽即可)
1. 打开 https://app.netlify.com/drop (登录免费账号)
2. 把 **`deploy/` 文件夹**拖到页面
3. 几秒后得到 `https://随机.netlify.app` 永久链接,可在后台改自定义域名

## 方法 B — GitHub Pages
1. GitHub 新建仓库 → 把本项目推上去(`.gitignore` 已排除 node_modules)
   ```bash
   git init && git add . && git commit -m "rankine 3d sim"
   git remote add origin <你的仓库地址> && git push -u origin main
   ```
2. 仓库 **Settings → Pages → Source** 选 `main` 分支、`/(root)`
3. 几分钟后访问 `https://<用户名>.github.io/<仓库名>/`

## 方法 C — Cloudflare Pages(国内访问较友好)
1. https://pages.cloudflare.com → Create project
2. 连接 GitHub 仓库,或选 **Direct Upload** 直接上传 `deploy/`
3. 构建命令:**留空**;输出目录:**`.`**(或 `deploy/`)
4. 部署后得 `https://<项目名>.pages.dev`

## 方法 D — Surge(命令行,一条)
```bash
cd deploy
npx surge        # 首次填邮箱,选/确认一个子域名
```
得到 `https://<子域名>.surge.sh`

## 方法 E — Vercel
```bash
npm i -g vercel
vercel           # 按提示部署,Frameconfig 无需改
```

---

## 国内访问提示
- GitHub Pages / Vercel / Netlify 在国内**可能较慢或需代理**
- 想国内快速访问,推荐:**Cloudflare Pages**、**Gitee Pages**、或腾讯云/阿里云**对象存储 + 静态网站托管**

## 验证部署是否正常
部署后若 3D 区空白,打开浏览器开发者工具 Console 看报错:
- `404 ... .js` → 上传不全(确认 `vendor/three/build/three.module.js` 与 `vendor/three/examples/jsm/{controls,renderers,environments,postprocessing}` 都在)
- `Failed to load module` → 多半是托管平台没给 `.js` 返回 `text/javascript`(Netlify/Vercel/CF/GitHub 默认都对,基本不会出现)
