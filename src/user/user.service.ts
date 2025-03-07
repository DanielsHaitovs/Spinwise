import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UserQueryDto, QueryRespsonse, UpdateUserDto } from './user.dto';
import { User } from '@prisma/client';
import { UserWhereOrQuery } from './user.type';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {}

    async createUser(data: CreateUserDto): Promise<User> {
        try {
            return await this.prismaService.user.create({
                data,
            });
        } catch (e) {
            if (e.code === 'P2002') {
                throw new BadRequestException(`User with such email already exists ${data.email}`);
            }

            throw new InternalServerErrorException(e);
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
        }catch(e) {
            if (e.code === 'P2025') {
                throw new BadRequestException(`User with such id does not exist ${id}`);
            }

            throw new InternalServerErrorException(e);
        }
    }

    async findBy(filter: UserQueryDto): Promise<QueryRespsonse<User>> {
        try {
            const { ids, emails, firstNames, lastNames } = filter;
            let { page: skip, limit: take } = filter;

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
                where['firstName'] = {
                    in: firstNames,
                };
            }
    
            if (lastNames != undefined && lastNames.length > 0) {
                where['lastName'] = {
                    in: lastNames,
                };
            }

            if (skip !== undefined && skip > 0 && take !== undefined && take > 0) {
                skip = (skip -1) * take;
            }

            const [count, users] = await Promise.all([
                this.prismaService.user.count({
                    where
                }),
                this.prismaService.user.findMany({
                    where,
                    skip,
                    take,
                }),
            ]);

            if (users == undefined) {
                throw new BadRequestException(`Could not find any user with provided filter ${JSON.stringify(filter)}`);
            }
    
            if (count === 0) {
                return {
                    count: 0,
                    data: [],
                }
            }

            return {
                count,
                data: users,
            };

        } catch (e) {
            throw new InternalServerErrorException(e);
        }
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
            if (e.code === 'P2025') {
                throw new BadRequestException(`User with such id does not exist ${id}`);
            }

            if (e.code === 'P2002') {
                throw new BadRequestException(`User with such email already exists ${data.email}`);
            }
    
            throw new InternalServerErrorException(e);
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
            if (e.code === 'P2025') {
                throw new BadRequestException(`User with such id does not exist ${id}`);
            }

            throw new InternalServerErrorException(e);
        }
    }
}
