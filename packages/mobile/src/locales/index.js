import I18n from "i18n-js";

import en from './languages/en.json';

I18n.fallbacks = true;
I18n.defaultLocale = 'en';
I18n.translations = {
	en,
}

export function translate(name, params = {}) {
	return I18n.t(name, params);
}
