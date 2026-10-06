import { Injectable } from '@nestjs/common';
import { GroqService } from './modules/groq/groq.service.js';
@Injectable()
export class AppService {
  constructor(private readonly groqService: GroqService) {}

  async testGroq() {
    return this.groqService.generateText(
      'Explain Clean Architecture in 3 simple sentences.',
    );
  }
  getHello(): string {
    return 'Hello World!';
  }
}
