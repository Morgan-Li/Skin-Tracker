import React, { useState } from 'react';

const SubscriptionForm = ({ scrolled, onSubscribe, onUnsubscribe }) => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);

  // A simple regex for validating an email format
  const emailRegex = /\S+@\S+\.\S+/;

  const validateEmail = (email) => {
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValid(validateEmail(newEmail));
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
      onSubscribe(email);
      setEmail('');
    }
  };

  const handleUnsubscribe = (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
        onUnsubscribe(email);
        setEmail('');
    }
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
            onChange={handleEmailChange}
            required
          />
          <button onClick={handleSubscribe} disabled={!isValid}>Subscribe</button>
          <button onClick={handleUnsubscribe} disabled={!isValid}>Unsubscribe</button>
        </form>
        {!isValid && <div style={{ color: 'red'}}>Please input a valid email address</div>}
      </div>
    </div>
  );
};

export default SubscriptionForm;
