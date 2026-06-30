import React from 'react';
import htm from 'htm';

// Vincula o HTM ao createElement do React de forma centralizada
export const html = htm.bind(React.createElement);
