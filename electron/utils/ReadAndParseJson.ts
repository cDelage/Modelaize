import path from "path";
import fs from "fs";

export function readAndParseJSONSync<T extends Object>(
    directoryPath: string,
    fileName: string
  ): T {
    const filePath = path.join(directoryPath, fileName);
  
    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const jsonObject: T = JSON.parse(fileContent);
      return jsonObject;
    } catch (err) {
      console.error("Error reading or parsing the file:", err);
      throw err; // Re-throw the error to be handled by the caller if necessary
    }
  }
  