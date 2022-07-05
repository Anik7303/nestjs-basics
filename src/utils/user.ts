import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export async function transformPassword(password: string): Promise<string> {
  // generate a salt
  const salt: string = randomBytes(8).toString('hex');
  // hash salt and password together
  const buffer = (await scrypt(password, salt, 32)) as Buffer;
  // join hashed result and salt together
  const hash = `${buffer.toString('hex')}.${salt}`;
  // return hashed and salted password
  return hash;
}

export async function generatePasswordHashWithSalt(
  password: string,
  salt: string,
): Promise<string> {
  const buffer = (await scrypt(password, salt, 32)) as Buffer;
  const hash = buffer.toString('hex');
  return hash;
}
