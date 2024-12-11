import { Test, TestingModule } from '@nestjs/testing';
import { JobChangeStageService } from './job-change-stage.service';

describe('JobChangeStageService', () => {
  let service: JobChangeStageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobChangeStageService],
    }).compile();

    service = module.get<JobChangeStageService>(JobChangeStageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
