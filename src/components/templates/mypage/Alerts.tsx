"use client";

import React, { useState, useEffect } from "react";
import Modal from "react-modal";

interface Alert {
  id: string;
  time: string;
  description: string;
  days: string[];
  medicine: string;
}

interface Medicine {
  itemName: string;
}

const Alerts = () => {
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState("");

  useEffect(() => {
    Modal.setAppElement("body");
    fetch("/api/mypage/alerts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAlerts(data.alerts);
      })
      .catch((error) => {
        console.error("Failed to fetch alerts:", error);
      });

    fetch("/api/mypage/alerts/getMedicineNames")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setMedicines(data);
      })
      .catch((error) => {
        console.error("Failed to fetch medicine names:", error);
      });
  }, []);

  const handleDayChange = (day: string) => {
    setDays((prevDays) =>
      prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newAlert = {
      id: `${alerts.length + 1}`,
      time,
      description,
      days,
      medicine: selectedMedicine,
    };

    try {
      const response = await fetch("/api/mypage/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAlert),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setAlerts([...alerts, newAlert]);
      setShowModal(false);
      setTime("");
      setDescription("");
      setDays([]);
      setSelectedMedicine("");
    } catch (error) {
      console.error("Failed to schedule alert:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("/api/mypage/alerts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setAlerts(alerts.filter((alert) => alert.id !== id));
    } catch (error) {
      console.error("Failed to delete alert:", error);
    }
  };

  return (
    <div className="p-4">
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Set Alert"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50"
      >
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl mb-4">복약 알람</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                약 이름 선택:
              </label>
              <select
                value={selectedMedicine}
                onChange={(e) => setSelectedMedicine(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">약을 선택하세요</option>
                {medicines.map((medicine, index) => (
                  <option key={index} value={medicine.itemName}>
                    {medicine.itemName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                알람 시간:
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                약 설명:
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                요일 선택:
              </label>
              <div className="flex flex-wrap">
                {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                  <label key={day} className="mr-4">
                    <input
                      type="checkbox"
                      value={day}
                      checked={days.includes(day)}
                      onChange={() => handleDayChange(day)}
                      className="mr-2"
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                알람 설정하기
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
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-gray-100 p-4 rounded shadow mb-2 flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-semibold">{alert.time}에 알람이 설정되었어요.</p>
              <p className="text-sm">약 이름: {alert.medicine}</p>
              <p className="text-sm">약 설명: {alert.description}</p>
              <p className="text-sm">요일: {alert.days?.join(", ")}</p>

            </div>
            <button
              onClick={() => handleDelete(alert.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              알람 삭제
            </button>
          </div>
        ))}
        <div className="flex justify-center items-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setShowModal(true)}
          >
            복약 알람 추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
