'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

interface Alert {
  id: string;
  time: string;
  description: string;
}

const Alerts = () => {
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    Modal.setAppElement('body');
    fetch('/api/mypage/alerts')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setAlerts(data.alerts);
      })
      .catch(error => {
        console.error('Failed to fetch alerts:', error);
      });
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newAlert = {
      id: `${alerts.length + 1}`,
      time,
      description,
    };

    try {
      const response = await fetch('/api/mypage/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAlert),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setAlerts([...alerts, newAlert]);
      setShowModal(false);
      setTime('');
      setDescription('');
    } catch (error) {
      console.error('Failed to schedule alert:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/mypage/alerts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setAlerts(alerts.filter(alert => alert.id !== id));
    } catch (error) {
      console.error('Failed to delete alert:', error);
    }
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)}> 복약 알람 추가</button>
      <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)}>
        <h2>복약 알람</h2>
        <form onSubmit={handleSubmit}>
          <label>
            시간 :
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </label>
          <label>
            약 설명 :
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <button type="submit">알람 설정하기</button>
        </form>
      </Modal>
      <div>
        {alerts.map(alert => (
          <div key={alert.id}>
            <p>시간 : {alert.time}</p>
            <p>약 설명: {alert.description}</p>
            <button onClick={() => handleDelete(alert.id)}>알람 삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
