/* 変数定義 */
/* ============================================ */

/* 定数 */
/* -------------------------------------------- */

// CSSアニメーション制御クラス
const OPEN = `open`;
const ERROR = `error`;

// YouTubeAPIのためのパラメタ
const type = `video`;           // 動画検索を指定
const part = `snippet`;         // 検索結果に全てのプロパティを含む
const videoEmbeddable = `true`; // Webページに埋め込み可能な動画を検索
const videoSyndicated = `true`; // youtube.com以外で再生可能な動画のみ取得
const maxResults = 3;           // 動画の最大取得数
const key = `AIzaSyCuRRugd7JW05COyePp9e5_F5euXrIz4zs`; // APIキー

// galleryページの動画を表示するiframeの親要素divにつけるタグの名前
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

// スクロール関連
const operateScroll = {

    // 移動先の要素がページヘッダで隠れないように、ページヘッダの高さだけ移動先をずらすメソッド
    goToTop: function(elem) {
        const height = $(`#pageHeader`).outerHeight();
        const y = elem.offset().top;
        scrollTo(0, y - height);
    }
};

// サイドメニューの開閉
const operateSideMenu = {

    open: function() {
        $(`#sideMenuButton`).addClass(OPEN);
        $(`#sideMenu`).addClass(OPEN);
        this.globalNav.closeAllChildUl();
    },

    close: function() {
        $(`#sideMenuButton`).removeClass(OPEN);
        $(`#sideMenu`).removeClass(OPEN);
    },

    toggle: function() {
        const getClass = $(`#sideMenuButton`).attr(`class`);
        if (getClass === OPEN) {
            this.close();
        } else {
            this.open();
        }
    },

    globalNav: {

        toggleChildUl: function(elem) {
            elem.toggleClass(OPEN);
        },

        closeAllChildUl: function() {
            $(`#sideMenu .globalNav .parent-ul .parent-li`).removeClass(OPEN);
        }
    }
};

// galleryページのYouTubeAPIに関するオブジェクト
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

// form関連
const operateForm = {

    addError: function(elem) {
        elem.addClass(ERROR);
    },

    changeCharacterCount: function(elem) {
        const maxlength = elem.attr(`maxlength`);
        const currentlength = elem.val().length;
        elem.next().text(`${currentlength}/${maxlength}`);
    }
};


/* HTMLの読み込み終了後の処理 */
/* ============================================ */

$( () => {

    /* 全体設定 */
    /* -------------------------------------------- */

    // サイドメニューボタンを押した際の処理
    $(`#sideMenuButton`).on(`click`, () => {
        operateSideMenu.toggle();
    });

    // サイドメニュー内のリンクを踏んだ際にサイドメニューを閉じる処理
    $(`#sideMenu a`).on(`click`, () => {
        operateSideMenu.close();
    });
    
    // サイドメニュー内のアコーディオンメニューを開閉する処理
    $(`#sideMenu .globalNav .parent-ul .parent-li span`).on(`click keydown`, event => {
        const parent = $(event.target).parent();
        const keyCode = event.keyCode;
        if (!keyCode || keyCode === 13) {
            operateSideMenu.globalNav.toggleChildUl(parent);
        }
    });

    /* galleryページ */
    /* -------------------------------------------- */

    // はじめにYouTubeAPIを取得する
    operateMovie.selectMovie();

    // #movieCategoryが変更されたらYouTubeAPIを取得しなおす
    $(`.page-gallery #pageMain #galleryMovie #movieCategory`).on(`change`, () => {
        operateMovie.selectMovie();
    });

    /* contactページ */
    /* -------------------------------------------- */

    // 送信ボタン
    $(`.page-contact #pageMain form #submitButton`).on(`click`, event => {
        const parent = $(event.target).parent();
        operateForm.addError(parent);
        operateScroll.goToTop(parent);
    });

    // inputとtextareaにキー入力した時の処理
    $(`.page-contact #pageMain form .inputArea`).on(`keyup keydown`, event => {
        operateForm.changeCharacterCount($(event.target));
    });
});
