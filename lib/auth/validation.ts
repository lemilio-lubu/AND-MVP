import { RegisterCompanyInput } from "./types";

export function validateEmail(email: string): boolean {
  const value = email.trim().toLowerCase();
  if (!value) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

export function validateRuc(ruc: string): boolean {
  const normalized = ruc.replace(/\D/g, "");
  return normalized.length >= 10 && normalized.length <= 13;
}

export function validatePasswordStrength(password: string): boolean {
  if (password.length < 8) return false;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  return hasUppercase && hasLowercase && hasNumber;
}

export function validateCompanyRegistration(input: RegisterCompanyInput): string[] {
  const errors: string[] = [];

  if (!input.companyName.trim()) errors.push("El nombre de la empresa es obligatorio");
  if (!validateEmail(input.email)) errors.push("El correo corporativo no es válido");
  if (!validateRuc(input.ruc)) errors.push("El RUC/identificación fiscal no es válido");
  if (!input.telefono.trim()) errors.push("El teléfono es obligatorio");
  if (!input.ciudad.trim()) errors.push("La ciudad es obligatoria");
  if (!validatePasswordStrength(input.password)) {
    errors.push("La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula y número");
  }

  return errors;
}
