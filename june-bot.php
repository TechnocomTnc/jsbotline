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
$z = 0;

$Aurl = 'https://api.mlab.com/api/1/databases/junebot/collections/AA?apiKey='.$api_key.'';
$nonurl = 'https://api.mlab.com/api/1/databases/junebot/collections/nonQuestion?apiKey='.$api_key.'';
$Qurl = 'https://api.mlab.com/api/1/databases/junebot/collections/QQ?apiKey='.$api_key.'';
$Qjson = file_get_contents('https://api.mlab.com/api/1/databases/junebot/collections/QQ?apiKey='.$api_key.'&q={"question":"'.$_msg.'"}');
$Qdata = json_decode($Qjson);
$QisData=sizeof($Qdata);

$nonjson = file_get_contents('https://api.mlab.com/api/1/databases/junebot/collections/nonQuestion?apiKey='.$api_key.'&q={"question":"'.$_msg.'"}');
$nondata = json_decode($nonjson);
$nonisData=sizeof($nondata);

 if (strpos($_msg, 'น้องเน่จำนะ') !== false) {
  if (strpos($_msg, 'น้องเน่จำนะ') !== false) {
      $x_tra = str_replace("น้องเน่จำนะ","", $_msg);
      $pieces = explode(",", $x_tra);
      $_question=str_replace(" ","",$pieces[0]);
      $_answer=str_replace("","",$pieces[1]);

      
      $QQjson = file_get_contents('https://api.mlab.com/api/1/databases/junebot/collections/QQ?apiKey='.$api_key.'&q={"question":"'.$_question.'"}');
      $QQdata = json_decode($QQjson);
      $QQisData=sizeof($QQdata);

      if($QQisData>0){ 
        foreach($QQdata as $rec){
            $x = $rec->m_id;
        }
        $newanswer = json_encode(  
            array(
                'answer' => $_answer,
                'm_id' => $x,   
            ));  
            $opts = array(
            'http' => array(
                'method' => "POST",
                'header' => "Content-type: application/json",
                'content' => $newanswer));
            $context = stream_context_create($opts);
            $returnValue = file_get_contents($Aurl,false,$context);
        }else{
            $nQjson = file_get_contents('https://api.mlab.com/api/1/databases/junebot/collections/QQ?apiKey='.$api_key.'');
            $nQdata = json_decode($nQjson);
            $nQisData=sizeof($nQdata);

            if($nQisData>=0){ 
                foreach($nQdata as $rec){
                     $z++;
                }
                if($z==0)$z++;
                $newquestion = json_encode(  
                    array(
                        'question' => $_question,
                        'm_id' => $z            
                    ));  
                    $opts = array(
                    'http' => array(
                        'method' => "POST",
                        'header' => "Content-type: application/json",
                        'content' => $newquestion));
                    $context = stream_context_create($opts);
                    $returnValue = file_get_contents($Qurl,false,$context);
                
                $newanswer = json_encode(  
                    array(
                        'answer' => $_answer,
                        'm_id' => $z,   
                    ));  
                    $opts = array(
                    'http' => array(
                        'method' => "POST",
                        'header' => "Content-type: application/json",
                        'content' => $newanswer));
                    $context = stream_context_create($opts);
                    $returnValue = file_get_contents($Aurl,false,$context);
            }
        }
        $arrPostData = array();
        $arrPostData['replyToken'] = $arrJson['events'][0]['replyToken'];
        $arrPostData['messages'][0]['type'] = "text";
        $arrPostData['messages'][0]['text'] = 'จะจำอย่างดีเลยครับ (´▽｀)';
  }
}
else{
  if($QisData>0){
    foreach($Qdata as $rec){
        $x = $rec->m_id;
    }
        $Ajson = file_get_contents('https://api.mlab.com/api/1/databases/junebot/collections/AA?apiKey='.$api_key.'&q={"m_id":'.$x.'}');
        $Adata = json_decode($Ajson);
        $AisData= sizeof($Adata);
        if($AisData>0){
            foreach($Adata as $Arec){
                $a[$i] = $Arec->answer;
                $i++;
            }
            $b = array_rand($a,1);
            $arrPostData = array();
            $arrPostData['replyToken'] = $arrJson['events'][0]['replyToken'];
            $arrPostData['messages'][0]['type'] = "text";
            $arrPostData['messages'][0]['text'] = $a[$b];
        }

    
  }else if($nonisData>0){
    $arrPostData = array();
    $arrPostData['replyToken'] = $arrJson['events'][0]['replyToken'];
    $arrPostData['messages'][0]['type'] = "text";
    $arrPostData['messages'][0]['text'] = 'บอกว่าไม่รู้เรื่องไงครับ สอนผมสิๆ';
  }  
  else{
    if($_msg == null) continue;
    $arrPostData = array();
    $arrPostData['replyToken'] = $arrJson['events'][0]['replyToken'];
    $arrPostData['messages'][0]['type'] = "text";
    $arrPostData['messages'][0]['text'] = 'สอนหน่อยครับ เน่ไม่ค่อยรู้เรื่อง';
    
    $nonData = json_encode(  
        array(
          'question' => $_msg,
          // 'answer'=> ''  
        )
      );
      $opts = array(
        'http' => array(
            'method' => "POST",
            'header' => "Content-type: application/json",
            'content' => $nonData
         )
      );
      $context = stream_context_create($opts);
      $returnValue = file_get_contents($nonurl,false,$context);
      //$arrPostData = array();
   
  }
}
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
