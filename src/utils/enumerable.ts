export interface DifferResult {
  after: Array<string>
  before: Array<string>
}

export const differ = (before: Array<string>, after: Array<string>): DifferResult => {
  // 求之前和之后的差级
  const combined = [...before, ...after] // 合并两个数组
  const counts: { [key: string]: number } = {} // 用于计数的对象
  // 计算每个元素的出现次数
  combined.forEach((item) => {
    counts[item] = (counts[item] || 0) + 1
  })
  // 提取只出现一次的元素，优先考虑 `a` 中的元素
  const result = { after: new Array<string>(), before: new Array<string>() }
  before.forEach((item) => {
    if (counts[item] === 1) {
      result.before.push(item)
      delete counts[item] // 从计数对象中移除，避免在 `b` 中重复添加
    }
  })
  after.forEach((item) => {
    if (counts[item] === 1) {
      result.after.push(item)
    }
  })

  return result
}
