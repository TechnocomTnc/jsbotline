<?php
$strAccessToken = "4qwma3IF0OWn1cyuu1CNeRIjviy681SPIt9fnTm+TYMem3U2SRjZIU4sUHSdNsBI+H7eQ9HdpxUYAgeXK9bE51yMST5kkMLiuN5SS7/TGdgzxnkmRaVZ0qR0snq1tMBTHcMRRFTp0svffj4PC28MgAdB04t89/1O/w1cDnyilFU=";
$content = file_get_contents('php://input');
$arrJson = json_decode($content, true);
$strUrl = "https://api.line.me/v2/bot/message/reply";
$arrHeader = array();
$arrHeader[] = "Content-Type: application/json";
$arrHeader[] = "Authorization: Bearer {$strAccessToken}";

$_msg = $arrJson['events'][0]['message']['text'];
// $_msg = 'ดี';
$api_key="eX1UApsqnJjZdfxg3nXb5WKJYPJDPGvU";
$Aurl = 'https://api.mlab.com/api/1/databases/tct27bot/collections/AA?apiKey='.$api_key.'';
$nonurl = 'https://api.mlab.com/api/1/databases/tct27bot/collections/nonQuestion?apiKey='.$api_key.'';
$Qurl = 'https://api.mlab.com/api/1/databases/tct27bot/collections/QQ?apiKey='.$api_key.'';
$Qjson = file_get_contents('https://api.mlab.com/api/1/databases/tct27bot/collections/QQ?apiKey='.$api_key.'&q={"question":"'.$_msg.'"}');
$Qdata = json_decode($Qjson);
$QisData=sizeof($Qdata);

$nonjson = file_get_contents('https://api.mlab.com/api/1/databases/tct27bot/collections/nonQuestion?apiKey='.$api_key.'&q={"question":"'.$_msg.'"}');
$nondata = json_decode($nonjson);
$nonisData=sizeof($nondata);

$QQQjson = file_get_contents('https://api.mlab.com/api/1/databases/tct27bot/collections/QQ?apiKey='.$api_key.'');
$QQQdata = json_decode($QQQjson);
$QQQisData=sizeof($QQQdata);
   
$z = 0;
foreach ($arrJson['events'] as $event){
    $am = $event['message']['type'];	
}
if($am == 'sticker'){
    $arrPostData = array();
    $arrPostData['replyToken'] = $arrJson['events'][0]['replyToken'];
    $arrPostData['messages'][0]['type'] = "text";
    $arrPostData['messages'][0]['text'] = 'เลายังอ่านติ้กเก้อมั่ยด้ายน้า';

}

if($am == 'text'){
    if (ereg("^จำนะจะสอน", $_msg) !== false) {
            $x_tra = str_replace("จำนะจะสอน","", $_msg);
            $pieces = explode(",", $x_tra);
            $_question=str_replace(" ","",$pieces[0]);
            $_answer=str_replace("","",$pieces[1]);

            $QQjson = file_get_contents('https://api.mlab.com/api/1/databases/tct27bot/collections/QQ?apiKey='.$api_key.'&q={"question":"'.$_question.'"}');
            $QQdata = json_decode($QQjson);
            $QQisData = sizeof($QQdata);
            if($QQisData>0){ 
                    foreach($QQdata as $rec){$x = $rec->m_id;}
                    $newanswer = json_encode(  
                        array(
                            'answer' => $_answer,
                            'm_id' => $x));  
                    $opts = array(
                        'http' => array(
                        'method' => "POST",
                        'header' => "Content-type: application/json",
                        'content' => $newanswer));
                    $context = stream_context_create($opts);
                    $returnValue = file_get_contents($Aurl,false,$context);
                    echo "เพิ่มคำตอบ";
            }
            else{
                    $nQjson = file_get_contents('https://api.mlab.com/api/1/databases/tct27bot/collections/QQ?apiKey='.$api_key.'');
                    $nQdata = json_decode($nQjson);
                    $nQisData=sizeof($nQdata);

                    if($nQisData>=0){ 
                        foreach($nQdata as $rec){
                            $x[$z] = $rec->m_id;
                            $z++;
                        }
                        $id = max($x);
                        $id++;

                        $newquestion = json_encode(  
                            array(
                                'question' => $_question,
                                'm_id' => $id            
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
                                'm_id' => $id,   
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
                echo "เพิ่มคำถาม,ตอบ";
                $arrPostData = array();
                $arrPostData['replyToken'] = $arrJson['events'][0]['replyToken'];
                $arrPostData['messages'][0]['type'] = "text";
                $arrPostData['messages'][0]['text'] = 'ขอบคุณมากนะครับ (´▽｀)';
    }
    else{
        if($QQQisData > 0){
            $i=1;
            foreach($QQQdata as $rec){
                if (ereg("($rec->question)+",$_msg) !== false)
                {
                    echo 'Question : ';
                    echo $rec->question.'<br>';   
                    $x[$i] = $rec->m_id;
                    $i++;
                    echo $QQQisData;
                }
                else {

                    echo '--';
                    print_r($x);
                }
            }
            if($x!=null){
                $z=1; 
                $r=1;
                foreach ($x as $rec){ 
                    $Ajson = file_get_contents('https://api.mlab.com/api/1/databases/tct27bot/collections/AA?apiKey='.$api_key.'&q={"m_id":'.$x[$z].'}');
                    $Adata = json_decode($Ajson);
                    $AisData= sizeof($Adata);
                    $z++;
                
                    if($AisData!=null){
                        foreach($Adata as $Arec){
                        
                            $a[$r] = $Arec->answer;
                            $r++;
                        }
                    }
                }
                
                echo "ตอบ";
                print_r($a);
                $b = array_rand($a,1);
                echo $b;
                $uimg = $a[$b];

                $image_url = "https://i.pinimg.com/originals/cc/22/d1/cc22d10d9096e70fe3dbe3be2630182b.jpg";
                $arrayPostData['replyToken'] = $arrJson['events'][0]['replyToken'];
                $arrayPostData['messages'][0]['type'] = "image";
                $arrayPostData['messages'][0]['image'] = $image_url;
                // $arrayPostData['messages'][0]['previewImageUrl'] = $image_url;
                // replyMsg($arrayHeader,$arrayPostData);




                // if(ereg(".jpg$", $uimg) !== false) {
                //     echo $uimg;
                //     $image_url = $uimg;
                //     $arrayPostData['replyToken'] = $arrayJson['events'][0]['replyToken'];
                //     $arrayPostData['messages'][0]['type'] = "image";
                //     $arrayPostData['messages'][0]['originalContentUrl'] = $image_url;
                //     $arrayPostData['messages'][0]['previewImageUrl'] = $image_url;
                // }else{
                //     $arrPostData = array();
                //     $arrPostData['replyToken'] = $arrJson['events'][0]['replyToken'];
                //     $arrPostData['messages'][0]['type'] = "text";
                //     $arrPostData['messages'][0]['text'] = $a[$b];
                //     echo  $a[$b];
                // }
            }
            else if($nonisData>0){
                $arrPostData = array();
                $arrPostData['replyToken'] = $arrJson['events'][0]['replyToken'];
                $arrPostData['messages'][0]['type'] = "text";
                $arrPostData['messages'][0]['text'] = 'อันนี้ไม่รู้เรื่องจริงๆครับ ขอโทษนะ';
                echo "บอกว่าไม่รู้เรื่องไงครับ สอนผมสิๆ";
            }  
            else{
                if($_msg == null) continue; 
                $arrPostData = array();
                $arrPostData['replyToken'] = $arrJson['events'][0]['replyToken'];
                $arrPostData['messages'][0]['type'] = "text";
                $arrPostData['messages'][0]['text'] = 'พิมพ์ผิดหรือเปล่าครับ ไม่เห็นรู้เรื่องเลยอ่าครับ';
                echo "สอนหน่อยครับ เน่ไม่ค่อยรู้เรื่อง";
                
                $nonData = json_encode(  
                    array(
                    'question' => $_msg, 
                ));
                $opts = array(
                    'http' => array(
                        'method' => "POST",
                        'header' => "Content-type: application/json",
                        'content' => $nonData
                ));
                $context = stream_context_create($opts);
                $returnValue = file_get_contents($nonurl,false,$context);    
            }
    }
       
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
