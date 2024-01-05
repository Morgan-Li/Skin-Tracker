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
