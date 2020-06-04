const Parser = require('rss-parser');
const parser = new Parser({
  customFields: {
    item: [
      ['itunes:image', 'itunesImage'],
    ]
  }
});
const sendNotification = require('../../notifications/sendNotification');
const models = require('../../models');

module.exports = async (ctx) => {
  try {
    let parseFeed = async (podcast) => {
      let feed = await parser.parseURL(podcast.get('rssUrl'));
    
      for(let i = 0; i < feed.items.length; i++) {
        let item = feed.items[i];
        await models.PodcastEpisode.findOrCreate({
          where: {
            guid: item.guid
          },
          defaults: {
            guid: item.guid,
            title: item.title,
            description: item.contentSnippet,
            mediaUrl: item.enclosure.url,
            imageUrl: item.itunesImage["$"].href,
            publishedAt: item.pubDate,
            podcastId: podcast.id,
            length: item.enclosure.length,
            createdAt: new Date()
          }
        }).then(async ([podcastEpisode, created]) => {
          if(created) {
            await sendNotification({
              message: {
                title: "Easy Allies Just Uploaded a New Podcast!",
                body: `${podcastEpisode.get('title')}`
              },
              type: 'podcast'
            });
          }
        })
      }
    }

    let podcasts = await models.Podcast.findAll({
      where: {
        deletedAt: null
      }
    });

    for(let i = 0; i < podcasts.length; i++) {
      await parseFeed(podcasts[i]);
    }
      
    ctx.body = {
      message: 'Success!'
    }
    
  } catch (err) {
    console.log(err);
  }
}