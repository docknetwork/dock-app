export function setGenericPassword(username, password, options = {}) {
  localStorage.setItem(
    `keychain-${options.service}`,
    JSON.stringify({
      username,
      password,
    })
  );
}

export function getGenericPassword({ service }) {
  try {
    return JSON.parse(localStorage.getItem(`keychain-${service}`));
  } catch (err) {
    return null;
  }
}

export function resetGenericPassword() {
  return null;
}

export function getSupportedBiometryType() {
  return Promise.resolve({});
}

export const BIOMETRY_TYPE = {
  TOUCH_ID: "TouchID",
  FACE_ID: "FaceID",
  FINGERPRINT: "Fingerprint",
  FACE: "Face",
  IRIS: "Iris",
};
