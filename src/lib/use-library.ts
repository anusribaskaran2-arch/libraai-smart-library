"use client";

import { useSyncExternalStore } from "react";
import { store } from "./store";

/** Stable set of store methods, bound once so identity does not change
 * between renders (keeps `useMemo`/`useEffect` dependencies stable). */
const libraryApi = {
  getBook: store.getBook.bind(store),
  searchBooks: store.searchBooks.bind(store),
  getGenres: store.getGenres.bind(store),
  getLevels: store.getLevels.bind(store),
  addBook: store.addBook.bind(store),
  updateBook: store.updateBook.bind(store),
  deleteBook: store.deleteBook.bind(store),
  borrow: store.borrow.bind(store),
  returnBook: store.returnBook.bind(store),
  refreshStatuses: store.refreshStatuses.bind(store),
};

/** React binding for the LibraAI store. Any component using this hook
 * re-renders when books or borrowing records change. */
export function useLibrary() {
  // The third argument provides the server snapshot used during prerendering
  // and hydration; without it Next.js cannot render these pages on the server.
  const books = useSyncExternalStore(store.subscribe, store.getBooks, store.getBooks);
  const records = useSyncExternalStore(
    store.subscribe,
    store.getAllRecords,
    store.getAllRecords
  );
  return { books, records, ...libraryApi };
}
