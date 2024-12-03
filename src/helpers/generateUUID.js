const generateUUID = () => {
  const timestamp = new Date().getTime();
  // Generate a random number to add to the timestamp
  const randomValue = Math.floor(Math.random() * 1000);

  // Convert the timestamp and random value to hexadecimal strings
  const timestampHex = timestamp.toString(16);
  const randomValueHex = randomValue.toString(16);

  // Generate a UUID by combining the timestamp and random value
  const uuid = timestampHex + randomValueHex;

  return uuid;
};
exports.generateUUID = generateUUID;
