export const pairArray = <T>(array: T[]) =>
  array.flatMap((first, index) =>
    array.slice(index + 1).map((second) => [first, second])
  );
