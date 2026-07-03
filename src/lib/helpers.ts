// import { getAuth } from "@/auth/lib/helpers";
// import { apiConfig } from "@/config/api.config";

export const throttle = (
  func: (...args: unknown[]) => void,
  limit: number,
): ((...args: unknown[]) => void) => {
  let lastFunc: ReturnType<typeof setTimeout> | null = null;
  let lastRan: number | null = null;

  return function (this: unknown, ...args: unknown[]) {
    if (lastRan === null) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      if (lastFunc !== null) {
        clearTimeout(lastFunc);
      }
      lastFunc = setTimeout(
        () => {
          if (Date.now() - (lastRan as number) >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - (lastRan as number)),
      );
    }
  };
};

// export function debounce<T extends (...args: unknown[]) => unknown>(
//   func: T,
//   wait: number,
// ): (...args: Parameters<T>) => void {
//   let timeout: NodeJS.Timeout | null = null;

//   return function (...args: Parameters<T>): void {
//     if (timeout) {
//       clearTimeout(timeout);
//     }

//     timeout = setTimeout(() => {
//       func(...args);
//     }, wait);
//   };
// }

export const debounce = <T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

export function uid(): string {
  return (Date.now() + Math.floor(Math.random() * 1000)).toString();
}

export function getInitials(
  name: string | null | undefined,
  count?: number,
): string {
  if (!name || typeof name !== 'string') {
    return '';
  }

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase());

  return count && count > 0
    ? initials.slice(0, count).join('')
    : initials.join('');
}

export function toAbsoluteUrl(pathname: string): string {
  const baseUrl = import.meta.env.BASE_URL;

  if (baseUrl && baseUrl !== '/') {
    return import.meta.env.BASE_URL + pathname;
  } else {
    return pathname;
  }
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const inputDate = typeof date === 'string' ? new Date(date) : date;
  const diff = Math.floor((now.getTime() - inputDate.getTime()) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600)
    return `${Math.floor(diff / 60)} minute${Math.floor(diff / 60) > 1 ? 's' : ''} ago`;
  if (diff < 86400)
    return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`;
  if (diff < 604800)
    return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
  if (diff < 2592000)
    return `${Math.floor(diff / 604800)} week${Math.floor(diff / 604800) > 1 ? 's' : ''} ago`;
  if (diff < 31536000)
    return `${Math.floor(diff / 2592000)} month${Math.floor(diff / 2592000) > 1 ? 's' : ''} ago`;

  return `${Math.floor(diff / 31536000)} year${Math.floor(diff / 31536000) > 1 ? 's' : ''} ago`;
}

export function formatDate(input: Date | string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(input: Date | string | number): string {
  const date = new Date(input);
  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
}

export function deepMerge(obj1: any, obj2: any): any {
  const output = Object.assign({}, obj1);

  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (typeof obj2[key] === 'object' && obj2[key] !== null && obj1[key]) {
        output[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        output[key] = obj2[key];
      }
    }
  }

  return output;
}

// base64 -> Blob
export function base64ToFile(base64: string, filename: string) {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

interface FormatNumberOptions {
  locale?: 'id-ID' | 'en-US';
  currency?: 'IDR' | 'USD' | null;
  decimal?: number;
  fallback?: string;
}

export function formatNumber(
  value: string | number | null | undefined,
  options: FormatNumberOptions = {},
): string {
  const {
    locale = 'id-ID',
    currency = null,
    decimal = 0,
    fallback = '-',
  } = options;

  if (value === null || value === undefined || value === '') return fallback;

  const num = Number(value);
  if (isNaN(num)) return fallback;

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
    ...(currency ? { style: 'currency', currency } : {}),
  }).format(num);
}

export const formatRupiah = (v: string | number | null | undefined) =>
  formatNumber(v, { currency: 'IDR' });

export const formatThousand = (v: string | number | null | undefined) =>
  formatNumber(v);

export function buildFileDownloadUrl(fileName: string): string {
  const params = new URLSearchParams({ name: fileName });
  const auth = getAuth();
  if (auth?.access_token) {
    params.set('token', auth.access_token);
  }
  return `${apiConfig.service_master_data}/download?${params.toString()}`;
}
