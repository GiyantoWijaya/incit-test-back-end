export function dateToUnixEpoch(dateInput: Date): number {
  // Parse the input date string into a Date object
  const inputDate = new Date(dateInput);

  // Check if the input date is valid
  if (isNaN(inputDate.getTime())) {
    throw new Error("Invalid date input");
  }

  // Convert the Date object to Unix epoch (milliseconds since January 1, 1970)
  const unixEpochTime = inputDate.getTime();

  // Convert milliseconds to seconds (Unix epoch uses seconds)
  const unixEpochInSeconds = Math.floor(unixEpochTime / 1000);

  return unixEpochInSeconds;
}

export function unixEpochToDate(unixEpochInSeconds: number): Date {
  // Convert seconds to milliseconds
  const unixEpochTimeMillis = unixEpochInSeconds * 1000;

  // Create a Date object from the Unix epoch time (in milliseconds)
  const date = new Date(unixEpochTimeMillis);

  return date;
}


// date now
export const now = (): number => Math.floor(new Date().getTime() / 1000);

export const generateTokenExpiration = (): number => {
  const currentUnixTime = now();
  const fifteenMinutesInSeconds = 10 * 60; // 10 minutes in seconds
  return currentUnixTime + fifteenMinutesInSeconds;
};
