import {createRef} from 'react';

const history = [];

export const navigationRef = createRef();

export function navigate(name, params) {
  if (!navigationRef.current) {
    return;
  }

  navigationRef.current.navigate(name, params);
  
  history.push({
    name,
    params,
  });
}

export function navigateBack(){
  history.pop();

  if (!history.length) {
    return;
  }

  const { name, params } = history.pop();
  navigate(name, params);
}