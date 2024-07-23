"use client";

import React, { useState } from 'react';

interface Alert {
  time: string;
  description: string;
}

interface AlertFormProps {
  onAddAlert: (alert: Alert) => void;
}

const AlertForm: React.FC<AlertFormProps> = ({ onAddAlert }) => {
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAddAlert({ time, description });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="alertTime">Time:</label>
        <input id="alertTime" name="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="alertDescription">Description:</label>
        <input id="alertDescription" name="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <button type="submit">Add Alert</button>
    </form>
  );
};

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = (alert: Alert) => {
    setAlerts([...alerts, alert]);
    console.log('Alert added:', alert);

    fetch('/api/mypage/alerts/scheduleNotification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alert),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Alert data sent to server:', data);
      })
      .catch(error => {
        console.error('Failed to send alert data to server:', error);
      });
  };

  return (
    <div>
      <AlertForm onAddAlert={addAlert} />
      <div>
        {alerts.map((alert, index) => (
          <div key={index}>
            <p>Time: {alert.time}</p>
            {alert.description && <p>Description: {alert.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
