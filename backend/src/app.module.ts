import { Module } from '@nestjs/common';
import { PrismaModule } from '@PrismaDb/prisma.module';
import { UserModule } from '@User/user.module';

@Module({
    imports: [PrismaModule, UserModule],
})
export class AppModule {}
