function GetGroupAddress()
{
  // 1ドメインにつき最大200まで取得
  let domains = ['justincase-tech.com', 'justincase.jp'];
  let maxResults = 200;
  let endFlag = false;
  let token = '';

  // アクティブなシート取得
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  // ヘッダー行を設定
  const rows = [];
  rows.push(["グループアドレス", "説明", "登録ユーザー数", "オーナ"]);
  let rowcount = 0;

  try { 
    // domainごとにループする
    for (let i=0; i < domains.length; i++){
      let domain = domains[i];
      let groups = AdminDirectory.Groups.list({
        domain: domain,
        maxResults: maxResults,
        pageToken: token
      });
      Logger.log(groups.groups.length)
      if(groups) {
        // グループごとにループ
        for(let j=0; j < groups.groups.length; j++){ 
          // オーナを取得
          let members = AdminDirectory.Members.list(groups.groups[j].email,{
              roles: 'OWNER'
            });
          let cols = [];         
          cols.push(groups.groups[j].email); // グループアドレス
          cols.push(groups.groups[j].description); // 説明
          cols.push(groups.groups[j].directMembersCount); // 登録ユーザ数
          if (typeof members.members !== 'undefined'){
            cols.push(members.members[0].email); // オーナ
          } else {
            cols.push('OWNER None'); // オーナ未設定
          }
          // 行追加
          rows.push(cols);
          Logger.log(cols);
          // 最終的な行数計算
          rowcount ++;
        }
      }
    }
      // シート書き込み
      sheet.clear();
      sheet.getRange(1, 1, rowcount +1 , 4).setValues(rows);
    } catch(error) {
      console.log(error);
    }
}

function onOpen() {
  SpreadsheetApp.getUi()
  .createMenu("管理")
  .addItem("グループアドレス一覧取得", "GetGroupAddress")
  .addToUi();
}