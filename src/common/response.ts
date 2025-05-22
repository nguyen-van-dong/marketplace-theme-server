import { get, set } from 'lodash';

function deepPickObject<T>(item: T, fields: string[]): any {
  const picked: any = {};
  for (const field of fields) {
    const value = get(item, field);
    if (value !== undefined) {
      set(picked, field, value);
    }
  }
  return picked;
}

function deepPick<T>(data: T | T[], fields?: (keyof T | string)[]): any {
  if (!fields) return data;

  if (Array.isArray(data)) {
    return data.map(item => deepPickObject(item, fields as string[]));
  }

  return deepPickObject(data, fields as string[]);
}

export function successResponse<T = any>(
  data: T,
  fields?: (keyof T | string)[],
  message = 'Success',
) {
  const filtered = deepPick(data, fields);
  return {
    success: true,
    data: filtered,
    message,
  };
}

export function successArrayResponse<T = any>(
  data: T[],
  fields: (keyof T | string)[],
  message = 'Success'
) {
  const filtered = deepPick(data, fields);
  return {
    success: true,
    data: filtered,
    total: filtered.length,
    message,
  };
}

export function successPaginatedResponse<T = any>(options: {
  data: T[];
  page: number;
  limit: number;
  total: number;
  fields?: (keyof T | string)[];
  message?: string;
}) {
  const { data, page, limit, total, fields, message = 'Success' } = options;
  const result = deepPick(data, fields);

  return {
    success: true,
    data: result,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    message,
  };
}

export function errorResponse(message = 'Something went wrong', data: any = null) {
  return {
    success: false,
    data,
    message,
  };
}
