import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/createSubscription.dto';
import { UpdateSubscriptionDto } from './dto/updateSubscription.dto';
import { Subscription } from './enum/subscription.enum';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService
  ) {}

  @Get()
  async getAll() {
    return await this.subscriptionService.getAll(); 
  }

  @Get(':type')
  async getByType(@Param() type: Subscription) {
    return await this.subscriptionService.getByType(type);
  }

  @Post()
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return await this.subscriptionService.create(createSubscriptionDto);
  }

  @Put(':type')
  async update(@Param() type: Subscription, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return await this.subscriptionService.update(type, updateSubscriptionDto);
  }

  @Delete(':type')
  async delete(@Param() type: Subscription) {
    return await this.subscriptionService.delete(type);
  }
}
