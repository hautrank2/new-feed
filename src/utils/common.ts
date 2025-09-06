export const getValueFromPath = (obj: any, path: string[] | string): any => {
  if (typeof path === "string") {
    return obj[path];
  }
  return path.reduce((acc, key) => {
    return acc && acc[key] !== undefined ? acc[key] : undefined;
  }, obj);
};

export const prettyObject = (
  obj: Record<string, any>,
  deletes: any[] = [undefined, "", null]
) => {
  for (const key in obj) {
    const value = obj[key];

    if (typeof value === "object" && value !== null) {
      prettyObject(value, deletes);

      if (!Object.keys(value).length) {
        delete obj[key]; // 🔹 Xóa object nếu rỗng
      }
    } else if (deletes.includes(value)) {
      delete obj[key]; // 🔹 Xóa thuộc tính nếu thuộc `deletes`
    }
  }

  return obj;
};

export const compareObjects = (
  obj1: any,
  obj2: any,
  options?: { isPretty?: boolean }
): boolean => {
  // Check if both inputs are objects
  if (typeof obj1 !== "object" || typeof obj2 !== "object") {
    return false;
  }
  if (options && options["isPretty"]) {
    obj1 = prettyObject(obj1);
    obj2 = prettyObject(obj2);
  }

  // Get the keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if the number of keys is the same
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Iterate through the keys of the first object
  for (const key of keys1) {
    // Check if both objects have the same value for the current key
    if (obj1[key] !== obj2[key]) {
      return false; // Return false if any property has a different value
    }
  }

  return true; // All properties have the same values
};
