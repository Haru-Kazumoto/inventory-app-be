import { Test, TestingModule } from '@nestjs/testing';
import { ExitLogsService } from '../exit_logs.service';

describe('ExitLogsService', () => {
  let service: ExitLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExitLogsService],
    }).compile();

    service = module.get<ExitLogsService>(ExitLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
