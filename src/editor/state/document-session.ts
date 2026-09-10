import {
  copyProjectDocument,
  parseProjectDocument,
  type ProjectDocument,
} from "@/core/document";
import {
  DocumentTransactionHistory,
  type HistoryMetadata,
} from "@/core/history";

type DocumentListener = () => void;

function touchDocument(document: ProjectDocument): ProjectDocument {
  return { ...document, updatedAt: new Date().toISOString() };
}

function withCurrentPersistenceRevision(
  document: ProjectDocument,
  current: ProjectDocument,
): ProjectDocument {
  return {
    ...document,
    revision: current.revision,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
  };
}

function contentMatches(left: ProjectDocument, right: ProjectDocument): boolean {
  const normalize = (document: ProjectDocument) => ({
    ...document,
    revision: 0,
    updatedAt: "",
  });
  return JSON.stringify(normalize(left)) === JSON.stringify(normalize(right));
}

export class DocumentSession {
  #document: ProjectDocument;
  #dirty = false;
  #listeners = new Set<DocumentListener>();
  readonly #history: DocumentTransactionHistory;

  constructor(document: ProjectDocument, historyLimit = 80) {
    this.#document = parseProjectDocument(copyProjectDocument(document));
    this.#history = new DocumentTransactionHistory(historyLimit);
  }

  getSnapshot = (): ProjectDocument => this.#document;
  getServerSnapshot = (): ProjectDocument => this.#document;

  get isDirty(): boolean {
    return this.#dirty;
  }

  get canUndo(): boolean {
    return this.#history.canUndo;
  }

  get canRedo(): boolean {
    return this.#history.canRedo;
  }

  get isTransactionOpen(): boolean {
    return this.#history.isTransactionOpen;
  }

  subscribe = (listener: DocumentListener): (() => void) => {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  };

  #emit(): void {
    for (const listener of this.#listeners) listener();
  }

  update(transform: (document: ProjectDocument) => ProjectDocument, metadata: HistoryMetadata): boolean {
    const before = this.#document;
    const transformed = transform(before);
    if (transformed === before || JSON.stringify(transformed) === JSON.stringify(before)) return false;
    const next = touchDocument(transformed);
    this.#history.record(before, next, metadata);
    this.#document = next;
    this.#dirty = true;
    this.#emit();
    return true;
  }

  beginTransaction(metadata: HistoryMetadata): void {
    this.#history.begin(this.#document, metadata);
    this.#emit();
  }

  replaceTransientDocument(document: ProjectDocument): void {
    if (!this.#history.isTransactionOpen) throw new Error("Transient updates require an open transaction.");
    this.#document = touchDocument(document);
    this.#dirty = true;
    this.#emit();
  }

  commitTransaction(): boolean {
    const committed = this.#history.commit(this.#document);
    if (committed) this.#dirty = true;
    this.#emit();
    return committed;
  }

  cancelTransaction(): void {
    const restored = this.#history.cancel();
    if (!restored) return;
    this.#document = withCurrentPersistenceRevision(restored, this.#document);
    this.#dirty = false;
    this.#emit();
  }

  undo(): boolean {
    const document = this.#history.undo();
    if (!document) return false;
    this.#document = withCurrentPersistenceRevision(document, this.#document);
    this.#dirty = true;
    this.#emit();
    return true;
  }

  redo(): boolean {
    const document = this.#history.redo();
    if (!document) return false;
    this.#document = withCurrentPersistenceRevision(document, this.#document);
    this.#dirty = true;
    this.#emit();
    return true;
  }

  acceptPersistedDocument(saved: ProjectDocument, savedSource: ProjectDocument): void {
    const unchangedSinceSave = contentMatches(this.#document, savedSource);
    this.#document = unchangedSinceSave
      ? saved
      : { ...this.#document, revision: saved.revision, updatedAt: saved.updatedAt };
    this.#dirty = !unchangedSinceSave;
    this.#emit();
  }

  replaceProject(document: ProjectDocument): void {
    this.#document = parseProjectDocument(copyProjectDocument(document));
    this.#history.clear();
    this.#dirty = false;
    this.#emit();
  }
}
