import { useState, useEffect } from 'react';
import { getPrimaryUser, resolvePrimaryUser } from '../data/mock-names';
import type { MockUser } from '../data/mock-names';

/**
 * Returns the geo-resolved primary mock user.
 * Starts with the navigator.language guess (instant, no flash),
 * upgrades to the /api/geo result when it arrives.
 */
export function useMockUser(): MockUser {
  const [user, setUser] = useState<MockUser>(() => getPrimaryUser());

  useEffect(() => {
    resolvePrimaryUser().then(setUser);
  }, []);

  return user;
}
