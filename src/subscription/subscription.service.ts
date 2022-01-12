import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/createSubscription.dto';
import { UpdateSubscriptionDto } from './dto/updateSubscription.dto';
import { Subscription } from './enum/subscription.enum';
import { UserSubscription } from './subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(UserSubscription)
    private readonly subscriptionRepository: Repository<UserSubscription>
  ) {}

  async getAll() {
    return await this.subscriptionRepository.find();
  }

  async getByType(type: Subscription) {
    return await this.subscriptionRepository.findOne({ type })
  }

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const newSubscription = this.subscriptionRepository.create(createSubscriptionDto);
    await this.subscriptionRepository.save(newSubscription);
    return newSubscription;
  }

  async update(type: Subscription, updateSubscriptionDto: UpdateSubscriptionDto) {
    await this.subscriptionRepository.update(type, updateSubscriptionDto);
    return await this.subscriptionRepository.findOne({ type });
  }

  async delete(type: Subscription) {
    return await this.subscriptionRepository.delete({ type });
  }
}
