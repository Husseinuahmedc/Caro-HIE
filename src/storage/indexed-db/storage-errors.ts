import { ZodError } from "zod";

export class RevisionConflictError extends Error {
  constructor(
    readonly projectId: string,
    readonly expectedRevision: number,
    readonly actualRevision: number,
  ) {
    super(`Project revision conflict: expected ${expectedRevision}, found ${actualRevision}.`);
    this.name = "RevisionConflictError";
  }
}

export class ProjectNotFoundError extends Error {
  constructor(readonly projectId: string) {
    super(`Project ${projectId} was not found.`);
    this.name = "ProjectNotFoundError";
  }
}

export class DocumentValidationError extends Error {
  constructor(message = "بيانات المستند غير صالحة للحفظ.", options?: ErrorOptions) {
    super(message, options);
    this.name = "DocumentValidationError";
  }
}

export class StorageUnavailableError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "StorageUnavailableError";
  }
}

export function normalizeStorageError(error: unknown): Error {
  if (
    error instanceof RevisionConflictError ||
    error instanceof ProjectNotFoundError ||
    error instanceof DocumentValidationError
  ) {
    return error;
  }
  if (error instanceof ZodError || (error instanceof Error && (error.name === "ZodError" || "issues" in error))) {
    return new DocumentValidationError("بيانات المستند غير صالحة للحفظ.", { cause: error });
  }
  if (error instanceof DOMException && error.name === "QuotaExceededError") {
    return new StorageUnavailableError("مساحة التخزين المحلية ممتلئة.", { cause: error });
  }
  if (error instanceof StorageUnavailableError) {
    return error;
  }
  if (error instanceof Error) {
    return new StorageUnavailableError("تعذر الوصول إلى التخزين المحلي.", { cause: error });
  }
  return new StorageUnavailableError("حدث خطأ غير معروف في التخزين المحلي.");
}

