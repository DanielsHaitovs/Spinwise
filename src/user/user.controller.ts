import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBadRequestResponse, ApiBody, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateUserDto, GetUserDto, QueryRespsonse, UpdateUserDto } from './user.dto';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
	@ApiOperation({ summary: 'Create new User record', description: 'Saves new user and retrieves in case of successful operation' })
    @ApiBody({
        type: CreateUserDto,
        isArray: false,
        required: true,
        description: 'Create new User',
    })
    @ApiOkResponse({
        type: GetUserDto,
        isArray: true,
        description: 'Created new User',
        example: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@email.com'
        },
    })
    @ApiBadRequestResponse({
        description: 'User with such email already exists',
        example: {
            statusCode: 400,
            message: 'User with such email already exists',
            error: 'Bad Request',
        },
    })
    async createProduct(@Body() createUser: CreateUserDto): Promise<User> {
        return await this.userService.createUser(createUser);
    }

    @Get('by')
	@ApiOperation({ summary: 'Users Paginated Data and theirs amount', description: 'Query through users entity using OR operand for existing user properties with paginated result and counts the amount of users found based on provided filters query' })
    @ApiQuery({
        name: 'ids',
        type: String,
        isArray: true,
        required: false,
        description: 'Find Users IDs',
    })
    @ApiQuery({
        name: 'emails',
        type: String,
        isArray: true,
        required: false,
        description: 'Find Users Emails',
    })
    @ApiQuery({
        name: 'firstNames',
        type: String,
        isArray: true,
        required: false,
        description: 'Find Users First Names',
    })
    @ApiQuery({
        name: 'lastNames',
        type: String,
        isArray: true,
        required: false,
        description: 'Find Users Last Names',
    })
    @ApiQuery({
        name: 'page',
        type: Number,
        default: 1,
        required: true,
        description: 'Page Number to take',
    })
    @ApiQuery({
        name: 'limit',
        type: Number,
        required: true,
        default: 100,
        description: 'Limit per page',
    })
    async findBy(
        @Query('ids', new ParseArrayPipe({ items: Number, optional: true }) ) ids: number[],
        @Query('emails', new ParseArrayPipe({ optional: true })) emails: string[],
        @Query('firstNames', new ParseArrayPipe({ optional: true })) firstNames: string[],
        @Query('lastNames', new ParseArrayPipe({ optional: true })) lastNames: string[],
        @Query('page', new ParseIntPipe({ optional: true })) page: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
    ): Promise<QueryRespsonse<User>> {
        return await this.userService.findBy({ ids, emails, firstNames, lastNames, page, limit });
    }

    @Get(':id')
	@ApiOperation({ summary: 'User by Id', description: 'Retrieves user data by provided user id' })
    @ApiParam({
        name: 'id',
        type: String,
        required: true,
        description: 'User ID',
    })
    @ApiOkResponse({
        type: GetUserDto,
        isArray: false,
        description: 'Found User',
        example: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@email.com'
        }
    })
    @ApiBadRequestResponse({
        description: 'User with such email already exists',
        example: {
            statusCode: 400,
            message: 'User with such email already exists',
            error: 'Bad Request',
        },
    })
    async findById(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return await this.userService.findById(id);
    }

    @Put(':id')
	@ApiOperation({ summary: 'Update User by Id', description: 'Updates user data based on the provided user id, accepts partial user data' })
    @ApiParam({
        name: 'id',
        type: String,
        required: true,
        description: 'User ID',
    })
    @ApiBody({
        type: UpdateUserDto,
        isArray: false,
        required: true,
        description: 'Update User Data',
    })
    @ApiOkResponse({
        type: GetUserDto,
        isArray: false,
        description: 'Updated User',
        example: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@email.com'
        },
    })
    @ApiBadRequestResponse({
        description: 'User with such id does not exist',
        example: {
            statusCode: 400,
            message: 'User with such id does not exist',
            error: 'Bad Request',
        },
    })
    async updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<User> {
        return await this.userService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
	@ApiOperation({ summary: 'Delete User by Id', description: 'Deletes user record based on provided user id' })
    @ApiParam({
        name: 'id',
        type: String,
        required: true,
        description: 'User ID',
    })
    @ApiOkResponse({
        type: String,
        isArray: false,
        description: 'Deleted User',
        example: 'User Deleted Successfully',
    })
    @ApiBadRequestResponse({
        description: 'User with such id does not exist',
        example: {
            statusCode: 400,
            message: 'User with such id does not exist',
            error: 'Bad Request',
        },
    })
    async deleteUserById(@Param('id', ParseIntPipe) id: number): Promise<string> {
        return await this.userService.deleteById(id);
    }
}
