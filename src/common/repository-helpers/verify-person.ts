import { ForbiddenException } from '@nestjs/common';
import { hashUtils } from 'src/lib/utils.lib';
import { FindOptionsWhere, Repository } from 'typeorm';

export async function verifyPerson<T>(
  repository: Repository<T>,
  query: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  inputPlainTextPassword: string,
  passwordFieldName: keyof T,
) {
  const record = await repository.findOne({ where: query });
  const passwordHash = record[passwordFieldName];
  const isMatch = await hashUtils.compare(inputPlainTextPassword, passwordHash as string);
  if (!isMatch) {
    throw new ForbiddenException('password incorrect');
  }
  return true;
}
