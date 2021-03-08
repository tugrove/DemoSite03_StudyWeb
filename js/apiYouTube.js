/* 変数定義 */
/* ============================================ */

// APIのためのパラメタ
const type = `video`;           // 動画検索を指定
const part = `snippet`;         // 検索結果に全てのプロパティを含む
const videoEmbeddable = `true`; // Webページに埋め込み可能な動画を検索
const videoSyndicated = `true`; // youtube.com以外で再生可能な動画のみ取得
const maxResults = 3;           // 動画の最大取得数
const key = `AIzaSyCuRRugd7JW05COyePp9e5_F5euXrIz4zs`; // APIキー

// 動画を表示するiframeの親要素divにつけるタグの名前
const IFRAMEWRAP = `YouTube`;

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


/* オブジェクト定義 */
/* ============================================ */

const operateMovie = {

    // データ取得が成功した際に、動画を表示するメソッド
    // #YouTubeMovies内に取得した動画件数分のiframe要素を作成する
    setMovies: function(data) {
        // 取得した動画を表示するiframe要素を作成
        const result = [];
        for (let item of data.items) {
            const iframe = urijoin`<iframe src="https://www.youtube.com/embed/${item.id.videoId}" allowfullscreen></iframe>`;
            result.push(`<div class="${IFRAMEWRAP}">${iframe}</div>`);
        }
        result.join("");
        // #YouTubeMoviesの中身を変更する
        $(`.page-gallery #pageMain #galleryMovie #YouTubeMovies`).html(result);
    },

    // YouTubeAPIによって動画情報を取得するメソッド
    // API用のURLを引数として渡す
    ajaxYouTube: function(url) {
        // youtubeの動画を検索して取得
        $.ajax({
            url: url,
            dataType: `jsonp`
        }).done( data => {
            if (data.items) {
                this.setMovies(data);
            } else {
                console.log(data);
                alert('該当するデータが見つかりませんでした');
            }
        }).fail( data => {
            alert(`通信に失敗しました`);
        });
    },

    // movieCategoryのからYouTubeAPIの検索キーワードを取得し、URLを作成して、ajaxを行うメソッド
    selectMovie: function() {
        const q = $(`.page-gallery #pageMain #galleryMovie #movieCategory`).val();
        const url = urijoin`https://www.googleapis.com/youtube/v3/search?type=${type}&part=${part}&q=${q}&videoEmbeddable=${videoEmbeddable}&videoSyndicated=${videoSyndicated}&maxResults=${maxResults}&key=${key}`;
        this.ajaxYouTube(url);
    }
};


/* HTMLの読み込み後の処理 */
/* ============================================ */

$( () => {
    // はじめにYouTubeAPIを取得する
    operateMovie.selectMovie();
    // #movieCategoryが変更されたらYouTubeAPIを取得しなおす
    $(`.page-gallery #pageMain #galleryMovie #movieCategory`).on(`change`, () => {
        operateMovie.selectMovie();
    });
});

