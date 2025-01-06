import { Test, TestingModule } from '@nestjs/testing';
import { RecommendKeywordController } from './recommend-keyword.controller';

describe('RecommendKeywordController', () => {
  let controller: RecommendKeywordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecommendKeywordController],
    }).compile();

    controller = module.get<RecommendKeywordController>(RecommendKeywordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
