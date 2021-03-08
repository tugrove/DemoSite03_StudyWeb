/* 変数定義 */
/* ============================================ */

// APIのためのパラメタ
const type = `video`;                                  // 動画検索を指定
const part = `snippet`;                                // 検索結果に全てのプロパティを含む
let q = `cake`;                                        // 初期検索ワードを`cake`に設定
const videoEmbeddable = `true`;                        // Webページに埋め込み可能な動画を検索
const videoSyndicated = `true`;                        // youtube.com以外で再生可能な動画のみ取得
const maxResults = 3;                                  // 動画の最大取得数
const key = `AIzaSyCuRRugd7JW05COyePp9e5_F5euXrIz4zs`; // APIキー

// 動画を表示するiframeの親要素divにつけるタグの名前
const IFRAMEWRAP = `video`;

/* 関数定義 */
/* ============================================ */

// 文字列の結合の際に、HTTPヘッダインジェクションを避けるための関数
// const foo = urijoin`https://sample.com/${hoge}/sample/${fuga}/`;のように用いる
const urijoin = (strings, ...values) => {
    const result = [];
    const I = strings.length - 1;
    for (let i = 0; i < I; i++) {
        result.push(strings[i], encodeURIComponent(values[i]));
    }
    result.push(strings[I]);
    return result.join("");
};

// データ取得が成功した際に、動画を表示する関数
// div#YouTube内に取得した動画件数文のiframeを作成する
const setYouTube = (data) => {
    const result = [];
    // 動画を表示するHTMLを作る
    for (let item of data.items) {
        const video = `<iframe src="https://www.youtube.com/embed/${item.id.videoId}" allowfullscreen></iframe>`;
        result.push(`<div class="${IFRAMEWRAP}">${video}</div>`);
    }
    result.join("");
    // HTMLに反映する
    $(`.page-gallery #pageMain #galleryMovie #YouTubeVideos`).html(result);
};


/* HTMLの読み込み後の処理 */
/* ============================================ */
let url = urijoin`https://www.googleapis.com/youtube/v3/search?type=${type}&part=${part}&q=${q}&videoEmbeddable=${videoEmbeddable}&videoSyndicated=${videoSyndicated}&maxResults=${maxResults}&key=${key}`;

$( () => {
    // youtubeの動画を検索して取得
    $.ajax({
        url: url,
        dataType: `jsonp`
    }).done( data => {
        if (data.items) {
            setYouTube(data);
        } else {
            console.log(data);
            alert('該当するデータが見つかりませんでした');
        }
    }).fail( data => {
        alert(`通信に失敗しました`);
    });
});

