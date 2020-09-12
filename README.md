# 使い方

**branch**  
`master・・・webpage用`  
`feature/app_setting・・・webapp用`  

## 1. gitからソースを落としてきたら、下記のコマンドで、package.jsonにあるパッケージをインストール  

`npm i`  

## 2. src内の各ディレクトリを編集してください  

### data
・meta.json headのmeta情報など、共通テンプレートでページごとに違う値を設定したい時に便利。  
・manifest.json webappの設定ファイル（コーポレートサイトとかでは特に必要ないかも。いらない場合は削除でOK）
  
### img
・画像ファイルの格納場所。今回圧縮設定等はwebpackではやってません。  
  
### js 
・好きにモジュールファイル追加したりpackageをインストールして、app.js にimportしてください。  
  
### pug
・このディレクトリをルートとしたディレクトリ構成の通りで、\*.pugが、\*.htmlに変換され吐き出されます。ディレクトリやファイルの追加は自由にやってください。  
・dataのmeta.jsonの読み込みは「html-webpack-plugin」を利用しています。複数のjsonファイルを読み込んだりしたい場合は、webpack.config.jsを編集して見てください。  
  
### stylus
・pugの構成に合わせたディレクトリ構成にしています。  
  

## 3. buildの仕方は、package.jsonのscriptにある2通り  

`npm run watch:dev`  
・開発中に利用ファイルを保存すると自動でpublicフォルダに反映。
・今回ローカルサーバーは建てません。（サーバーに依存しない静的ファイルのみの構成で動作する状態で開発できるように）
・吐き出した静的ファイルをブラウザで確認してください。  
  
`npm run build`  
・ルートパスで出力するようにしているが、webpack.config.js で、好きなように設定できます。  
→ buildしたファイルは、public以下に保存されます。  