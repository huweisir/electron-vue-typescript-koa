// 时间格式化
export const formatTime = (date: Date) => {
    let dateList = [];
    dateList.push(date.getMonth() + 1 + "月");
    dateList.push(date.getDate() + "日 ");
    dateList.push("  " + date.getHours());
    dateList.push(":" + date.getMinutes());
    dateList.push(":" + date.getSeconds());
    let format = "";
    dateList.forEach(item => {
        format = format + `${item}`;
    });
    return format;
}
export const formatHour = (_time: number) => {
    const time: number = +((+_time).toFixed(2));
    const hour = Math.floor((time) / 3600);
    const min = Math.floor((time - hour * 3600) / 60) || 0;
    const sec = (time - hour * 3600 - min * 60 || 0).toFixed(2);
    let hourStr = '';
    let minStr = '';
    let secStr = '';
    if (hour) {
        hourStr = min + '小时'
    }
    if (min) {
        minStr = min + '分'
    }
    if (sec) {
        secStr = sec + '秒'
    }
    var x = hourStr + (hourStr ? " " : "")
        + minStr + (minStr ? " " : "")
        + secStr;
    return x
}