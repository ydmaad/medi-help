"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";

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

interface AddMediModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onAdd: (newMediRecord: MediRecord) => void;
}

const AddMediModal: React.FC<AddMediModalProps> = ({ isOpen, onRequestClose, onAdd }) => {
  const [mediName, setMediName] = useState("");
  const [mediNames, setMediNames] = useState<string[]>([]);
  const [times, setTimes] = useState({
    morning: false,
    afternoon: false,
    evening: false,
  });
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchMediNames = async () => {
      try {
        const response = await axios.get("/api/calendar/medi/names");
        setMediNames(response.data.map((item: { itemName: string }) => item.itemName));
      } catch (error) {
        console.error("Failed to fetch medi names:", error);
      }
    };

    fetchMediNames();
  }, []);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimes({ ...times, [e.target.name]: e.target.checked });
  };

  const handleAdd = async () => {
    const newMediRecord: MediRecord = {
      id: crypto.randomUUID(),
      medi_name: mediName,
      times,
      notes,
      created_at: new Date().toISOString(),
    };

    try {
      const response = await axios.post("/api/calendar/medi", newMediRecord);
      if (response.status === 201) {
        onAdd(newMediRecord);
        onRequestClose();
      } else {
        console.error("Failed to add medi record:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to add medi record:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Medication"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-75 z-40"
    >
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto z-50">
        <h2 className="text-2xl mb-4">나의 약 등록</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">약 이름:</label>
          <select
            value={mediName}
            onChange={(e) => setMediName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">약 이름을 선택하세요</option>
            {mediNames.map((name, index) => (
              <option key={index} value={name}>{name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">복용 시간:</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="morning"
                checked={times.morning}
                onChange={handleCheckboxChange}
                className="form-checkbox"
              />
              <span className="ml-2">아침</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="afternoon"
                checked={times.afternoon}
                onChange={handleCheckboxChange}
                className="form-checkbox"
              />
              <span className="ml-2">점심</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="evening"
                checked={times.evening}
                onChange={handleCheckboxChange}
                className="form-checkbox"
              />
              <span className="ml-2">저녁</span>
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">메모:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            추가하기
          </button>
          <button
            onClick={onRequestClose}
            className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            취소
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddMediModal;
