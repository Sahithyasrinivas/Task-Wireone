import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [Duration, setDuration] = useState('');
  const handleCheckIn = () => {
    axios.post("http://localhost:5000/checkin",{ userId })
      .then((response) => {
        setMessage('Checked in successfully.');
      })
      .catch((error) => {
        setMessage('Error: ' + error.message);
      });
  };

  const handleCheckOut = () => {
    axios.post("http://localhost:5000/checkout",{ userId })
      .then((response) => {
        setMessage('Checked out successfully.');
        setDuration(`Duration of stay: ${response.data.duration} milliseconds`);
      })
      .catch((error) => {
        setMessage('Error: ' + error.message);
      });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={handleCheckIn}>Check In</button>
      <button onClick={handleCheckOut}>Check Out</button>
      <p>{message}</p>
      <p>{Duration}</p>
    </div>
  );
};

export default App;
