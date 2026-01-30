import { useLocalStorage } from './hooks/useLocalStorage';
import { PlatformSwitcher } from './components/PlatformSwitcher';
import { WechatPlatform } from './platforms/wechat';
import { XhsPlatform } from './platforms/xiaohongshu';

// 平台列表
const PLATFORMS = [
  { id: 'wechat', name: '公众号封面' },
  { id: 'xiaohongshu', name: '小红书图文' },
];

function App() {
  // 使用 localStorage 保存当前平台
  const [currentPlatform, setCurrentPlatform] = useLocalStorage('cover-generator:platform', 'wechat');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 平台切换器 */}
      <PlatformSwitcher
        platforms={PLATFORMS}
        currentPlatform={currentPlatform}
        onPlatformChange={setCurrentPlatform}
      />

      {/* 平台内容 */}
      <main className="min-h-[calc(100vh-4rem)]">
        {currentPlatform === 'wechat' && <WechatPlatform />}
        {currentPlatform === 'xiaohongshu' && <XhsPlatform />}
      </main>
    </div>
  );
}

export default App;
