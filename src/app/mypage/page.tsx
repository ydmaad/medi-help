import React from 'react';
import Alerts from '@/components/templates/mypage/Alerts';
import ServiceWorkerRegister from '@/components/templates/mypage/ServiceWorkerRegister';

const MyPage: React.FC = () => {
  return (
    <div>
      <h1>My Page</h1>
      <ServiceWorkerRegister />
      <Alerts />
    </div>
  );
};

export default MyPage;
