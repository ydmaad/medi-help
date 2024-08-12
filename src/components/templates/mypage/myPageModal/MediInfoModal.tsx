// src/components/templates/mypage/myPageModal/MediInfoModal.tsx

"use client";

import React from 'react';
import Modal from 'react-modal';
import axios from 'axios';

interface MediRecord {
  id: string;
  medi_name: string;
  medi_nickname: string;
  times: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
  notes: string;
  start_date: string;
  end_date: string;
  created_at: string;
  user_id: string;
  itemImage?: string | null;
  notification_time?: string[];
  day_of_week?: string[];
  repeat?: boolean;
}

interface MediInfoModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onUpdate: (updatedMediRecord: MediRecord) => void;
  onDelete: (id: string) => void;
  mediRecord: MediRecord;
}

const MediInfoModal: React.FC<MediInfoModalProps> = ({
  isOpen,
  onRequestClose,
  onUpdate,
  onDelete,
  mediRecord,
}) => {
  const handleUpdate = async () => {
    try {
      const response = await axios.put(`/api/mypage/medi/${mediRecord.id}`, mediRecord);
      if (response.status === 200) {
        onUpdate(mediRecord);
        onRequestClose();
      }
    } catch (error) {
      console.error('Error updating medication:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/mypage/medi/${mediRecord.id}`);
      if (response.status === 200) {
        onDelete(mediRecord.id);
        onRequestClose();
      }
    } catch (error) {
      console.error('Error deleting medication:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Medi Info Modal"
    >
      <div>
        <button onClick={handleUpdate}>Update</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </Modal>
  );
};

export default MediInfoModal;
