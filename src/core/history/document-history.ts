import { copyProjectDocument, type ProjectDocument } from "../document";

export type HistoryEntryKind =
  | "layer"
  | "slide"
  | "project"
  | "template"
  | "brand"
  | "content";

export interface HistoryMetadata {
  label: string;
  kind: HistoryEntryKind;
  affectedIds?: string[];
}

export interface HistoryEntry extends HistoryMetadata {
  id: string;
  before: ProjectDocument;
  after: ProjectDocument;
  committedAt: number;
}

interface OpenTransaction {
  metadata: HistoryMetadata;
  before: ProjectDocument;
}

function createHistoryId(): string {
  return `history_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function documentsDiffer(before: ProjectDocument, after: ProjectDocument): boolean {
  return before.revision !== after.revision || JSON.stringify(before) !== JSON.stringify(after);
}

export class DocumentTransactionHistory {
  readonly #limit: number;
  #past: HistoryEntry[] = [];
  #future: HistoryEntry[] = [];
  #transaction: OpenTransaction | null = null;

  constructor(limit = 80) {
    this.#limit = limit;
  }

  get canUndo(): boolean {
    return this.#past.length > 0;
  }

  get canRedo(): boolean {
    return this.#future.length > 0;
  }

  get isTransactionOpen(): boolean {
    return this.#transaction !== null;
  }

  begin(document: ProjectDocument, metadata: HistoryMetadata): void {
    if (this.#transaction) throw new Error("A document transaction is already open.");
    this.#transaction = { metadata, before: copyProjectDocument(document) };
  }

  commit(document: ProjectDocument): boolean {
    if (!this.#transaction) throw new Error("No document transaction is open.");
    const transaction = this.#transaction;
    this.#transaction = null;
    return this.record(transaction.before, document, transaction.metadata);
  }

  cancel(): ProjectDocument | null {
    if (!this.#transaction) return null;
    const before = this.#transaction.before;
    this.#transaction = null;
    return copyProjectDocument(before);
  }

  record(
    before: ProjectDocument,
    after: ProjectDocument,
    metadata: HistoryMetadata,
  ): boolean {
    if (!documentsDiffer(before, after)) return false;
    this.#past.push({
      ...metadata,
      id: createHistoryId(),
      before: copyProjectDocument(before),
      after: copyProjectDocument(after),
      committedAt: Date.now(),
    });
    if (this.#past.length > this.#limit) this.#past.shift();
    this.#future = [];
    return true;
  }

  undo(): ProjectDocument | null {
    const entry = this.#past.pop();
    if (!entry) return null;
    this.#future.push(entry);
    return copyProjectDocument(entry.before);
  }

  redo(): ProjectDocument | null {
    const entry = this.#future.pop();
    if (!entry) return null;
    this.#past.push(entry);
    return copyProjectDocument(entry.after);
  }

  clear(): void {
    this.#past = [];
    this.#future = [];
    this.#transaction = null;
  }
}
