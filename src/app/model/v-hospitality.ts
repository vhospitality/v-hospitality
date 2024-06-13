export interface Tokens {
  access: string;
}

export interface Profile {
  id: string;
  data: string;
}

import { InjectionToken, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

export const IS_SERVER_PLATFORM = new InjectionToken<boolean>('Is server?', {
  factory() {
    return isPlatformServer(inject(PLATFORM_ID));
  },
});
