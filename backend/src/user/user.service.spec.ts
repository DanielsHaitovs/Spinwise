import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { CreateUserDto, UserQueryDto, UpdateUserDto } from './user.dto';

describe('UserService', () => {
    let userService: UserService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: PrismaService,
                    useValue: {
                        user: {
                            create: jest.fn(),
                            findUniqueOrThrow: jest.fn(),
                            findMany: jest.fn(),
                            count: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('createUser', () => {
        it('should create a user', async () => {
            const createUserDto: CreateUserDto = { email: 'test@example.com', firstName: 'Test', lastName: 'User' };
            const user: Partial<User> = { id: 1, ...createUserDto };

            jest.spyOn(prismaService.user, 'create').mockResolvedValue(user as User);

            expect(await userService.createUser(createUserDto)).toEqual(user);
        });

        it('should throw UnprocessableEntityException if email already exists', async () => {
            const createUserDto: CreateUserDto = { email: 'test@example.com', firstName: 'Test', lastName: 'User' };

            jest.spyOn(prismaService.user, 'create').mockRejectedValue({
                code: 'P2002',
            });

            await expect(userService.createUser(createUserDto)).rejects.toThrow(UnprocessableEntityException);
        });
    });

    describe('findById', () => {
        it('should find a user by id', async () => {
            const user: Partial<User> = { id: 1, email: 'test@example.com', firstName: 'Test', lastName: 'User' };

            jest.spyOn(prismaService.user, 'findUniqueOrThrow').mockResolvedValue(user as User);

            expect(await userService.findById(1)).toEqual(user);
        });

        it('should throw BadRequestException if id is invalid', async () => {
            await expect(userService.findById(0)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if user does not exist', async () => {
            jest.spyOn(prismaService.user, 'findUniqueOrThrow').mockRejectedValue({
                code: 'P2025',
            });

            await expect(userService.findById(1)).rejects.toThrow(BadRequestException);
        });
    });

    describe('findBy', () => {
        it('should find users by filter', async () => {
            const filter: UserQueryDto = { ids: [1], emails: ['test@example.com'], firstNames: ['Test'], lastNames: ['User'], limit: 10, page: 1 };
            const users: Partial<User>[] = [{ id: 1, email: 'test@example.com', firstName: 'Test', lastName: 'User' }];
            const count = 1;

            jest.spyOn(prismaService.user, 'count').mockResolvedValue(count);
            jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(users as User[]);

            expect(await userService.findBy(filter)).toEqual({ count, data: users });
        });

        it('should throw NotFoundException if no users found', async () => {
            const filter: UserQueryDto = { ids: [1], emails: ['test@example.com'], firstNames: ['Test'], lastNames: ['User'], limit: 10, page: 1 };

            jest.spyOn(prismaService.user, 'count').mockResolvedValue(0);
            jest.spyOn(prismaService.user, 'findMany').mockResolvedValue([]);

            await expect(userService.findBy(filter)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateUser', () => {
        it('should update a user', async () => {
            const updateUserDto: UpdateUserDto = { email: 'updated@example.com', firstName: 'Updated', lastName: 'User' };
            const user: Partial<User> = { id: 1, ...updateUserDto };

            jest.spyOn(prismaService.user, 'update').mockResolvedValue(user as User);

            expect(await userService.updateUser(1, updateUserDto)).toEqual(user);
        });

        it('should throw BadRequestException if id is invalid', async () => {
            const updateUserDto: UpdateUserDto = { email: 'updated@example.com', firstName: 'Updated', lastName: 'User' };

            await expect(userService.updateUser(0, updateUserDto)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if user does not exist', async () => {
            const updateUserDto: UpdateUserDto = { email: 'updated@example.com', firstName: 'Updated', lastName: 'User' };

            jest.spyOn(prismaService.user, 'update').mockRejectedValue({
                code: 'P2025',
            });

            await expect(userService.updateUser(1, updateUserDto)).rejects.toThrow(BadRequestException);
        });

        it('should throw UnprocessableEntityException if email already exists', async () => {
            const updateUserDto: UpdateUserDto = { email: 'updated@example.com', firstName: 'Updated', lastName: 'User' };

            jest.spyOn(prismaService.user, 'update').mockRejectedValue({
                code: 'P2002',
            });

            await expect(userService.updateUser(1, updateUserDto)).rejects.toThrow(UnprocessableEntityException);
        });
    });

    describe('deleteById', () => {
        it('should delete a user by id', async () => {
            const user: User = { id: 1, email: 'test@example.com', firstName: 'Test', lastName: 'User', createdAt: new Date(), updatedAt: new Date() };

            jest.spyOn(prismaService.user, 'delete').mockResolvedValue(user);

            expect(await userService.deleteById(1)).toEqual('User with id 1 was deleted Successfully');
        });

        it('should throw BadRequestException if id is invalid', async () => {
            await expect(userService.deleteById(0)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if user does not exist', async () => {
            jest.spyOn(prismaService.user, 'delete').mockRejectedValue({
                code: 'P2025',
            });

            await expect(userService.deleteById(1)).rejects.toThrow(BadRequestException);
        });
    });
});
