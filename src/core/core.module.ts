import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SharedModule } from '../shared/shared.module';

@Global()
@Module({
  imports: [
    JwtModule.register({}),
    SharedModule,
    ClientsModule.register([
      {
        name: 'LINK_SERVICE',
        transport: Transport.TCP
      },
    ])
  ],
  exports: [JwtModule, SharedModule, ClientsModule],
})
export class CoreModule {}
