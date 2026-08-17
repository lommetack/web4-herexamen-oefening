const checkPasswordStrength = (password) => {
  let score = 0;

  if (!password) return score;

  // Length check
  if (password.length >= 8) score++;

  // Contains both lower and uppercase letters
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;

  // Contains numbers
  if (/\d/.test(password)) score++;

  // Contains special characters
  if (/[^a-zA-Z\d]/.test(password)) score++;

  return score;
};

export { checkPasswordStrength };
