/**
 * Formats a date or Firebase timestamp to dd/mm/yyyy
 * @param {Date|Object} date - Date object or Firebase timestamp ({seconds, nanoseconds})
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
    if (!date) return 'N/A';
    
    let d;
    if (date.seconds) {
        // Firebase Timestamp
        d = new Date(date.seconds * 1000);
    } else {
        d = new Date(date);
    }

    if (isNaN(d.getTime())) return 'N/A';

    return d.toLocaleDateString('en-GB'); // en-GB uses dd/mm/yyyy
};
