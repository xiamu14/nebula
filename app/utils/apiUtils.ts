/**
 * 统一的 API 响应格式
 */
export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 统一的错误处理函数
 */
export function handleApiError(error: unknown, context = "API operation"): Response {
  console.error(`${context} failed:`, error);
  
  const errorMessage = error instanceof Error ? error.message : "Internal server error";
  
  return Response.json(
    { 
      success: false,
      error: errorMessage 
    } satisfies ApiResponse,
    { status: 500 }
  );
}

/**
 * 验证必需字段
 */
export function validateRequired(data: Record<string, unknown>, required: string[]): void {
  const missing = required.filter(field =>
    data[field] === undefined || data[field] === null || data[field] === ""
  );
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}

/**
 * 创建成功响应
 */
export function createSuccessResponse<T>(data: T, status = 200): Response {
  return Response.json(
    {
      success: true,
      data
    } satisfies ApiResponse<T>,
    { status }
  );
}

/**
 * 创建错误响应
 */
export function createErrorResponse(error: string, status = 400): Response {
  return Response.json(
    {
      success: false,
      error
    } satisfies ApiResponse,
    { status }
  );
}

/**
 * 解析查询参数为整数
 */
export function parseIntParam(value: string | null, defaultValue?: number): number | undefined {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Invalid numeric parameter: ${value}`);
  }
  return parsed;
}

/**
 * 解析查询参数为浮点数
 */
export function parseFloatParam(value: string | null, defaultValue?: number): number | undefined {
  if (!value) return defaultValue;
  const parsed = parseFloat(value);
  if (isNaN(parsed)) {
    throw new Error(`Invalid numeric parameter: ${value}`);
  }
  return parsed;
}