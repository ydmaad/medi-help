'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

interface Alert {
  id: string; // 고유한 ID를 추가합니다.
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
      id: `${alerts.length + 1}`, // 간단한 고유 ID를 생성합니다.
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

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Add Alert</button>
      <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)}>
        <h2>Set Alert</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Time:
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <button type="submit">Set Alert</button>
        </form>
      </Modal>
      <div>
        {alerts.map(alert => (
          <div key={alert.id}>
            <p>Time: {alert.time}</p>
            <p>Description: {alert.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
