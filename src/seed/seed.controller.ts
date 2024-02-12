import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles-interface';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @ApiResponse({ status: 200, description: 'Seed Executed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  @Auth(ValidRoles.superuser)
  executeSeed() {
    return this.seedService.runSeed();
  }  
}
