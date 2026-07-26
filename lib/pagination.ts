export const DOTS = "…";

export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}

export function totalPages(totalItems: number, perPage: number): number {
  return Math.max(1, Math.ceil(totalItems / perPage));
}

function range(start: number, end: number): number[] {
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

export function getPageNumbers(
  current: number,
  total: number,
  siblingCount = 1
): (number | typeof DOTS)[] {
  const totalNumbers = siblingCount + 5;
  if (total <= totalNumbers) {
    return range(1, total);
  }

  const leftSibling = Math.max(current - siblingCount, 1);
  const rightSibling = Math.min(current + siblingCount, total);
  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < total - 1;

  if (!showLeftDots && showRightDots) {
    const leftCount = 3 + 2 * siblingCount;
    return [...range(1, leftCount), DOTS, total];
  }
  if (showLeftDots && !showRightDots) {
    const rightCount = 3 + 2 * siblingCount;
    return [1, DOTS, ...range(total - rightCount + 1, total)];
  }
  return [1, DOTS, ...range(leftSibling, rightSibling), DOTS, total];
}
