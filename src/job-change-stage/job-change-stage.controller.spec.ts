import { Test, TestingModule } from '@nestjs/testing';
import { JobChangeStageController } from './job-change-stage.controller';

describe('JobChangeStageController', () => {
  let controller: JobChangeStageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobChangeStageController],
    }).compile();

    controller = module.get<JobChangeStageController>(JobChangeStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
