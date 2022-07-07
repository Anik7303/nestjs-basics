import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export async function generateHash(
  password: string,
  salt: string,
): Promise<string> {
  const buffer = (await scrypt(password, salt, 32)) as Buffer;
  return buffer.toString('hex');
}

export async function transformPassword(password: string): Promise<string> {
  // generate a salt
  const salt: string = randomBytes(8).toString('hex');
  // generate hash with salt
  const hash = await generateHash(password, salt);
  // join hashed result and salt together
  return `${hash}.${salt}`;
}
