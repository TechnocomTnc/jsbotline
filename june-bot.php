<?php
$strAccessToken = "7YR60AJ855Zu1Etxsc7aCdFqhip1o8yAKj7PzLe90ClE9Po0fz5o81BeghtpCki4+zFZ7FrYjjbrFvQw84+Axi+P1zWPnxSCTl/lF5gVTDaDqdC5IHk30qnjo7GQ1hHKizexgGNpBPn/Fwz3slJqkQdB04t89/1O/w1cDnyilFU=";
$content = file_get_contents('php://input');
$arrJson = json_decode($content, true);
$strUrl = "https://api.line.me/v2/bot/message/reply";
$arrHeader = array();
$arrHeader[] = "Content-Type: application/json";
$arrHeader[] = "Authorization: Bearer {$strAccessToken}";
$_msg = $arrJson['events'][0]['message']['text'];
$api_key="c-9iVt7OvlHt_HeJci-4E3dL-PpBhF77";
$url = 'https://api.mlab.com/api/1/databases/junebot/collections/question?apiKey='.$api_key.'';
$json = file_get_contents('https://api.mlab.com/api/1/databases/junebot/collections/question?apiKey='.$api_key.'&q={"question":"'.$_msg.'"}');
$data = json_decode($json);
$isData=sizeof($data);



// $Durl = 'https://api.mlab.com/api/1/databases/junebot/collections/question?apiKey='.$api_key.'';
// $Djson = file_get_contents('https://api.mlab.com/api/1/databases/junebot/collections/question?apiKey='.$api_key.'&q={"question":"'.$_question.'"}');
// $Ddata = json_decode($Djson);
// $DisData=sizeof($Ddata);









// if (strpos($_msg, 'ลบ') !== false) {
//   if (strpos($_msg, 'ลบ') !== false) {
//       $x_tra = str_replace("ลบ","", $_msg);
//       $pieces = explode(",", $x_tra);
      // $_question=str_replace(" ","",$pieces[0]);
      // $_answer=str_replace("","",$pieces[1]);

      // $arrPostData = array();
      // $arrPostData['replyToken'] = $arrJson['events'][0]['replyToken'];
      // $arrPostData['messages'][0]['type'] = "text";
      // $arrPostData['messages'][0]['text'] = $_msg;
      // $arrPostData['messages'][1]['type'] = "text";
      // $arrPostData['messages'][1]['text'] = $_question;

      $_question="เน่";
      $_answer="ครับ";
      $Durl = 'https://api.mlab.com/api/1/databases/junebot/collections/question?apiKey='.$api_key.'';
      $Djson = file_get_contents('https://api.mlab.com/api/1/databases/junebot/collections/question?apiKey='.$api_key.'&q={"question":"'.$_question.'"}');
      $Ddata = json_decode($Djson);
      $DisData=sizeof($Ddata);
      echo 'START <br>';

      // if($DisData>0){
      //   foreach($Ddata as $Drec){
      //       if($_answer == $Drec->answer) {
      //         $z = $Drec->answer;
      //         echo 'z = '.$z.'<br>';
      //       }
      //       echo $Drec->answer.'<br>';
      //     }

      //       //  $arrPostData = array();
      //       //  $arrPostData['replyToken'] = $arrJson['events'][0]['replyToken'];
      //       //  $arrPostData['messages'][0]['type'] = "text";
      //       //  $arrPostData['messages'][0]['text'] = $_answer;
          
      //       //$arrPostData['messages'][0]['text'] = $z;
      // }


      // $result = file_get_contents( $url, false, 
      // stream_context_create(array(
      //       'http' => array(
      //           'method' => 'DELETE'
      //       )
      //   ))
      //   );

        // $arrPostData = array();
        // $arrPostData['replyToken'] = $arrJson['events'][0]['replyToken'];
        // $arrPostData['messages'][0]['type'] = "text";
        // $arrPostData['messages'][0]['text'] = 'ลบแย้ว (´▽｀)';
//   }
// }










// if (strpos($_msg, 'น้องเน่จำนะ') !== false) {
//   if (strpos($_msg, 'น้องเน่จำนะ') !== false) {
//       $x_tra = str_replace("น้องเน่จำนะ","", $_msg);
//       $pieces = explode(",", $x_tra);
//       $_question=str_replace(" ","",$pieces[0]);
//       $_answer=str_replace("","",$pieces[1]);
//       //Post New Data
//         $newData = json_encode(  
//           array(
//             'question' => $_question,
//             'answer'=> $_answer));  
//         $opts = array(
//           'http' => array(
//               'method' => "POST",
//               'header' => "Content-type: application/json",
//               'content' => $newData));
//         $context = stream_context_create($opts);
//         $returnValue = file_get_contents($url,false,$context);

//         $arrPostData = array();
//         $arrPostData['replyToken'] = $arrJson['events'][0]['replyToken'];
//         $arrPostData['messages'][0]['type'] = "text";
//         $arrPostData['messages'][0]['text'] = 'จะจำอย่างดีเลยครับ (´▽｀)';
//   }
// }
// else{
//   if($isData>0){
//     foreach($data as $rec){
//         $a[$i] = $rec->answer;
//         $i++;
//       }
//       $b = array_rand($a,1);
//       $arrPostData = array();
//       $arrPostData['replyToken'] = $arrJson['events'][0]['replyToken'];
//       $arrPostData['messages'][0]['type'] = "text";

//       if($a[$b] != "") {
//           // $arrPostData['messages'][0]['text'] = $a[$b];
//           $arrPostData['messages'][0]['text'] = $a[$b];
//       }
//       else{
//           $arrPostData['messages'][0]['text'] = 'บอกว่าไม่รู้เรื่องไงครับ สอนผมสิๆ';
//      }
//   }else{
//     $arrPostData = array();
//     $arrPostData['replyToken'] = $arrJson['events'][0]['replyToken'];
//     $arrPostData['messages'][0]['type'] = "text";
//     $arrPostData['messages'][0]['text'] = 'อันนี้ไม่รู้เรื่องครับ สอนหน่อย';
    
//     $nonData = json_encode(  
//         array(
//           'question' => $_msg,
//           // 'answer'=> ''  
//         )
//       );
//       $opts = array(
//         'http' => array(
//             'method' => "POST",
//             'header' => "Content-type: application/json",
//             'content' => $nonData
//          )
//       );
//       $context = stream_context_create($opts);
//       $returnValue = file_get_contents($url,false,$context);
//       //$arrPostData = array();
   
//   }
// }
$channel = curl_init();
curl_setopt($channel, CURLOPT_URL,$strUrl);
curl_setopt($channel, CURLOPT_HEADER, false);
curl_setopt($channel, CURLOPT_POST, true);
curl_setopt($channel, CURLOPT_HTTPHEADER, $arrHeader);
curl_setopt($channel, CURLOPT_POSTFIELDS, json_encode($arrPostData));
curl_setopt($channel, CURLOPT_RETURNTRANSFER,true);
curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, false);
$result = curl_exec($channel);
curl_close ($channel);
?>
