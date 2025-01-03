import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TestComponent = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/api/test/GetTest')
      .then(response => {
        setMessage(response.data);
      })
      .catch(error => {
        console.error("Il y a eu une erreur!", error);
      });
  }, []);

  return (
    <div>
      <h1>Message du backend:</h1>
      <p>{message}</p>
    </div>
  );
}

export default TestComponent;
