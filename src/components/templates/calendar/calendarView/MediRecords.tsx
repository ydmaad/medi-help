"use client";

import React, { useState, useEffect } from 'react';
import AddMediModal from '../calendarModal/AddMediModal';
import ViewMediModal from '../calendarModal/ViewMediModal';

interface MediRecord {
  id: string;
  medi_name: string;
  times: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
  notes: string;
  created_at: string;
}

const MediRecords: React.FC = () => {
  const [mediRecords, setMediRecords] = useState<MediRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MediRecord | null>(null);

  const fetchMediRecords = async () => {
    try {
      const response = await fetch('/api/calendar/medi/all');
      if (!response.ok) {
        throw new Error('Failed to fetch medication records');
      }
      const data = await response.json();
      console.log('Fetched medication records:', data.medicationRecords);
      setMediRecords(data.medicationRecords || []);
    } catch (error) {
      console.error('Error fetching medication records:', error);
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

      // 데이터가 성공적으로 삭제되면, 상태를 업데이트합니다.
      setMediRecords(mediRecords.filter(record => record.id !== id));
    } catch (error) {
      console.error('Failed to delete medication record:', error);
    }
  };

  const handleEdit = async (id: string, updatedRecord: Partial<MediRecord>) => {
    try {
      const response = await fetch('/api/calendar/medi', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updatedRecord }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('PATCH response:', result);

      // 데이터가 성공적으로 수정되면, 상태를 업데이트합니다.
      setMediRecords(mediRecords.map(record => record.id === id ? { ...record, ...updatedRecord } : record));
    } catch (error) {
      console.error('Failed to edit medication record:', error);
    }
  };

  useEffect(() => {
    fetchMediRecords();
  }, []);

  const handleAdd = (newMediRecord: MediRecord) => {
    setMediRecords([...mediRecords, newMediRecord]);
  };

  const handleMediRecordClick = (record: MediRecord) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl mb-4">복용 중인 약</h2>
      {mediRecords.map(record => (
        <div key={record.id} onClick={() => handleMediRecordClick(record)} className="bg-white p-4 rounded shadow mb-4 cursor-pointer">
          <span className="font-semibold">{record.medi_name}</span>
        </div>
      ))}
      <button onClick={() => setShowAddModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
        나의 약 등록
      </button>
      {showAddModal && (
        <AddMediModal
          isOpen={showAddModal}
          onRequestClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
        />
      )}
      {showViewModal && selectedRecord && (
        <ViewMediModal
          isOpen={showViewModal}
          onRequestClose={() => setShowViewModal(false)}
          mediRecord={selectedRecord}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default MediRecords;
