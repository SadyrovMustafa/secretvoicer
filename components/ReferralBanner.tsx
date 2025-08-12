import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export const ReferralBanner: React.FC = () => {
  const router = useRouter();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Получаем реферальный код из URL параметров
    const { ref } = router.query;
    if (ref && typeof ref === 'string') {
      setReferralCode(ref);
    }
  }, [router.query]);

  const copyReferralCode = async () => {
    if (referralCode) {
      try {
        await navigator.clipboard.writeText(referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy referral code:', error);
      }
    }
  };

  if (!referralCode) return null;

  return (
    <div className="bg-gradient-to-r from-accent-yellow to-yellow-400 text-black p-4 rounded-lg mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🎁</div>
          <div>
            <h3 className="font-bold text-lg">Реферальный код активирован!</h3>
            <p className="text-sm opacity-90">
              Используйте код <span className="font-mono font-bold">{referralCode}</span> при регистрации для получения бонусов
            </p>
          </div>
        </div>
        <button
          onClick={copyReferralCode}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
        >
          {copied ? 'Скопировано!' : 'Копировать'}
        </button>
      </div>
    </div>
  );
};
