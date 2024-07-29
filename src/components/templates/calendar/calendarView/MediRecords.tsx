"use client";

import React, { useState, useEffect } from 'react';
import AddMediModal from '../calendarModal/AddMediModal';
import EditMediModal from '../calendarModal/EditMediModal';

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
  const [alarmRecords, setAlarmRecords] = useState<MediRecord[]>([]);
  const [mediRecords, setMediRecords] = useState<MediRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MediRecord | null>(null);

  const fetchAlarmRecords = async () => {
    try {
      const response = await fetch('/api/calendar/medi/today');
      if (!response.ok) {
        throw new Error('Failed to fetch alarm records');
      }
      const data = await response.json();
      console.log('Fetched alarm records:', data.alarmRecords);
      setAlarmRecords(data.alarmRecords || []);
    } catch (error) {
      console.error('Error fetching alarm records:', error);
    }
  };

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

  const handleDelete = async (id: string, deleteMedi: boolean) => {
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
      setAlarmRecords(alarmRecords.filter(record => record.id !== id));

      if (deleteMedi) {
        setMediRecords(mediRecords.filter(record => record.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete alarm record:', error);
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
      setAlarmRecords(alarmRecords.map(record => record.id === id ? { ...record, ...updatedRecord } : record));
    } catch (error) {
      console.error('Failed to edit alarm record:', error);
    }
  };

  useEffect(() => {
    fetchAlarmRecords();
    fetchMediRecords();
  }, []);

  const handleAdd = (newMediRecord: MediRecord) => {
    setAlarmRecords([...alarmRecords, newMediRecord]);
    setMediRecords([...mediRecords, newMediRecord]);
  };

  const handleRecordClick = (record: MediRecord) => {
    setSelectedRecord(record);
    setShowEditModal(true);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl mb-4">복약 기록</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">오늘의 복약 알림</h3>
        {alarmRecords.map(record => (
          <div key={record.id} onClick={() => handleRecordClick(record)} className="bg-white p-4 rounded shadow mb-4 flex justify-between items-center cursor-pointer">
            <div>
              <span className="font-semibold">{record.medi_name}</span>
              <div className="text-sm">{record.alarm_time}</div>
            </div>
          </div>
        ))}
      </div>
      <h3 className="text-lg font-semibold">복용 중인 약</h3>
      {mediRecords.map(record => (
        <div key={record.id} className="bg-white p-4 rounded shadow mb-4">
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
      {showEditModal && selectedRecord && (
        <EditMediModal
          isOpen={showEditModal}
          onRequestClose={() => setShowEditModal(false)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          mediRecord={selectedRecord}
        />
      )}
    </div>
  );
};

export default MediRecords;
