import { Test, TestingModule } from '@nestjs/testing';
import { ExitLogsController } from '../exit_logs.controller';
import { ExitLogsService } from '../exit_logs.service';

describe('ExitLogsController', () => {
  let controller: ExitLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExitLogsController],
      providers: [ExitLogsService],
    }).compile();

    controller = module.get<ExitLogsController>(ExitLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
