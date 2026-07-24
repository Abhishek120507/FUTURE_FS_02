export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Please enter a valid email address';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
}

export function validateRequired(value: string, field: string): string | null {
  if (!value.trim()) return `${field} is required`;
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone.trim()) return null;
  const re = /^[\d\s()+\-]{7,20}$/;
  if (!re.test(phone)) return 'Please enter a valid phone number';
  return null;
}
