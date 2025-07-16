import { Component } from "react";
import { ComponentType } from "../types";

const TEST_ABORT_TIMEOUT = 0; // ms

/**
 * Filters components based on the search term.
 * Simulates an API call with a timeout and like an API call allows you to abort the operation. if desired.
 * To see it working simply set TEST_ABORT_TIMEOUT to a value greater than 0.
 */
export function filterComponents(
  components: ComponentType[],
  searchTerm: string,
  signal: AbortSignal
): Promise<ComponentType[] | undefined> {
  if (signal.aborted) {
    return Promise.resolve(undefined);
  }

  let timeoutHandle: number | null = null;

  const abortPromise = new Promise<undefined>((resolve) => {
    signal.addEventListener(
      "abort",
      () => {
        if (timeoutHandle !== null) {
          console.log("Aborted search operation");
          clearTimeout(timeoutHandle);
        }
        resolve(undefined);
      },
      { once: true }
    );
  });

  const filterPromise = new Promise<ComponentType[]>((resolve) => {
    const query = searchTerm.toLowerCase();
    timeoutHandle = setTimeout(() => {
      console.log("Filtering components with query:", query);
      resolve(components.filter((c) => c.Name.toLowerCase().includes(query)));
    }, TEST_ABORT_TIMEOUT);
  });

  return Promise.race([abortPromise, filterPromise]);
}

// Maps the components to their categories and counts how many components are in each category
export function getCategoryCounts(filteredComponents: ComponentType[]): Record<string, number> {
  const counts: Record<string, number> = {};
  filteredComponents.forEach((c) => {
    c.Categories.forEach((cat) => {
      counts[cat] = (counts[cat] || 0) + 1;
    });
  });
  return counts;
}
