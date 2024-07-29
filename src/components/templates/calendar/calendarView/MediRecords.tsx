"use client";

import React, { useState, useEffect } from 'react';
import AddMediModal from '../calendarModal/AddMediModal';

interface MediRecord {
  id: string;
  medi_name: string;
  times: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
  alarm_time: string;
  notes: string;
}

const MediRecords: React.FC = () => {
  const [mediRecords, setMediRecords] = useState<MediRecord[]>([]);
  const [showModal, setShowModal] = useState(false);

  const fetchMediRecords = async () => {
    try {
      const response = await fetch('/api/calendar/medi');
      if (!response.ok) {
        throw new Error('Failed to fetch medi records');
      }
      const data = await response.json();
      console.log('Fetched medi records:', data.mediRecords);
      setMediRecords(data.mediRecords || []);
    } catch (error) {
      console.error('Error fetching medi records:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/calendar/medi', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('DELETE response:', result);

      // 데이터가 성공적으로 삭제되면, 다시 데이터를 불러와 상태를 업데이트합니다.
      await fetchMediRecords();
    } catch (error) {
      console.error('Failed to delete medi record:', error);
    }
  };

  useEffect(() => {
    fetchMediRecords();
  }, []);

  const handleAdd = (newMediRecord: MediRecord) => {
    setMediRecords([...mediRecords, newMediRecord]);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl mb-4">복약 기록</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">오늘의 복약 알림</h3>
        {mediRecords.map(record => (
          <div key={record.id} className="bg-white p-4 rounded shadow mb-4 flex justify-between items-center">
            <div>
              <span className="font-semibold">{record.medi_name}</span>
              <div className="text-sm">{record.alarm_time}</div>
            </div>
            <button
              onClick={() => handleDelete(record.id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
      <h3 className="text-lg font-semibold">복용 중인 약</h3>
      {mediRecords.map(record => (
        <div key={record.id} className="bg-white p-4 rounded shadow mb-4">
          <span className="font-semibold">{record.medi_name}</span>
        </div>
      ))}
      <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
        나의 약 등록
      </button>
      {showModal && (
        <AddMediModal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
};

export default MediRecords;
