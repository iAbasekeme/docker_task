import { Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

const logger = new Logger(deleteEntity.name);

export async function deleteEntity<T>(
  repository: Repository<T>,
  id: any,
): Promise<void> {
  try {
    // Attempt hard delete
    const result = await repository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Entity not found or already deleted');
    }

    logger.log('Hard delete successful');
  } catch (error) {
    logger.log('Hard delete failed, attempting soft delete:', error.message);

    // Fallback to soft delete
    await repository.softDelete(id);

    logger.log('Soft delete successful');
  }
}
