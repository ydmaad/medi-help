// src/app/(root)/mypage/Medications/page.tsx
import Medications from '@/components/templates/mypage/Medications';

export default function MedicationsPage() {
  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12"> {/* 컨테이너의 여백 조정 */}
      <Medications />
    </div>
  );
}
