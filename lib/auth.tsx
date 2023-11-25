import { jwtVerify } from 'jose';
import CryptoES from 'crypto-es';
export function getJwtSecretKey() {
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;
  if (!secret) {
    throw new Error('JWT Secret key is not matched');
  }
  return new TextEncoder().encode(secret);
}

export async function verifyJwtToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload;
  } catch (error) {
    return null;
  }
}

export function encryptApiKey(email: string) {
  const secretKey = process.env.API_TOKEN_SECRET_KEY || '';
  const encrypted = CryptoES.AES.encrypt(email, secretKey);
  return encrypted.toString();
}

export function decryptApiKey(encryptedData: string) {
  const secretKey = process.env.API_TOKEN_SECRET_KEY;
  if (!secretKey) return false;
  const decrypted = CryptoES.AES.decrypt(encryptedData, secretKey);
  const email = decrypted.toString(CryptoES.enc.Utf8);

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return true;
  } else {
    return false;
  }
}
