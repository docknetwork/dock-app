
export function useLocales(locales) {
  // This hook can be used to handle translations later, for now this will just return the en languange
  return locales.en || locales;
}

