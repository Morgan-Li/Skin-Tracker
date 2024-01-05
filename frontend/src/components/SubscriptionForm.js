import React, { useState } from 'react';

const SubscriptionForm = ({ scrolled, onSubscribe, onUnsubscribe }) => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    onSubscribe(email);
    setEmail('');
  };

  const handleUnsubscribe = (e) => {
    e.preventDefault();
    onUnsubscribe(email);
    setEmail('');
  };

  return (
    <div className={`subscription-box ${scrolled ? 'scrolled' : ''}`}>
      <div className="form-container"> 
        <h1 id="form-header">Join our mailing list!</h1>
        <h4 id="form-disclaimer"> Subscribe to our mailing list to be notified via email as soon as your favourite skin (Chun-Li) appears in the shop! </h4>
        <form>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button onClick={handleSubscribe}>Subscribe</button>
          <button onClick={handleUnsubscribe}>Unsubscribe</button>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionForm;
