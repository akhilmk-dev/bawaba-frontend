// export function formatDateTimeToAmPm(dateString) {
//    // Parse the provided date string and assume it's in IST (UTC +05:30)
//    const istDate = new Date(dateString + '+05:30');  // Explicitly appending IST offset

//    // Subtract 1 hour 30 minutes to convert IST to Oman time (GST)
//    const timeDifference = 1.5 * 60 * 60 * 1000; // 1.5 hours in milliseconds
//    const omanDate = new Date(istDate.getTime() - timeDifference);

//    // Format the date manually (Oman Time)
//    const day = omanDate.getDate();
//    const month = omanDate.toLocaleString('default', { month: 'long' }); // Month name
//    const year = omanDate.getFullYear();
//    let hours = omanDate.getHours();
//    const minutes = omanDate.getMinutes();
//    const ampm = hours >= 12 ? 'PM' : 'AM';

//    // Convert to 12-hour format
//    hours = hours % 12;
//    hours = hours ? hours : 12; // Handle 0 as 12 (midnight)
//    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

//    // Construct and return the formatted time
//    const formattedTime = `${month} ${day}, ${year} ${hours}:${formattedMinutes} ${ampm}`;
//    return formattedTime;

//   }

export function convertToDateOnly(isoDateTime) {
  const date = new Date(isoDateTime); // Parse the ISO string into a Date object
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
}

export function convertToDateOnly2(isoDateTime) {
  const date = new Date(isoDateTime); // Parse the ISO string into a Date object
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function formatDateTimeToAmPm(dateString) {
  const date = new Date(dateString);  // Convert the string to a Date object

  // Get date components
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });  // Get month name (e.g., 'October')
  const year = date.getFullYear();

  // Get hours and minutes for time
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12;  // Handle 0 as 12 (midnight)

  // Format minutes with leading zero if less than 10
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  // Construct the formatted date and time string
  const formattedDateTime = `${day} ${month} ${year} ${hours}:${formattedMinutes} ${ampm}`;

  return formattedDateTime;
}

export function convertDateFormat(dateString) {
  if (!dateString) return '';

  // Parse the date string
  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date)) return '';

  // Format the date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Combine into desired format
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


export const formatTime = (time) => {
  if (!time) return ""; // If time is not valid, return empty string
  const date = new Date(time);
  const hours = date.getHours().toString().padStart(2, "0"); // Convert hours to 2-digit format
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Convert minutes to 2-digit format
  return `${hours}:${minutes}`; // Return time in HH:mm format
};

export const fetchDateFromDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);

  // Get the components of the date
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed, so add 1
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = '00'; // Set seconds to '00' as per the requested format

  // Return the formatted date string
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const formatISOToDDMMYYYY = (isoDateStr) => {
    const date = new Date(isoDateStr);
    if (isNaN(date.getTime())) return "Invalid Date";
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };
