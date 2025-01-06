import { Test, TestingModule } from '@nestjs/testing';
import { RecommendKeywordService } from './recommend-keyword.service';

describe('RecommendKeywordService', () => {
  let service: RecommendKeywordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecommendKeywordService],
    }).compile();

    service = module.get<RecommendKeywordService>(RecommendKeywordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
