import { Envelope } from "@phosphor-icons/react";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Feedback Section */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              👋 有想法或建议？
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              欢迎随时反馈，帮助改进这个项目
            </p>
          </div>

          {/* Contact & Callsign */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <a
              href="mailto:ham@charlesify.com"
              className="group flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <div className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                <Envelope size={18} weight="duotone" />
              </div>
              <span>ham@charlesify.com</span>
            </a>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
                BG8ROM
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-900 flex justify-center">
            <p className="text-xs text-zinc-400 dark:text-zinc-600">
                © {new Date().getFullYear()} Ham Radio Visualization. All rights reserved.
            </p>
        </div>
      </div>
    </footer>
  );
}
