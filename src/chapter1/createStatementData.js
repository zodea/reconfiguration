export default function createStatementData(invoice, plays) {
  const result = {};
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);
  return result;

  // 构造函数无法返回子类，所以通过工厂函数来实现
  function createPerformanceCaculator(aPerformance, aPlay) {
    switch (aPlay.type) {
      case "tragedy":
        return new TragedyCalculator(aPerformance, aPlay);
      case "comedy":
        return new ComedyCalculator(aPerformance, aPlay);
      default:
        throw new Error(`unknown type: ${aPlay.type}`);
    }
  }

  function enrichPerformance(aPerformance) {
    // 由于在此处直接调用了几个计算函数，因此由这里开始创建一个类来做后续操作
    const calculator = createPerformanceCaculator(aPerformance, playFor(aPerformance));
    const result = Object.assign({}, aPerformance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
  }
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }
  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }
  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }
}

class PerformanceCalculator {
  constructor(aPerformance, aplay) {
    this.aPerformance = aPerformance;
    this.play = aplay;
  }

  get amount() {
    throw new Error("subclass responsibility");
  }

  get volumeCredits() {
    return Math.max(this.aPerformance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.aPerformance.audience > 30) {
      result += 1000 * (this.aPerformance.audience - 30);
    }
    return result;
  }
}
class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;
    if (this.aPerformance.audience > 20) {
      result += 10000 + 500 * (this.aPerformance.audience - 20);
    }
    result += 300 * this.aPerformance.audience;
    return result;
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.aPerformance.audience / 5);
  }
}
