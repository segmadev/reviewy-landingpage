export function createEntityId(): string {
  return crypto.randomUUID();
}

/** Preserves valid IDs and repairs missing or duplicate IDs from APIs and older drafts. */
export function ensureUniqueEntityIds<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.map(item => {
    const id = typeof item.id === 'string' ? item.id.trim() : '';
    if (id && !seen.has(id)) {
      seen.add(id);
      return item;
    }

    let replacementId = createEntityId();
    while (seen.has(replacementId)) replacementId = createEntityId();
    seen.add(replacementId);
    return { ...item, id: replacementId };
  });
}
