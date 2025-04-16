import { Module } from '@nestjs/common';
import { BcryptAdapter } from './adapters/brcrypt.adapter';

@Module({
  providers: [ BcryptAdapter ],
  exports: [ BcryptAdapter]
})
export class CommonModule {}
