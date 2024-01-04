import React, { useEffect, useState } from 'react';

const Timer = ({ lastSeen }) => {
  const [timeSinceLastSeen, setTimeSinceLastSeen] = useState('');

  useEffect(() => {
    const updateTimeSinceLastSeen = () => {
      const lastSeenDate = new Date(lastSeen);
      const now = new Date();
      const difference = now - lastSeenDate;

      // Convert the difference to a readable format (days, hours, minutes, seconds)
      let seconds = Math.floor(difference / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      let days = Math.floor(hours / 24);

      hours %= 24;
      minutes %= 60;
      seconds %= 60;

      setTimeSinceLastSeen(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    // Update the timer every second
    const intervalId = setInterval(updateTimeSinceLastSeen, 1000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [lastSeen]);

  return (
    <div>
      <p>Last seen: {lastSeen}</p>
      <p>Time since last seen: {timeSinceLastSeen}</p>
    </div>
  );
};

export default Timer;
