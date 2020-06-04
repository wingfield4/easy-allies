import SQLite from 'react-native-sqlite-storage';

const database = SQLite.openDatabase({ name: 'db.easyAllies' });

class Database {
  executeSql = async (sql, params = []) => {
    return new Promise((resolve, reject) => {
      database.transaction(tx => {
        tx.executeSql(sql, params, (tx, results) => {
          let toReturn = [];
          var len = results.rows.length;
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            toReturn.push(row);
          }
          resolve(toReturn)
        }, (error) => {
          console.log('DB ERROR: ', error)
          reject(error);
        })
      })
    })
  }

  up = async () => {
    await this.executeSql(`
      CREATE TABLE IF NOT EXISTS timestamp (
        id INTEGER PRIMARY KEY,
        videoId TEXT NOT NULL,
        position REAL NOT NULL,
        createdAt TEXT NOT NULL
      )
    `);

    await this.executeSql(`
      CREATE TABLE IF NOT EXISTS podcastTimestamp (
        id INTEGER PRIMARY KEY,
        podcastEpisodeId INTEGER NOT NULL,
        position REAL NOT NULL,
        createdAt TEXT NOT NULL
      )
    `);
  }

  updateTimestamp = async ({ videoId, position }) => {
    let timestamp = await this.executeSql('SELECT * from timestamp where videoId = ?', [videoId]);

    if(timestamp && timestamp.length > 0) {
      return this.executeSql(`
        UPDATE timestamp
        SET position=?,
            createdAt=?
        WHERE videoId=?
      `, [
        position,
        new Date().toISOString(),
        videoId
      ])
    }

    return this.executeSql(`
      INSERT INTO timestamp(
        videoId,
        position,
        createdAt
      ) VALUES (
        ?, ?, ?
      )
    `, [
      videoId,
      position,
      new Date().toISOString()
    ]);
  }

  updatePodcastTimestamp = async ({ podcastEpisodeId, position }) => {
    let timestamp = await this.executeSql('SELECT * from podcastTimestamp where podcastEpisodeId = ?', [podcastEpisodeId]);

    if(timestamp && timestamp.length > 0) {
      return this.executeSql(`
        UPDATE podcastTimestamp
        SET position=?,
            createdAt=?
        WHERE podcastEpisodeId=?
      `, [
        position,
        new Date().toISOString(),
        podcastEpisodeId
      ])
    }

    return this.executeSql(`
      INSERT INTO podcastTimestamp(
        podcastEpisodeId,
        position,
        createdAt
      ) VALUES (
        ?, ?, ?
      )
    `, [
      podcastEpisodeId,
      position,
      new Date().toISOString()
    ]);
  }

  getTimestamps = () => {
    return this.executeSql('SELECT * FROM timestamp ORDER BY createdAt DESC LIMIT 50');
  }

  getTimestamp = async (videoId) => {
    let res = await this.executeSql(`
      SELECT * FROM timestamp
      WHERE videoId=?
    `, [
      videoId
    ]);
    
    if(res && res.length > 0) {
      return res[0].position;
    }
    return null;
  }

  getPodcastTimestamps = () => {
    return this.executeSql('SELECT * FROM podcastTimestamp ORDER BY createdAt DESC LIMIT 50');
  }

  getPodcastTimestamp = async (podcastEpisodeId) => {
    let res = await this.executeSql(`
      SELECT * FROM podcastTimestamp
      WHERE podcastEpisodeId=?
    `, [
      podcastEpisodeId
    ]);

    if(res && res.length > 0) {
      return res[0].position;
    }
    return null;
  }

  down = async () => {
    console.log('DROP DB');
    await this.executeSql('DROP TABLE IF EXISTS timestamp');
    await this.executeSql('DROP TABLE IF EXISTS podcastTimestamp');
  }
}

export default Database;
export let db = new Database();