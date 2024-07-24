'use client';

import React, { useState } from 'react';

const Alerts = () => {
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch('/api/mypage/alerts/scheduleNotification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ time, description })
    });

    if (!response.ok) {
      console.error('Failed to schedule alert');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Time:
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
      </label>
      <label>
        Description:
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <button type="submit">Set Alert</button>
    </form>
  );
};

export default Alerts;
