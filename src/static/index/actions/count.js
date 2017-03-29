import { INCREASE, DECREASE } from '../constants'

//不同的action函数 根据 不同的参数 , 生成一个 供 reducer 修改 store 的数据对象

export function increase(n) {
    return {
      type: INCREASE,
      amount: n
    }
}

export function decrease(n) {
    return {
      type: DECREASE,
      amount: n
    }
}
