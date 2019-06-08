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