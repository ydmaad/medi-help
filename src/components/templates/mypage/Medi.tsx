'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

interface MediRecord {
  id: string;
  medi_name: string;
  time: string;
  notes: string;
}

const Medi: React.FC = () => {
  const [mediRecords, setMediRecords] = useState<MediRecord[]>([]);
  const [mediName, setMediName] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [mediNames, setMediNames] = useState<string[]>([]);

  const fetchMediRecords = async () => {
    try {
      const response = await fetch('/api/mypage/medi');
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

  const fetchMediNames = async () => {
    try {
      const response = await fetch('/api/mypage/medi/names');
      if (!response.ok) {
        throw new Error('Failed to fetch medi names');
      }
      const data = await response.json();
      setMediNames(data.map((item: { itemName: string }) => item.itemName));
    } catch (error) {
      console.error('Error fetching medi names:', error);
    }
  };

  useEffect(() => {
    fetchMediRecords();
    fetchMediNames();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newMediRecord = {
      id: crypto.randomUUID(),
      medi_name: mediName,
      time,
      notes,
    };

    try {
      const response = await fetch('/api/mypage/medi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMediRecord),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('POST response:', result);

      // 데이터가 성공적으로 저장되면, 다시 데이터를 불러와 상태를 업데이트합니다.
      await fetchMediRecords();
      setShowModal(false);
      setMediName('');
      setTime('');
      setNotes('');
    } catch (error) {
      console.error('Failed to save medi record:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/mypage/medi', {
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

  return (
    <div className="p-4">
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Add Medication"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50"
      >
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl mb-4">복용 중인 약 추가</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">약 이름:</label>
              <select
                value={mediName}
                onChange={(e) => setMediName(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">약 이름을 선택하세요</option>
                {mediNames.map((name, index) => (
                  <option key={index} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">시간:</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">시간을 선택하세요</option>
                <option value="아침">아침</option>
                <option value="점심">점심</option>
                <option value="저녁">저녁</option>
                <option value="해당없음">해당없음</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">메모:</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                추가하기
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <div className="mt-4">
        <h2 className="text-xl mb-4">복용 중인 약 목록</h2>
        {mediRecords.length === 0 ? (
          <p>복용 중인 약이 없습니다.</p>
        ) : (
          mediRecords.map((record) => (
            <div key={record.id} className="bg-gray-100 p-4 rounded shadow mb-2 flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">{record.medi_name}</p>
                <p className="text-sm">시간: {record.time}</p>
                <p className="text-sm">메모: {record.notes}</p>
              </div>
              <button
                onClick={() => handleDelete(record.id)}
                className="bg-red-500 text-white px-4 py-2 rounded ml-4"
              >
                삭제
              </button>
            </div>
          ))
        )}
      </div>
      <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
        복용 중인 약 추가
      </button>
    </div>
  );
};

export default Medi;
