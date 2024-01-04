import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import SubscriptionForm from './components/SubscriptionForm';
import axios from 'axios';

const App = () => {
  const [lastSeen, setLastSeen] = useState('');
  const [message, setMessage] = useState(''); // For displaying feedback to the user

  useEffect(() => {
    const fetchLastSeen = async () => {
      try {
        const response = await axios.get('/.netlify/functions/lastSeen?itemName=champion%20kyra');
        if (response.data.lastSeenDate) {
          setLastSeen(response.data.lastSeenDate);
        } else {
          setMessage("Item's last seen time not found.");
        }
      } catch (error) {
        setMessage('Failed to fetch the last seen time.');
      }
    };

    fetchLastSeen();
  }, []);

  const handleSubscribe = async (email) => {
    try {
      const response = await axios.post('/.netlify/functions/subscribe', { email });
      setMessage(response.data.message || 'Successfully subscribed!');
    } catch (error) {
      setMessage(error.response?.data || 'Failed to subscribe. Please try again.');
    }
  };

  const handleUnsubscribe = async (email) => {
    try {
      const response = await axios.post('/.netlify/functions/unsubscribe', { email });
      setMessage(response.data.message || 'Successfully unsubscribed!');
    } catch (error) {
      setMessage(error.response?.data || 'Failed to unsubscribe. Please try again.');
    }
  };

  return (
    <div>
      <h1>Fortnite Item Tracker</h1>
      {message && <p>{message}</p>} 
      <Timer lastSeen={lastSeen} />
      <SubscriptionForm onSubscribe={handleSubscribe} onUnsubscribe={handleUnsubscribe} />
    </div>
  );
};

export default App;
