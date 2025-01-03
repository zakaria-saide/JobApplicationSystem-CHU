// DomainContext.js
import React from 'react';

const DomainContext = React.createContext({
  selectedDomain: 'Sante', // Default value
  setSelectedDomain: () => {}
});

export default DomainContext;
