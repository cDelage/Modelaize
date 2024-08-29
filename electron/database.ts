import {app} from "electron"
import Datastore from "nedb-promises";

// Créer une interface pour étendre le type de la base de données
interface ExtendedDatabase<T> extends Datastore<T> {
  setAutocompactionInterval(interval: number): void;
}

const dbFactory = (fileName : string) => {
  const database = Datastore.create({
    filename: `${
      process.env.NODE_ENV === 'development' ? '.' : app.getPath("userData")
    }/data/${fileName}`,
    timestampData: true,
    autoload: true,
  }) as ExtendedDatabase<{ _id: string; createdAt: Date; updatedAt: Date }>; // Effectuer une conversion de type

  database.setAutocompactionInterval(20 * 1000);

  return database;
};

export const db = {
  settings: dbFactory('settings.db'),
};
