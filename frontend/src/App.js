import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import SubscriptionForm from './components/SubscriptionForm';
import axios from 'axios';
import downArrow from './Assets/circle-arrow-down-solid.svg';
import githubIcon from './Assets/github-icon.svg';

const App = () => {
  const [lastSeen, setLastSeen] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const scrollToForm = () => {
    const formElement = document.getElementById('subscription-form');
    if (formElement) {
      const formPosition = formElement.offsetTop;
      window.scrollTo({
        top: formPosition, 
        behavior: "smooth" 
      });
      setScrolled(true); 
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.pageYOffset || document.documentElement.scrollTop;
      setScrolled(offset > 50); 
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchLastSeen = async () => {
      const itemName = encodeURIComponent(process.env.REACT_APP_SKIN_TO_TRACK).toLowerCase(); 
      try {
        const response = await axios.get(`/.netlify/functions/lastSeen?itemName=${itemName}`);
        if (response.data.lastSeenDate) {
          setLastSeen(response.data.lastSeenDate);
        } else {
          alert(`Item's last seen time not found for ${itemName}.`);
        }
      } catch (error) {
        alert(`Failed to fetch the last seen time for ${itemName}.`);
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
      <a href="https://github.com/Morgan-Li/Skin-Tracker" 
        target="_blank" 
        rel="noopener noreferrer"> 
        <img
          src={githubIcon}
          className='github-icon'
          alt="GitHub Repo"
        />
      </a>

      {!scrolled && (
        <img
          src={downArrow}
          alt="Scroll down"
          className="down-arrow"
          onClick={scrollToForm}
        />
      )}
      <Timer lastSeen={lastSeen} />
      <SubscriptionForm id="subscription-form" scrolled={scrolled} onSubscribe={handleSubscribe} onUnsubscribe={handleUnsubscribe} />
    </div>
  );
};

export default App;
