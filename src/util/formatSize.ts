export function formatSize(bytes: number) {
  const pow = Math.log2(bytes);
  let val: number = bytes,
    unit: string = 'B';
  if (pow >= 30) {
    val = bytes / 2 ** 30;
    unit = 'GB';
  } else if (pow >= 20) {
    val = bytes / 2 ** 20;
    unit = 'MB';
  } else if (pow >= 10) {
    val = bytes / 2 ** 10;
    unit = 'KB';
  }

  return `${val.toFixed(1)} ${unit}`;
}
