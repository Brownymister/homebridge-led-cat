import { API } from 'homebridge';

import { PLATFORM_NAME } from './settings';
import { LedCatPlatform } from './platform';

/**
 * This method registers the platform with Homebridge
 */
export = (api: API) => {
  api.registerPlatform(PLATFORM_NAME, LedCatPlatform);
};
