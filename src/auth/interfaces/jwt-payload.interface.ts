

export interface JwtPayload {
    id?: string;
    email?: string;
    isValidationToken?: boolean; // Nuevo campo
  }