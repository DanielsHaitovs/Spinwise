import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';

import { Prisma, User } from '@prisma/client';
import { PrismaService } from '@PrismaDb/prisma.service';

import { CreateUserDto, UserQueryDto, UpdateUserDto } from './user.dto';
import { QueryRespsonse } from '@PrismaDb/response.dto';
import { UserWhereOrQuery } from '../prisma/query.type';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {}

    async createUser(data: CreateUserDto): Promise<User> {
        try {
            return await this.prismaService.user.create({
                data,
            });
        } catch (e) {
            const error = e as Prisma.PrismaClientKnownRequestError;

            if (error.code === 'P2002') {
                throw new UnprocessableEntityException(`User with such email already exists ${data.email}`);
            }

            throw e;
        }
    }

    async findById(id: number): Promise<User> {
        if (id == undefined || id === 0) {
            throw new BadRequestException('Provided invalid User ID which is required to find User');
        }

        try {
            return await this.prismaService.user.findUniqueOrThrow({
                where: {
                    id,
                },
            });
        } catch (e) {
            const error = e as Prisma.PrismaClientKnownRequestError;

            if (error.code === 'P2025') {
                throw new BadRequestException(`User with such id does not exist ${id}`);
            }

            throw e;
        }
    }

    async findBy(filter: UserQueryDto): Promise<QueryRespsonse<User>> {
        const { ids, emails, firstNames, lastNames, limit: take } = filter;
        let { page: skip } = filter;

        const where: UserWhereOrQuery = {
            OR: [],
        };

        if (ids != undefined && ids.length > 0) {
            where.OR.push({
                id: {
                    in: ids,
                },
            });
        }

        if (emails != undefined && emails.length > 0) {
            where.OR.push({
                email: {
                    in: emails,
                },
            });
        }

        if (firstNames != undefined && firstNames.length > 0) {
            where.OR.push({
                firstName: {
                    in: firstNames,
                },
            });
        }

        if (lastNames != undefined && lastNames.length > 0) {
            where.OR.push({
                lastName: {
                    in: lastNames,
                },
            });
        }

        if (where.OR.length === 0) {
            where.OR = [];
        }

        if (skip !== undefined && skip > 0 && take !== undefined && take > 0) {
            skip = (skip - 1) * take;
        }

        const [count, users] = await Promise.all([
            this.prismaService.user.count({
                where: where.OR.length > 0 ? where : undefined,
            }),
            this.prismaService.user.findMany({
                where: where.OR.length > 0 ? where : undefined,
                skip,
                take,
            }),
        ]);

        if (users == undefined || count == undefined) {
            throw new BadRequestException(`Could not find any user with provided filter ${JSON.stringify(filter)}`);
        }

        if (count === 0) {
            return {
                count: 0,
                data: [],
            };
        }

        return {
            count,
            data: users,
        };
    }

    async updateUser(id: number, data: UpdateUserDto): Promise<User> {
        if (id == undefined || id === 0) {
            throw new BadRequestException('Provided invalid User ID which is required to update User');
        }

        try {
            return await this.prismaService.user.update({
                where: { id },
                data,
            });
        } catch (e) {
            const error = e as Prisma.PrismaClientKnownRequestError;

            if (error.code === 'P2025') {
                throw new BadRequestException(`User with such id does not exist ${id}`);
            }

            if (error.code === 'P2002') {
                throw new UnprocessableEntityException(`User with such email already exists ${data.email}`);
            }

            throw e;
        }
    }

    async deleteById(id: number): Promise<string> {
        if (id == undefined || id === 0) {
            throw new BadRequestException('Provided invalid User ID which is required to delete User');
        }

        try {
            await this.prismaService.user.delete({
                where: {
                    id,
                },
            });

            return `User with id ${id} was deleted Successfully`;
        } catch (e) {
            const error = e as Prisma.PrismaClientKnownRequestError;

            if (error.code === 'P2025') {
                throw new BadRequestException(`User with such id does not exist ${id}`);
            }

            throw e;
        }
    }
}
