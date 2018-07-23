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
const image2base64 = require('image-to-base64');


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
        var GrID = event.source.groupId
        var conn = new sql.ConnectionPool(dbConfig);
            conn.connect().then(function () {
                var req = new sql.Request(conn);
                req.query("INSERT INTO [dbo].[Group] ([groupId]) VALUES ('" + GrID + "')")
            });  
      return replyText(event.replyToken,"สวัสดีครับ ผมคือระบบอัตโนมัติ \nบทสนทนาที่เกิดขึ้นภายในกลุ่มนี้จะถูกบันทึกเพื่อนำไปปรับปรุงและพัฒนาระบบต่อไป \nข้อมูลทุกอย่างจะถูกเก็บเป็นความลับและไม่มีการเปิดเผยต่อสาธารณะ \nขอบคุณครับ");

    // case 'leave':
    //   return console.log(`Left: ${JSON.stringify(event)}`);

    case 'follow':
      return client.getProfile(event.source.userId)
            .then((profile) => {
              var a = event.replyToken
              var UsID = event.source.userId
              var UsName = profile.displayName
              var conn = new sql.ConnectionPool(dbConfig);
                  conn.connect().then(function () {
                      var req = new sql.Request(conn);
                      req.query('SELECT * FROM [dbo].[User]').then(function (rows) {
                        var num=0;
                        if(rows.rowsAffected == 0){
                            req.query("INSERT INTO [dbo].[User] ([userId],[userName]) VALUES ('" + UsID + "','" + UsName + "')")              
                            return replyText(event.replyToken,"สวัสดีครับ " + UsName +" \n ผมคือระบบอัตโนมัติ บทสนทนาที่เกิดขึ้นภายในกลุ่มนี้จะถูกบันทึกเพื่อนำไปปรับปรุงและพัฒนาระบบต่อไป \nข้อมูลทุกอย่างจะถูกเก็บเป็นความลับและไม่มีการเปิดเผยต่อสาธารณะ \nขอบคุณครับ");
                        }else{
                          for(var i=0;i<rows.rowsAffected;i++){
                            if(UsID == rows.recordset[i].userId)
                                {
                                  num=1;
                                  if(UsName != rows.recordset[i].userName){
                                    req.query("UPDATE [dbo].[User] SET [userName] ="+ UsName +" WHERE userName ="+ rows.recordset[i].userName)  
                                    return replyText(event.replyToken,"สวัสดีครับ"+ UsName +" \n ผมคือระบบอัตโนมัติ บทสนทนาที่เกิดขึ้นภายในกลุ่มนี้จะถูกบันทึกเพื่อนำไปปรับปรุงและพัฒนาระบบต่อไป \nข้อมูลทุกอย่างจะถูกเก็บเป็นความลับและไม่มีการเปิดเผยต่อสาธารณะ \nขอบคุณครับ");                 
                                }}
                            else num+=2
                          }  
                          if(num > 1){
                            req.query("INSERT INTO [dbo].[User] ([userId],[userName]) VALUES ('" + UsID + "','" + UsName + "')")              
                            return replyText(event.replyToken,"สวัสดีครับ"+ UsName +" \n ผมคือระบบอัตโนมัติ บทสนทนาที่เกิดขึ้นภายในกลุ่มนี้จะถูกบันทึกเพื่อนำไปปรับปรุงและพัฒนาระบบต่อไป \nข้อมูลทุกอย่างจะถูกเก็บเป็นความลับและไม่มีการเปิดเผยต่อสาธารณะ \nขอบคุณครับ");                           
                          }
                      }
                      })
                      
                                      
                      

                          
                          // if(rows.rowsAffected == 0){
                            // return replyText(event.replyToken,"สวัสดีครับ " + UsName +" \n ผมคือระบบอัตโนมัติ บทสนทนาที่เกิดขึ้นภายในกลุ่มนี้จะถูกบันทึกเพื่อนำไปปรับปรุงและพัฒนาระบบต่อไป \nข้อมูลทุกอย่างจะถูกเก็บเป็นความลับและไม่มีการเปิดเผยต่อสาธารณะ \nขอบคุณครับ");
                          // }
                          // for(var i=0;i<rows.rowsAffected;i++){
                          //   if(rows.recordset[i].Image_id == message.id)
                          //   {
                          //     AdownloadPath = rows.recordset[i].oridinal;
                          //     ApreviewPath = rows.recordset[i].preview;
                          //   }
                          // }
                     
                      // req.query("INSERT INTO [dbo].[User] ([userId],[userName]) VALUES ('" + UsID + "','" + UsName + "')")
                      // return replyText(event.replyToken,"สวัสดีครับ " + UsName +" \n ผมคือระบบอัตโนมัติ บทสนทนาที่เกิดขึ้นภายในกลุ่มนี้จะถูกบันทึกเพื่อนำไปปรับปรุงและพัฒนาระบบต่อไป \nข้อมูลทุกอย่างจะถูกเก็บเป็นความลับและไม่มีการเปิดเผยต่อสาธารณะ \nขอบคุณครับ");
                });  
              
                })
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
    case 'goodbye BOT':
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
      var  UsID = source.userId
      var  GrID = source.groupId
      if (GrID == null) GrID = 'direct user'
      var conn = new sql.ConnectionPool(dbConfig);
          conn.connect().then(function () {
              var req = new sql.Request(conn);
              req.query("INSERT INTO [dbo].[Message] ([text],[userId],[groupId]) VALUES ('" + message.text + "','" + UsID + "','" + GrID + "')")
          });
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
      var  GrID = source.groupId
      if (GrID == null) GrID = 'direct user'
      var  image64
       image2base64(originalContentUrl)
                .then(
                    (response) => {
                        image64 = 'data:image/jpeg;base64,'+ response
                        // console.log('data:image/jpeg;base64,'); 
                        // console.log(response); 
        
                       var conn = new sql.ConnectionPool(dbConfig);
                        conn.connect().then(function () {
                            var req = new sql.Request(conn);
                            req.query("INSERT INTO [dbo].[Image] ([image64],[userId],[groupId]) VALUES ('" + image64 + "','" + UsID + "','" + GrID + "')")
                        });
                        // return client.replyMessage(
                        //     replyToken,
                        //     {
                        //     // type: 'image',
                        //     // originalContentUrl: 'data:image/jpeg;base64,'+ response,
                        //     // previewImageUrl: previewImageUrlT
                        //     type: 'text',
                        //     text:  originalContentUrl
                        //     //originalContentUrlT + '\n\n' + previewImageUrlT
                        //     })
                    }
                )
    });
}

function handleVideo(message, replyToken, source) {
  const downloadPath = path.join(__dirname, 'downloaded', `${message.id}.mp4`);
  //const previewPath = path.join(__dirname, 'downloaded', `${message.id}-pw.jpg`);
  
  var originalContentUrl = baseURL + '/downloaded/' + path.basename(downloadPath)
  return downloadContent(message.id, downloadPath)
    .then((downloadPath) => {
        var  UsID = source.userId
        var  GrID = source.groupId
        if (GrID == null) GrID = 'direct user'
        var  video64
        image2base64(originalContentUrl)
                .then(
                    (response) => {
                        video64 = 'data:video/mp4;base64,'+ response
                        // console.log('data:image/jpeg;base64,'); 
                        // console.log(response); 
        
                        var conn = new sql.ConnectionPool(dbConfig);
                        conn.connect().then(function () {
                            var req = new sql.Request(conn);
                            req.query("INSERT INTO [dbo].[Video] ([video64],[userId],[groupId]) VALUES ('" + video64 + "','" + UsID + "','" + GrID + "')")
                        });
                        return client.replyMessage(
                            replyToken,
                            {
                            // type: 'image',
                            // originalContentUrl: 'data:image/jpeg;base64,'+ response,
                            // previewImageUrl: previewImageUrlT
                            type: 'text',
                            text:  baseURL + '/downloaded/' + path.basename(downloadPath)
                            //originalContentUrlT + '\n\n' + previewImageUrlT
                            })
              }
          )
    });
    
}

function handleAudio(message, replyToken, source) {
  const downloadPath = path.join(__dirname, 'downloaded', `${message.id}.mp3`);

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
                type: 'text',
                text:  baseURL + '/downloaded/' + path.basename(downloadPath)
               
            //   type: 'audio',
            //   originalContentUrl: baseURL + '/downloaded/' + path.basename(downloadPath),
            //   duration: audioDuration * 1000
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

function handleLocation(message, replyToken, source) {
 
  var  UsID = source.userId
  var  GrID = source.groupId
  if (GrID == null) GrID = 'direct user'
  var conn = new sql.ConnectionPool(dbConfig);
      conn.connect().then(function () {
          var req = new sql.Request(conn);
          req.query("INSERT INTO [dbo].[Location] ([address],[userId],[groupId]) VALUES ('" + message.address + "','" + UsID + "','" + GrID + "')")
      });




  // return client.replyMessage(
  //   replyToken,
  //   {
  //     type: 'location',
  //     title: message.title,
  //     address: message.address,
  //     latitude: message.latitude,
  //     longitude: message.longitude,
  //   }
  // );
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
