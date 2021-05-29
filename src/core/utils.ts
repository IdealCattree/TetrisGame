/**
 * 生成一个指定范围的随机数
 * @param min
 * @param max
 */
export function getRandom(min: number, max: number) {
  const dec = max - min;
  return Math.floor(min + Math.random() * dec);
}
