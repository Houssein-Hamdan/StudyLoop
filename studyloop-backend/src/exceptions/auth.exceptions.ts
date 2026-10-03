import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(
      {
        status: HttpStatus.CONFLICT,
        message: `Email ${email} is already registered`,
        error: 'Conflict',
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Invalid email or password',
        error: 'Unauthorized',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class UserNotFoundException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
        error: 'Not Found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class ContainerNotFoundException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        message: 'Container not found',
        error: 'Not Found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class UnauthorizedContainerAccessException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.FORBIDDEN,
        message: 'You do not have permission to access this container',
        error: 'Forbidden',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class LessonNotFoundException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        message: 'Lesson not found',
        error: 'Not Found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class TopicNotFoundException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        message: 'Topic not found',
        error: 'Not Found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class UnauthorizedLessonAccessException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.FORBIDDEN,
        message: 'You do not have permission to access this lesson',
        error: 'Forbidden',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class QuizNotFoundException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        message: 'Quiz not found',
        error: 'Not Found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class InvalidQuizScopeException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid quiz scope or selected topics',
        error: 'Bad Request',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class QuizGenerationFailedException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to generate quiz questions',
        error: 'Internal Server Error',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class SummaryNotFoundException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        message: 'Summary not found',
        error: 'Not Found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class SummarizationFailedException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to generate summary',
        error: 'Internal Server Error',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class ProgressNotFoundException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        message: 'Progress record not found',
        error: 'Not Found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class QuestionNotFoundException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        message: 'Question not found',
        error: 'Not Found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class AIResponseFailedException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Failed to get response from AI service',
        error: 'Service Unavailable',
      },
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
