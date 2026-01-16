import { createInstance } from "i18next";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import { I18nextProvider, initReactI18next } from "react-i18next";
import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import resources from "./locales";
import { getLocale } from "./middleware/i18next";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  entryContext: EntryContext,
) {
  const userAgent = request.headers.get("user-agent");
  const url = new URL(request.url);

  const instance = createInstance();
  const lng = await getLocale(request);
  const ns = ["common"]; // Default namespace

  await instance.use(initReactI18next).init({
    lng,
    ns,
    defaultNS: "common",
    fallbackLng: "zh",
    supportedLngs: ["zh", "zh-HK", "en-US"],
    resources,
    interpolation: {
      escapeValue: false,
    },
    react: { useSuspense: false },
  });

  const body = await renderToReadableStream(
    <I18nextProvider i18n={instance}>
      <ServerRouter context={entryContext} url={request.url} />
    </I18nextProvider>,
    {
      onError(error: unknown) {
        responseStatusCode = 500;
        responseStatusCode = 500;
        console.error("React Rendering Error:", error);
      },
      signal: request.signal,
    },
  );

  if (isbot(userAgent || "")) {
    await body.allReady;
  }

  // 动态注入 CSS 预加载
  const routes = entryContext.manifest.routes;

  Object.values(routes).forEach((route: any) => {
    if (route.imports) {
      route.imports.forEach((file: string) => {
        if (file.endsWith(".css")) {
          responseHeaders.append("Link", `<${file}>; rel=preload; as=style`);
        }
      });
    }
    // 也要检查路由本身定义的 css 文件
    if (route.css) {
      route.css.forEach((file: string) => {
        responseHeaders.append("Link", `<${file}>; rel=preload; as=style`);
      });
    }
  });
  // --- 动态注入 CSS 预加载结束 ---

  // 2. 核心优化：设置缓存控制策略 [cite: 80, 81, 84]
  // 判断是否为静态资源请求。React Router 编译后的 JS/CSS 通常在 /assets/ 目录下 [cite: 60, 188]
  if (url.pathname.startsWith("/assets/")) {
    // 针对带哈希的不可变资源，设置长达一年的强缓存 [cite: 84, 89]
    responseHeaders.set("Cache-Control", "public, max-age=31536000, immutable");
  } else {
    // 针对 HTML 页面，要求浏览器每次都向服务器验证，确保内容最新 [cite: 111, 116]
    responseHeaders.set("Cache-Control", "public, max-age=0, must-revalidate");
  }

  responseHeaders.set("Content-Type", "text/html");

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
