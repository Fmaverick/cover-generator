import { TreePine } from './icons';

interface Platform {
  id: string;
  name: string;
}

interface PlatformSwitcherProps {
  platforms: Platform[];
  currentPlatform: string;
  onPlatformChange: (platform: string) => void;
}

/**
 * 平台切换器组件
 */
export function PlatformSwitcher({
  platforms,
  currentPlatform,
  onPlatformChange,
}: PlatformSwitcherProps) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 text-white shadow-lg bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-primary-600/20">
            <TreePine size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tight text-gray-900">
              Cover Generator
            </h1>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
              统一封面生成工具
            </p>
          </div>
        </div>

        {/* Platform Tabs */}
        <nav className="flex items-center gap-2">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => onPlatformChange(platform.id)}
              className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                currentPlatform === platform.id
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {platform.name}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Fmaverick/cover-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
