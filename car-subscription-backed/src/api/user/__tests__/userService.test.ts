import { StatusCodes } from 'http-status-codes';
import { Mock } from 'vitest';

import { User } from '@/api/user/userModel';
import { userRepository } from '@/api/user/userRepository';
import { userService } from '@/api/user/userService';

vi.mock('@/api/user/userRepository');
vi.mock('@/server', () => ({
  ...vi.importActual('@/server'),
  logger: {
    error: vi.fn(),
  },
}));

describe('userService', () => {
  const mockUsers: Partial<User>[] = [
    {
      _id: '6680193191098909bb256c74',
      firstName: 'kapish-yLnnQyPO',
      lastName: 'RInGoLQf',
      email: 'kapish-XtRr4qHE@example.com',
      age: 26,
    },
    {
      _id: '668025ad8595e1503e1b43af',
      firstName: 'kapish-gBiBzDtM',
      lastName: 'XjBIfpOi',
      email: 'kapish-za2Elmnn@example.com',
      age: 26,
    },
    {
      _id: '668025bd8595e1503e1b43b2',
      firstName: 'kapish-VZZPDJEQ',
      lastName: 'UergyVtH',
      email: 'kapish-0ikmV6Dt@example.com',
      age: 44,
    },
  ];

  describe('findAll', () => {
    it('return all users', async () => {
      // Arrange
      (userRepository.findAllAsync as Mock).mockReturnValue(mockUsers);

      // Act
      const result = await userService.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Users found');
      expect(result.responseObject).toEqual(mockUsers);
    });

    it('returns a not found error for no users found', async () => {
      // Arrange
      (userRepository.findAllAsync as Mock).mockReturnValue(null);

      // Act
      const result = await userService.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('No Users found');
      expect(result.responseObject).toBeNull();
    });

    it('handles errors for findAllAsync', async () => {
      // Arrange
      (userRepository.findAllAsync as Mock).mockRejectedValue(new Error('Database error'));

      // Act
      const result = await userService.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error finding all users');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('findById', () => {
    it('returns a user for a valid ID', async () => {
      // Arrange
      const testId = '6680193191098909bb256c74';
      const mockUser = mockUsers.find((user) => user._id === testId);
      (userRepository.findByIdAsync as Mock).mockReturnValue(mockUser);

      // Act
      const result = await userService.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('User found');
      expect(result.responseObject).toEqual(mockUser);
    });

    it('handles errors for findByIdAsync', async () => {
      // Arrange
      const testId = '6680193191098909bb256c74';
      (userRepository.findByIdAsync as Mock).mockRejectedValue(new Error('Database error'));

      // Act
      const result = await userService.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(`Error finding user with id ${testId}`);
      expect(result.responseObject).toBeNull();
    });

    it('returns a not found error for non-existent ID', async () => {
      // Arrange
      const testId = '6680193191098909bb256c74';
      (userRepository.findByIdAsync as Mock).mockReturnValue(null);

      // Act
      const result = await userService.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('User not found');
      expect(result.responseObject).toBeNull();
    });
  });
});
