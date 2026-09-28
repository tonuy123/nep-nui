export function isWithinCodePointLimit(
  value: string,
  maxCodePoints: number,
): boolean {
  if (maxCodePoints < 0) {
    return false;
  }

  const iterator = value[Symbol.iterator]();
  let count = 0;

  while (count <= maxCodePoints) {
    const next = iterator.next();

    if (next.done === true) {
      return true;
    }

    count += 1;
  }

  return false;
}
