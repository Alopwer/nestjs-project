import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwtAuth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {}
