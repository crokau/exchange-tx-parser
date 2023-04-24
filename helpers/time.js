
function getMonthIndex(monthString) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.indexOf(monthString);
  }
  
const utcTimeToOnlyDate = (utcDateTimeString) => {
    const parts = utcDateTimeString.split(' ');
    const utcDate = new Date(Date.UTC(
    parseInt(parts[3]), // year
    getMonthIndex(parts[2]), // month (zero-based)
    parseInt(parts[1]), // day
    ));
    const utcDateString = utcDate.toISOString().substr(0, 10); // "2023-04-24"
    return utcDateString
}

module.exports = {
    utcTimeToOnlyDate
}