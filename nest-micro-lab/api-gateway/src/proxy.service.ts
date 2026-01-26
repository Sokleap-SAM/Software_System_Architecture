import { Injectable, BadGatewayException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// Retryable error codes (network/timeout issues)
const RETRYABLE_ERRORS = ['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN'];

// Only retry idempotent methods
const RETRYABLE_METHODS = ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'];

@Injectable()
export class ProxyService {
  constructor(private http: HttpService) {}

  async forward(options: {
    baseUrl: string;
    method: string;
    path: string;
    headers: Record<string, any>;
    query: any;
    body: any;
    timeout?: number;
    retries?: number;
  }): Promise<{ status: number; data: any; headers: Record<string, any> }> {
    const url = `${options.baseUrl}${options.path}`;
    const timeout = options.timeout ?? 8000;
    const maxRetries = options.retries ?? 2;
    const canRetry = RETRYABLE_METHODS.includes(options.method.toUpperCase());

    const headers = { ...options.headers };
    delete headers['host'];
    delete headers['content-length'];

    let lastError: any;

    for (let attempt = 0; attempt <= (canRetry ? maxRetries : 0); attempt++) {
      try {
        if (attempt > 0) {
          // Exponential backoff: 100ms, 200ms, 400ms...
          const delay = Math.min(100 * Math.pow(2, attempt - 1), 1000);
          await this.sleep(delay);
          console.log(`[Retry ${attempt}/${maxRetries}] ${options.method} ${url}`);
        }

        const res = await firstValueFrom(
          this.http.request({
            url,
            method: options.method as any,
            params: options.query,
            data: options.body,
            headers,
            timeout,
            validateStatus: () => true, // forward status codes instead of throwing
          }),
        );

        return { status: res.status, data: res.data, headers: res.headers };
      } catch (error) {
        lastError = error;
        const isRetryable = RETRYABLE_ERRORS.includes(error.code);

        if (!isRetryable || !canRetry || attempt >= maxRetries) {
          console.error('--- PROXY DEBUG ---');
          console.error('Target URL:', url);
          console.error('Error Code:', error.code);
          console.error('Error Message:', error.message);
          console.error('Attempts:', attempt + 1);
          throw new BadGatewayException(`Upstream Error: ${error.code}`);
        }
      }
    }

    throw new BadGatewayException(`Upstream Error after ${maxRetries} retries: ${lastError?.code}`);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
