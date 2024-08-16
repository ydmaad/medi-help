// src/app/(root)/mypage/Medications/page.tsx

import Medications from '@/components/templates/mypage/Medications';

export default function MedicationsPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-4 py-4"> {/* MyPage와 동일한 최대 너비 및 좌우 여백 설정 */}
      <Medications />
    </div>
  );
}
