import React from 'react';
import Alerts from '@/components/templates/mypage/Alerts';
import ServiceWorkerRegister from '@/components/templates/mypage/ServiceWorkerRegister';
import Details from '@/components/templates/mypage/Details';
import Comments from '@/components/templates/mypage/Commnets';
import Medi from '@/components/templates/mypage/Medi';

const MyPage: React.FC = () => {
  return (
    <div>
      <h1>My Page</h1>
      <Details />
      <Comments />
      <ServiceWorkerRegister />
      <Alerts />
      <Medi />
    </div>
  );
};

export default MyPage;
