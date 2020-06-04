require('dotenv').config();
const apn = require('apn');
const path = require('path');
const models = require('../models');

const { IOS_KEY_ID, IOS_TEAM_ID } = process.env;
const certPath = path.resolve(__dirname) + '/ios_development.cer';
const keyPath = path.resolve(__dirname) + '/AuthKey_53NMH622Z4.p8';

module.exports = async ({ message, type }) => {
  try {
    if(type !== 'twitch' && type !== 'podcast' && type !== 'youtube') {
      throw new Error('Invalid Type');
    }

    let additionalConditions = {};

    if(type === 'twitch') additionalConditions.twitchEnabled = true;
    if(type === 'youtube') additionalConditions.youtubeEnabled = true;
    if(type === 'podcast') additionalConditions.podcastEnabled = true;

    console.log('additi', additionalConditions);

    let devices = await models.Device.findAll({
      where: {
        deletedAt: null,
        ...additionalConditions
      }
    });

    console.log('devices', devices);

    const engine = new apn.Provider({
      token: {
        cert: certPath,
        key: keyPath,
        keyId: IOS_KEY_ID,
        teamId: IOS_TEAM_ID,
      },
      production: true
    })

    if (!engine) {
      throw new Error('No apn connection')
    }

    const notificationMessage = new apn.Notification();

    notificationMessage.alert = message;
    notificationMessage.badge = 0;
    notificationMessage.expiry = Math.floor(Date.now() / 1000) + 3600;;
    notificationMessage.topic = 'org.reactjs.native.example.easyallies';
    notificationMessage.payload = {'messageFrom': 'Easy Allies'};

    let promises = [];

    devices.forEach((device) => {
      promises.push(engine.send(notificationMessage, device.get('token')));
    })

    return Promise.all(promises);

  } catch (err) {
    console.log(err)
  }
}