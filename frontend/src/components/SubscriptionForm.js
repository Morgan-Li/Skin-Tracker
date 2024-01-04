import React, { useState } from 'react';

const SubscriptionForm = ({ onSubscribe, onUnsubscribe }) => {
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
    <div>
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
  );
};

export default SubscriptionForm;
