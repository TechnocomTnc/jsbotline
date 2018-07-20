'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const bodyParser = require('body-parser')
const request = require('request')
var sql = require('mssql');
var sqlInstance = require("mssql");


var dbConfig = {
  user: 'linebot',
  password: 'p@ssw0rd',
  server: 'mgtfs.southeastasia.cloudapp.azure.com', 
  database: 'LineBotChat',
  port:1433,
  options: {
      encrypt: true // Use this if you're on Windows Azure
  }
};




// create LINE SDK config from env variables
const config = {
  channelAccessToken: '7YR60AJ855Zu1Etxsc7aCdFqhip1o8yAKj7PzLe90ClE9Po0fz5o81BeghtpCki4+zFZ7FrYjjbrFvQw84+Axi+P1zWPnxSCTl/lF5gVTDaDqdC5IHk30qnjo7GQ1hHKizexgGNpBPn/Fwz3slJqkQdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'c3aa02ca5442a7640d2c577f936da0d4',
};

// base URL for webhook server
const baseURL = 'https://nodejs-bot12.herokuapp.com';

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// serve static and downloaded files
app.use('/static', express.static('static'));
app.use('/downloaded', express.static('downloaded'));


// webhook callback
app.post('/callback', line.middleware(config), (req, res) => {
  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }

  // handle events separately
  Promise.all(req.body.events.map(handleEvent))
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// simple reply function
const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: 'text', text }))
  );
};

// callback function to handle a single event
function handleEvent(event) {
  switch (event.type) {
    case 'message':
      const message = event.message;
      switch (message.type) {
        case 'text':
          return handleText(message, event.replyToken, event.source);
        case 'image':
          return handleImage(message, event.replyToken, event.source);
        case 'video':
          return handleVideo(message, event.replyToken, event.source);
        case 'audio':
          return handleAudio(message, event.replyToken, event.source);
        case 'location':
          return handleLocation(message, event.replyToken, event.source);
        case 'sticker':
          return handleSticker(message, event.replyToken);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }
    case 'join':
      return replyText(event.replyToken, `Joined ${event.source.type}`);

    // case 'leave':
    //   return console.log(`Left: ${JSON.stringify(event)}`);

    // case 'postback':
    //   let data = event.postback.data;
    //   if (data === 'DATE' || data === 'TIME' || data === 'DATETIME') {
    //     data += `(${JSON.stringify(event.postback.params)})`;
    //   }
    //   return replyText(event.replyToken, `Got postback: ${data}`);

    // case 'beacon':
    //   return replyText(event.replyToken, `Got beacon: ${event.beacon.hwid}`);

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

function handleText(message, replyToken, source) {
//   const buttonsImageURL = `${baseURL}/static/buttons/1040.jpg`;
  // return replyText(replyToken, message.type );
  switch (message.text) {
    case 'profile':
      if (source.userId) {
        return client.getProfile(source.userId)
          .then((profile) => replyText(
            replyToken,
            [
              `Display name: ${profile.displayName}`,
              `Status message: ${profile.statusMessage}`,
            ]
          ));
      } else {
        return replyText(replyToken, 'Bot can\'t use profile API without user ID');
      }
    case 'datetime':
      return client.replyMessage(
        replyToken,
        {
          type: 'template',
          altText: 'Datetime pickers alt text',
          template: {
            type: 'buttons',
            text: 'Select date / time !',
            actions: [
              { type: 'datetimepicker', label: 'date', data: 'DATE', mode: 'date' },
              { type: 'datetimepicker', label: 'time', data: 'TIME', mode: 'time' },
              { type: 'datetimepicker', label: 'datetime', data: 'DATETIME', mode: 'datetime' },
            ],
          },
        }
      );
    case 'bye':
      switch (source.type) {
        case 'user':
          return replyText(replyToken, 'Bot can\'t leave from 1:1 chat');
        case 'group':
          return replyText(replyToken, 'Leaving group')
            .then(() => client.leaveGroup(source.groupId));
        case 'room':
          return replyText(replyToken, 'Leaving room')
            .then(() => client.leaveRoom(source.roomId));
      }
    default:
      //console.log(`Echo message to ${replyToken}: ${message.text}`);
      return replyText(replyToken,'idk');
  }
}

function handleImage(message, replyToken, source) {
  const downloadPath = path.join(__dirname, 'downloaded', `${message.id}.jpg`);
  const previewPath = path.join(__dirname, 'downloaded', `${message.id}-preview.jpg`);

  return downloadContent(message.id, downloadPath)
    .then((downloadPath) => {
      // ImageMagick is needed here to run 'convert'
      // Please consider about security and performance by yourself
      // cp.exec(`convert -resize 240x jpeg:${downloadPath} jpeg:${previewPath}`);

      var  originalContentUrl = baseURL + '/downloaded/' + path.basename(downloadPath)
    //   var  previewImageUrlT = baseURL + '/downloaded/' + path.basename(previewPath)
      var  UsID = source.userId
      var  GrID = '0' //source.groupId
      var  image64
      const image2base64 = require('image-to-base64');
            image2base64(originalContentUrl)
                .then(
                    (response) => {
                        image64 = 'data:image/jpeg;base64,'+ response
                        // console.log('data:image/jpeg;base64,'); 
                        // console.log(response); 
                        
                        return client.replyMessage(
                                replyToken,
                                {
                                // type: 'image',
                                // originalContentUrl: 'data:image/jpeg;base64,'+ response,
                                // previewImageUrl: previewImageUrlT
                                type: 'text',
                                text:  UsID + ' - ' + GrID + ' - ' +image64 
                                //originalContentUrlT + '\n\n' + previewImageUrlT
                                })

                        var conn = new sql.ConnectionPool(dbConfig);
                        conn.connect().then(function () {
                            var req = new sql.Request(conn);
                            req.query("INSERT INTO [dbo].[Image] ([image64],[userId],[groupId]) VALUES ('" + image64 + "','" + UsID + "','" + GrID + "')")
                        });
    
                            
                    }
                )
    });
}

function handleVideo(message, replyToken) {
  const downloadPath = path.join(__dirname, 'downloaded', `${message.id}.mp4`);
  //const previewPath = path.join(__dirname, 'downloaded', `${message.id}-pw.jpg`);
  
  //originalContentUrl: baseURL + '/downloaded/' + path.basename(downloadPath)
  return downloadContent(message.id, downloadPath)
    .then((downloadPath) => {

        var conn = new sql.ConnectionPool(dbConfig);
        conn.connect().then(function () {
            var req = new sql.Request(conn);
            req.query("INSERT INTO [dbo].[Video] ([video64],[user_id],[group_id]) VALUES ('" + image64 + "','" + UsID + "','" + GrID + "')")
        });


    //   return client.replyMessage(
    //     replyToken,
    //     {
    //       // type: 'video',
    //       // originalContentUrl: 'https://r1---sn-30a7yne7.c.2mdn.net/videoplayback/id/3c2c72fb5a76d1fd/itag/343/source/doubleclick_dmm/ratebypass/yes/acao/yes/ip/0.0.0.0/ipbits/0/expire/3673239867/sparams/acao,expire,id,ip,ipbits,itag,mip,mm,mn,ms,mv,pl,ratebypass,source/signature/558883E84289FA0D99219F54D99F4376DE02191B.57F9B5616A2E2DC1E3690A466E293E27BB8BD595/key/cms1/cms_redirect/yes/mip/171.6.115.43/mm/42/mn/sn-30a7yne7/ms/onc/mt/1531807347/mv/m/pl/19/file/file.mp4',
    //       // previewImageUrl: 'https://r1---sn-30a7yne7.c.2mdn.net/videoplayback/id/3c2c72fb5a76d1fd/itag/343/source/doubleclick_dmm/ratebypass/yes/acao/yes/ip/0.0.0.0/ipbits/0/expire/3673239867/sparams/acao,expire,id,ip,ipbits,itag,mip,mm,mn,ms,mv,pl,ratebypass,source/signature/558883E84289FA0D99219F54D99F4376DE02191B.57F9B5616A2E2DC1E3690A466E293E27BB8BD595/key/cms1/cms_redirect/yes/mip/171.6.115.43/mm/42/mn/sn-30a7yne7/ms/onc/mt/1531807347/mv/m/pl/19/file/file-preview.jpg'
    //       type : 'text',
    //       //text : baseURL + '/downloaded/' + path.basename(downloadPath)          
    //       text : 'video'
    //       //baseURL + '/downloaded/' + path.basename(downloadPath) + '\n\n' + baseURL + '/downloaded/' + path.basename(previewPath)
    //       // type: 'video',
    //       // originalContentUrl: baseURL + '/downloaded/' + path.basename(downloadPath),
    //       // previewImageUrl: 'https://scontent.fbkk5-2.fna.fbcdn.net/v/t1.0-9/37188673_725471077628021_5597707026646958080_n.jpg?_nc_cat=0&_nc_eui2=AeGuXZ0RC4KZucEmO5dVf8CEUrw4DMxvYqFBNB3rl3D2JLimeOKkFuAsyqmWZEh7HOF5pPB4b63uuYFJ4jX_yfNRDKF-_8wdAvi9RbiMgC1AYw&oh=68807581c4e6e78a5c8ba7e1288f9794&oe=5BD8B6B4'
    //     }
    //   );
    });
    
}

function handleAudio(message, replyToken) {
  const downloadPath = path.join(__dirname, 'downloaded', `${message.id}.m4a`);

  return downloadContent(message.id, downloadPath)
    .then((downloadPath) => {
      var getDuration = require('get-audio-duration');
      var audioDuration;
      getDuration(downloadPath)
        .then((duration) => { audioDuration = duration; })
        .catch((error) => { audioDuration = 1; })
        .finally(() => {
          return client.replyMessage(
            replyToken,
            {
              type: 'audio',
              originalContentUrl: baseURL + '/downloaded/' + path.basename(downloadPath),
              duration: audioDuration * 1000
            }
          );
        });
    });
}

function downloadContent(messageId, downloadPath) {
  return client.getMessageContent(messageId)
    .then((stream) => new Promise((resolve, reject) => {
      const writable = fs.createWriteStream(downloadPath);
      stream.pipe(writable);
      stream.on('end', () => resolve(downloadPath));
      stream.on('error', reject);
    }));
}

function handleLocation(message, replyToken) {
  return client.replyMessage(
    replyToken,
    {
      type: 'location',
      title: message.title,
      address: message.address,
      latitude: message.latitude,
      longitude: message.longitude,
    }
  );
}

function handleSticker(message, replyToken) {
  return client.replyMessage(
    replyToken,
    {
      type: 'sticker',
      packageId: message.packageId,
      stickerId: message.stickerId,
    }
  );
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
