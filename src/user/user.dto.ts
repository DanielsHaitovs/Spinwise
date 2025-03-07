import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UserDto {
    @ApiProperty({
        title: 'User First Name',
        type: String,
        nullable: false,
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty({
        title: 'User Last Name',
        type: String,
        nullable: false,
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty({
        title: 'User Email',
        type: String,
        nullable: false,
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    email: string;
}

export class CreateUserDto extends UserDto {}

export class GetUserDto extends CreateUserDto {
    @ApiProperty({
        title: 'User ID',
        type: Number,
        nullable: false,
        required: true,
    })
    @IsNotEmpty()
    @IsNumber()
    id: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UserQueryDto {
    @ApiProperty({
        title: 'Find Users IDs',
        type: Number,
        isArray: true,
        nullable: false,
        required: true,
    })
    @IsNotEmpty()
    @IsNumber({}, { each: true })
    ids: number[];

    @ApiProperty({
        title: 'Find Users Emails',
        type: String,
        isArray: true,
        nullable: false,
        required: true,
    })
    @IsNotEmpty()
    @IsString({ each: true })
    emails: string[];

    @ApiProperty({
        title: 'Find Users First Names',
        type: String,
        isArray: true,
        nullable: false,
        required: true,
    })
    @IsNotEmpty()
    @IsString({ each: true })
    firstNames: string[];

    @ApiProperty({
        title: 'Find Users Last Names',
        type: String,
        isArray: true,
        nullable: false,
        required: true,
    })
    @IsNotEmpty()
    @IsString({ each: true })
    lastNames: string[];

    @ApiProperty({ type: Number, description: 'Page number' })
    @IsNumber()
    @Min(1)
    @IsOptional()
    page?: number;

    @ApiProperty({ type: Number, description: 'Number of items per page' })
    @IsNumber()
    @Min(1)
    @IsOptional()
    limit?: number;
}
