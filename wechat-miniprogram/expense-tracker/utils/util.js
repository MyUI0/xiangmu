// 工具函数

/**
 * 格式化时间
 */
function formatTime(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute].map(formatNumber).join(':')}`;
}

/**
 * 格式化日期（仅日期）
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${[year, month, day].map(formatNumber).join('-')}`;
}

/**
 * 格式化月份
 */
function formatMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return `${year}-${formatNumber(month)}`;
}

function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : `0${n}`;
}

/**
 * 格式化金额，保留两位小数
 */
function formatAmount(amount) {
  return parseFloat(amount).toFixed(2);
}

/**
 * 获取今天的开始时间
 */
function getTodayStart() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * 获取本月的开始时间
 */
function getMonthStart() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  monthStart.setHours(0, 0, 0, 0);
  return monthStart;
}

/**
 * 判断是否是同一天
 */
function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}

/**
 * 获取星期几
 */
function getWeekDay(date) {
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekDays[date.getDay()];
}

module.exports = {
  formatTime,
  formatDate,
  formatMonth,
  formatAmount,
  getTodayStart,
  getMonthStart,
  isSameDay,
  getWeekDay
};
