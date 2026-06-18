/**
 * Utility to isolate localStorage data by user.
 * It reads the globally stored 'app_current_user_id' which is set in AuthContext.
 */

export function getAppStorage(key: string): string | null {
  if (typeof window === 'undefined') return null;
  const userId = window.localStorage.getItem('app_current_user_id');
  if (!userId) return null; // If no user is logged in, return null

  // Ensure we don't double namespace keys that are already namespaced
  if (key.includes('app_role_') || key.includes('app_subscription_') || key.includes('app_current_user_id')) {
    return window.localStorage.getItem(key);
  }

  return window.localStorage.getItem(`${key}_${userId}`);
}

export function setAppStorage(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  const userId = window.localStorage.getItem('app_current_user_id');
  if (!userId) return; // If no user is logged in, don't save

  if (key.includes('app_role_') || key.includes('app_subscription_') || key.includes('app_current_user_id')) {
    window.localStorage.setItem(key, value);
    return;
  }

  window.localStorage.setItem(`${key}_${userId}`, value);
}

export function removeAppStorage(key: string): void {
  if (typeof window === 'undefined') return;
  const userId = window.localStorage.getItem('app_current_user_id');
  if (!userId) return;

  if (key.includes('app_role_') || key.includes('app_subscription_') || key.includes('app_current_user_id')) {
    window.localStorage.removeItem(key);
    return;
  }

  window.localStorage.removeItem(`${key}_${userId}`);
}
