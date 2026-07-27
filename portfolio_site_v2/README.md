# Ma Hongyahui · UX 作品集网站

纯静态个人站（HTML + CSS），欧美简约风，适配手机/电脑。图片与文案均来自作品集 PDF。

## 目录结构
```
portfolio_site/
├── index.html        # 主页面（所有内容与图片都在这里）
├── style.css         # 样式
└── images/           # 19 张作品集截图（slide_01~19.png）
```

## 本地预览（不发布也能看）
直接双击 `index.html` 用浏览器打开即可。

## 免费发布到 GitHub Pages（得到 yourname.github.io）
适合完全小白，全部在网页上操作，不用装软件：

1. 打开 https://github.com ，注册 / 登录账号。
2. 右上角 **＋ → New repository**。
3. 仓库名必须填：`你的用户名.github.io`（例如用户名叫 `mhyh`，就填 `mhyh.github.io`）。
   - 这个固定命名会自动开启 GitHub Pages。
4. 仓库选 **Public**，点 **Create repository**。
5. 进入仓库后，把 `portfolio_site` 里的 **index.html、style.css、images 文件夹** 直接拖拽上传（或点 Add file → Upload files）。
6. 等 1–2 分钟，浏览器访问 `https://你的用户名.github.io` 即可看到网站。

> 以后想改内容：直接编辑 `index.html`（比如把联系方式换成真实信息），重新上传覆盖即可。

## 可选：用命令行一键发布（如果你装了 git）
```bash
cd portfolio_site
git init && git add -A && git commit -m "portfolio"
git branch -M main
git remote add origin https://github.com/你的用户名/你的用户名.github.io.git
git push -u origin main
```

## 想绑定自己域名（如 yourname.com）
GitHub Pages 绑域名免费，只需自行购买域名（约 ¥50–100/年），在仓库 Settings → Pages → Custom domain 里填写并按提示配置 DNS 即可。

## 待你替换的占位内容
- `index.html` 底部「联系」区块里的邮箱 / 微信 / 链接占位文字。
- 如需增减项目或换图，编辑 `index.html` 对应 `<figure>` 与文字即可。
