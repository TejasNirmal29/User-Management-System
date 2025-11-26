const MESSAGES = {
  SUCCESS: {
    USER_REGISTERED: "User registered successfully",
    USER_LOGGED_IN: "User logged in successfully",
    LOGOUT_SUCCESS: "Logged out successfully",
    OTP_SENT: "OTP sent successfully",
    OTP_VERIFIED: "OTP verified successfully",
    PASSWORD_UPDATED: "Password updated successfully",
  },
  ERROR: {
    SERVER_ERROR: "Internal server error",
    USER_NOT_FOUND: "User not found",
    USER_NOT_REGISTERED: "User registration failed",
    INVALID_CREDENTIALS: "Invalid credentials",
    EMAIL_ALREADY_EXISTS: "Email already exists",
    PHONE_ALREADY_EXISTS: "Phone number already exists",
    EMAIL_OR_PHONE_ALREADY_EXISTS: "Email or phone already exists",
    OTP_FAILED: "Failed to send OTP",
    OTP_INVALID_OR_EXPIRED: "OTP is invalid or expired",
    USER_PASSWORD_UPDATE_FAILED: "Failed to update password",
    INVALID_TOKEN_PROVIDED: "Invalid token provided",
    INVALID_OR_EXPIRED_TOKEN: "Invalid or expired token",
    NO_TOKEN_PROVIDED: "No token provided",
    INVALID_API_KEY: "Invalid API key",
    MISSING_API_KEY: "Missing API key",
    VALIDATION_FAILED: "Validation failed",
    BAD_REQUEST: "Bad request",
    UNAUTHORIZED: "Unauthorized access",
  },
};

export default MESSAGES;
