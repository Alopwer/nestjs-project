import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "./dto/createUserDto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}