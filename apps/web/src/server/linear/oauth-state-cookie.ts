// Shared between the Linear OAuth `/install` (sets) and `/callback` (reads,
// deletes) routes. The two MUST agree, so the constant lives in one place.
export const LINEAR_OAUTH_STATE_COOKIE = "linear_oauth_state";
export const LINEAR_OAUTH_STATE_COOKIE_MAX_AGE_S = 600;
