import {createNavigationContainerRef} from '@react-navigation/native';

let history = [];

export const navigationRef = createNavigationContainerRef();

export const getNavigationHistory = () => history;
export const clearNavigationHistory = () => (history = []);

export function navigate(name, params, skipFromHistory) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
    if (skipFromHistory) {
      return;
    }
    history.push({
      name,
      params,
    });
  }
}

export function getHistory() {
  return history;
}

export function navigateBack() {
  history.pop();

  if (!history.length) {
    return;
  }

  const {name, params} = history.pop();
  navigationRef.goBack();
  // navigate(name, params);
}
