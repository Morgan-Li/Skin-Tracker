import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import SubscriptionForm from './components/SubscriptionForm';
import axios from 'axios';

const App = () => {
  const [lastSeen, setLastSeen] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {

    const handleScroll = () => {
      const offset = window.pageYOffset || document.documentElement.scrollTop;
      setScrolled(offset > 50); // Set scrolled state based on the scroll position
    };

    // Add the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchLastSeen = async () => {
      try {
        const response = await axios.get('/.netlify/functions/lastSeen?itemName=champion%20kyra');
        if (response.data.lastSeenDate) {
          setLastSeen(response.data.lastSeenDate);
        } else {
          alert("Item's last seen time not found.");
        }
      } catch (error) {
        alert('Failed to fetch the last seen time.');
      }
    };

    fetchLastSeen();
  }, []);

  const handleSubscribe = async (email) => {
    try {
      const response = await axios.post('/.netlify/functions/subscribe', { email });
      alert(response.data.message || 'Successfully subscribed. Thank you!');
    } catch (error) {
      alert(error.response?.data || 'Failed to subscribe. Please try again.');
    }
  };

  const handleUnsubscribe = async (email) => {
    try {
      const response = await axios.post('/.netlify/functions/unsubscribe', { email });
      alert(response.data.message || 'Successfully unsubscribed. Goodbye!');
    } catch (error) {
      alert(error.response?.data || 'Failed to unsubscribe. Please try again.');
    }
  };

  return (
    <div className="content-container">
      <Timer lastSeen={lastSeen} />
      <SubscriptionForm scrolled={scrolled} onSubscribe={handleSubscribe} onUnsubscribe={handleUnsubscribe} />
    </div>
  );
};

export default App;
