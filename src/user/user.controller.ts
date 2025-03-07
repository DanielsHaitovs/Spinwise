import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBadRequestResponse, ApiBody, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { CreateUserDto, GetUserDto, UpdateUserDto } from './user.dto';
import { User } from '@prisma/client';
import { QueryRespsonse } from 'src/prisma/response.dto';

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
            email: 'johndoe@email.com',
        },
    })
    @ApiBadRequestResponse({
        description: 'User with such email already exists',
        example: {
            statusCode: 400,
            message: 'Tried to save new User with email that already exists',
            error: 'Bad Request',
        },
    })
    @ApiInternalServerErrorResponse({
        description: 'Could not save new User',
        example: {
            statusCode: 500,
            message: 'Unknown error occurred trying to create new User',
            error: 'Internal Server Error',
        },
    })
    async createProduct(@Body() createUser: CreateUserDto): Promise<User> {
        return await this.userService.createUser(createUser);
    }

    @Get('by')
    @ApiOperation({
        summary: 'Find Users with Paginated response and users amount',
        description: 'Query through users entity using OR operand for existing user properties with paginated result and counts the amount of users found based on provided filters query',
    })
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
    @ApiBadRequestResponse({
        description: 'Were not able to find any user with provided filter',
        example: {
            statusCode: 400,
            message: 'Could not find any user with provided filter',
            error: 'Bad Request',
        },
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal Server Error',
        example: {
            statusCode: 500,
            message: 'Unknown error occurred',
            error: 'Internal Server Error',
        },
    })
    async findBy(
        @Query('ids', new ParseArrayPipe({ items: Number, optional: true })) ids: number[],
        @Query('emails', new ParseArrayPipe({ optional: true })) emails: string[],
        @Query('firstNames', new ParseArrayPipe({ optional: true })) firstNames: string[],
        @Query('lastNames', new ParseArrayPipe({ optional: true })) lastNames: string[],
        @Query('page', new ParseIntPipe({ optional: true })) page: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
    ): Promise<QueryRespsonse<User>> {
        return await this.userService.findBy({ ids, emails, firstNames, lastNames, page, limit });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Find User by Id', description: 'Retrieves user data by provided user id' })
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
            email: 'johndoe@email.com',
        },
    })
    @ApiBadRequestResponse({
        description: 'User with such id does not exist',
        example: {
            statusCode: 400,
            message: 'Tried to find User with id that does not exist',
            error: 'Bad Request',
        },
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal Server Error',
        example: {
            statusCode: 500,
            message: 'Unknown error occurred trying to find User By Id',
            error: 'Internal Server Error',
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
            email: 'johndoe@email.com',
        },
    })
    @ApiBadRequestResponse({
        description: 'User with such id does not exist',
        example: {
            statusCode: 400,
            message: 'Tried to update User with id that does not exist',
            error: 'Bad Request',
        },
    })
    @ApiUnprocessableEntityResponse({
        description: 'User email must be unique',
        example: {
            statusCode: 422,
            message: 'Tried to update User email that already exists',
            error: 'Unprocessable Entity',
        },
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal Server Error',
        example: {
            statusCode: 500,
            message: 'Unknown error occurred trying to update User By Id',
            error: 'Internal Server Error',
        },
    })
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
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
            message: 'Tried to delete User with id that does not exist',
            error: 'Bad Request',
        },
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal Server Error',
        example: {
            statusCode: 500,
            message: 'Unknown error occurred trying to delete User By Id',
            error: 'Internal Server Error',
        },
    })
    async deleteUserById(@Param('id', ParseIntPipe) id: number): Promise<string> {
        return await this.userService.deleteById(id);
    }
}
