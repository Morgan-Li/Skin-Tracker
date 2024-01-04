import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import SubscriptionForm from './components/SubscriptionForm';
import axios from 'axios';

const App = () => {
  const [lastSeen, setLastSeen] = useState('');

  useEffect(() => {
    const fetchLastSeen = async () => {
      const response = await axios.get('/.netlify/functions/lastSeen?itemName=champion%20kyra');
      setLastSeen(response.data.lastSeenDate);
    };

    fetchLastSeen();
  }, []);

  const handleSubscribe = async (email) => {
    await axios.post('/.netlify/functions/subscribe', { email });
  };

  const handleUnsubscribe = async (email) => {
    await axios.post('/.netlify/functions/unsubscribe', { email });

  };

  return (
    <div>
      <h1>Fortnite Item Tracker</h1>
      <Timer lastSeen={lastSeen} />
      <SubscriptionForm onSubscribe={handleSubscribe} onUnsubscribe={handleUnsubscribe} />
    </div>
  );
};

export default App;
