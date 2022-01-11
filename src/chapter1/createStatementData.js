export default function createStatementData(invoice, plays) {
  const result = {};
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);
  return result;

  // 构造函数无法返回子类，所以通过工厂函数来实现
  function createPerformanceCaculator(aPerformance, aPlay) {
    return new PerformanceCalculator(aPerformance, aPlay);
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
    let result = 0;
    switch (this.play.type) {
      case "tragedy":
        result = 40000;
        if (this.aPerformance.audience > 30) {
          result += 1000 * (this.aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (this.aPerformance.audience > 20) {
          result += 10000 + 500 * (this.aPerformance.audience - 20);
        }
        result += 300 * this.aPerformance.audience;
        break;
      default:
        throw new Error(`unknown type: ${this.play.type}`);
    }
    return result;
  }

  get volumeCredits() {
    let result = 0;
    result += Math.max(this.aPerformance.audience - 30, 0);
    if ("comedy" === this.play.type) result += Math.floor(this.aPerformance.audience / 5);
    return result;
  }
}
