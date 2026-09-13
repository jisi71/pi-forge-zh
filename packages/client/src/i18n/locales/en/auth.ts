/**
 * auth — English strings.
 *
 * Sign-in and first-login password-change screens
 * (`components/LoginScreen.tsx`, `components/ChangePasswordScreen.tsx`).
 *
 * English is the reference language: the key set defined here is the
 * contract every other locale is checked against.
 *
 * Server error CODES (`invalid_password`, `username_required`, …) are
 * identifiers, never translated — only the surrounding sentences are.
 */

export const auth = {
  login: {
    subtitleLdap: "Sign in with your LDAP account.",
    subtitlePassword: "Enter the {appName} password to continue.",
    // Field labels reuse `common.username` / `common.password`; the
    // submit label reuses `common.signIn`.
    submitting: "Signing in…",
    bannerAriaLabel: "Authentication notice",
    errorInvalidCredentialsLdap: "Incorrect username, password, or LDAP group.",
    errorInvalidPassword: "Incorrect password.",
    errorUsernameRequired: "Username is required.",
    errorFailed: "Login failed: {code}",
  },

  changePassword: {
    title: "Set a new password",
    subtitle:
      "You signed in with the deployment-supplied initial password. Pick a new one before continuing — it will be stored as a hash on the {appName} data volume.",
    currentLabel: "Current password",
    newLabel: "New password",
    confirmLabel: "Confirm new password",
    submit: "Set new password",
    // The in-flight and sign-out labels reuse `common.saving` /
    // `common.signOut`.
    errorTooShort: "new password must be at least {min} characters",
    errorMismatch: "new password and confirmation do not match",
    errorSameAsCurrent: "new password must differ from the current one",
    remoteIncorrectCurrent: "Current password is incorrect.",
    remotePasswordUnchanged: "New password must differ from the current one.",
    remoteNotConfigured: "Password auth is not configured on this server.",
    remoteSessionExpired: "Session expired — sign in again.",
    remoteFailed: "Could not change password: {code}",
  },
} as const;
