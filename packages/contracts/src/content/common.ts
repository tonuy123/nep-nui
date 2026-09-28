export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface PublicMediaDto {
  publicUrl: string;
  alt: string;
  width: number;
  height: number;
  attribution: string | null;
}

export interface DestinationRefDto {
  slug: string;
  title: string;
}

export interface PaginationDto {
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ListResponse<T> {
  data: T[];
  pagination: PaginationDto;
}

export interface DetailResponse<T> {
  data: T;
}

export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
  requestId: string;
}
