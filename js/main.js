/* 変数定義 */
/* ============================================ */

/* 定数 */
/* -------------------------------------------- */

// CSSアニメーション制御クラス
const OPEN = `open`;   // サイドメニューなどの開閉するメニューが開いていることを表すクラス
const ERROR = `error`; // formなどで、何かエラーを含むことを表すクラス

// indexページのarticleHeader背景の切り替え間隔[ms]
const INTERVAL = 4000;

// YouTubeAPIのためのパラメタ
const type = `video`;           // 動画検索を指定
const part = `snippet`;         // 検索結果に全てのプロパティを含む
const videoEmbeddable = `true`; // Webページに埋め込み可能な動画を検索
const videoSyndicated = `true`; // youtube.com以外で再生可能な動画のみ取得
const maxResults = 1;           // 動画の最大取得数

// galleryページの動画を表示するiframeの親要素divにつけるタグの名前
const IFRAMEWRAP = `YouTube`;


/* 関数定義 */
/* ============================================ */

// 剰余演算をする関数
// ただの%と異なり、負の値を返さない
const mod = (i, j) => {
    let result = i % j;
    if (result < 0) {
        result += Math.abs(j);
    }
    return result;
};

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

// 画面スクロールに関するオブジェクト
const operateScroll = {

    // 移動先の要素がページヘッダで隠れないように、ページヘッダの高さだけ移動先をずらすメソッド
    goToTop: function(elem) {
        const height = $(`#pageHeader`).outerHeight();
        const top = elem.offset().top;
        scrollTo(0, top - height);
    },

    // ページタイトルが隠れるくらい画面スクロールしたら、ページヘッダの企業ロゴを表示するメソッド
    toggleLogo: function() {
        const height = $(`#pageHeader`).outerHeight();
        const top = $(`.pageTitle`).offset().top;
        if ($(window).scrollTop() > top - height) {
            $(`#pageHeader .companyLogo`).addClass(OPEN);
        } else {
            $(`#pageHeader .companyLogo`).removeClass(OPEN);
        }
    }
};

// サイドメニューの開閉に関するオブジェクト
const operateSideMenu = {

    // サイドメニューを開くメソッド
    // 同時にサイドメニュー内のアコーディオンメニューを全て閉じる
    open: function() {
        $(`#sideMenuButton`).addClass(OPEN);
        $(`#sideMenu`).addClass(OPEN);
        this.globalNav.closeAllChildUl();
    },

    // サイドメニューを閉じるメソッド
    close: function() {
        $(`#sideMenuButton`).removeClass(OPEN);
        $(`#sideMenu`).removeClass(OPEN);
    },

    // サイドメニューが開いていれば閉じ、閉じていれば開けるメソッド
    toggle: function() {
        const getClass = $(`#sideMenuButton`).attr(`class`);
        if (getClass === OPEN) {
            this.close();
        } else {
            this.open();
        }
    },

    // サイドメニューのグローバルナビに関するオブジェクト
    globalNav: {

        // 要素を引数とし、その要素のクラスOPENを切り替えるメソッド
        toggleChildUl: function(elem) {
            elem.toggleClass(OPEN);
        },

        // サイドメニューのアコーディオンメニューを全て閉じるメソッド
        closeAllChildUl: function() {
            $(`#sideMenu .globalNav .parent-ul .parent-li`).removeClass(OPEN);
        }
    }
};

// indexページに関わるオブジェクト
const operateIndex = {

    // 要素、値に整数の属性、属性値の数を引数として、その要素の属性値を1増やすメソッド
    countUpAttr: function(elem, attr, N_attr) {
        let i = parseInt(elem.attr(attr));
        i = mod(i + 1, N_attr);
        elem.attr(attr, i);
    }
};

// スライドショーに関するオブジェクト
const operateSlideshow = {

    // 画像番号を引数とし、スライドショーの画像を全て非表示にしてから、与えられた画像番号の画像だけ表示するメソッド
    openImg: function(imgNo) {
        this.closeImgAll();
        $(`.slideshow`).attr(`data-imgNo`, `${imgNo}`);
        $($(`.slideshow .slideshow-img`)[imgNo]).addClass(OPEN);
    },

    // スライドショーの全ての画像を非表示にするメソッド
    closeImgAll: function() {
        $(`.slideshow .slideshow-img`).removeClass(OPEN);
    },

    // 整数を引数とし、スライドショーの画像番号を引数分だけ進めるメソッド
    slideImg: function(n) {
        const N_img = $(`.slideshow .slideshow-img`).length;
        let imgNo = parseInt($(`.slideshow`).attr(`data-imgNo`));
        imgNo = mod(imgNo + n, N_img);
        this.openImg(imgNo);
    },
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
        $(`#YouTubeMovies`).html(result);
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
                // 通信に成功し問題もなかった場合は、取得した動画を表示する
                this.setMovies(data);
            } else {
                // 通信は成功したがデータの取得に失敗した場合は、エラーメッセージを警告すると共に、得られたdataをコンソールに表示する
                console.log(data);
                alert('該当するデータが見つかりませんでした');
            }
        }).fail( data => {
            // 通信に失敗した場合は、エラーメッセージを警告する
            alert(`通信に失敗しました`);
        });
    },

    // 検索キーワードを引数とし、それが空でなければajaxを行う
    selectMovie: function(q) {
        if (q) {
            const url = urijoin`https://www.googleapis.com/youtube/v3/search?type=${type}&part=${part}&q=${q}&videoEmbeddable=${videoEmbeddable}&videoSyndicated=${videoSyndicated}&maxResults=${maxResults}&key=${API_KEY}`;
            this.ajaxYouTube(url);
        }
    }
};

// formに関するオブジェクト
const operateForm = {

    // 要素を引数として、その要素にclass=ERRORを不要する
    addError: function(elem) {
        elem.addClass(ERROR);
    },

    // input要素などを引数として、その要素に入力されている文字と最大入力数を取得し、その要素の次の兄弟要素のtextに代入する
    changeCharacterCount: function(elem) {
        const maxlength = elem.attr(`maxlength`);
        const currentlength = elem.val().length;
        elem.next().text(`${currentlength}/${maxlength}`);
    }
};


/* 実行処理 */
/* ============================================ */

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

/* indexページ */
/* -------------------------------------------- */

// 画面スクロールでページヘッダのロゴの表示を切り替える処理
$(window).on(`scroll`, () => {
    operateScroll.toggleLogo();
});

// articleHeaderの背景を一定間隔で切り替える処理
const timer = setInterval( () => {
    operateIndex.countUpAttr($(`.page-index .articleHeaderImg`), `data-imgNo`, 4);
}, INTERVAL);

/* スライドショー */
/* -------------------------------------------- */

// スライドショーの左右ボタンの処理
$(`.slideshow .slideshow-leftButton`).on(`click`, () => {
    operateSlideshow.slideImg(-1);
});
$(`.slideshow .slideshow-rightButton`).on(`click`, () => {
    operateSlideshow.slideImg(1);
});

// スライドショーのサムネイルの処理
$(`.slideshow .slideshow-thumbnail`).on(`click keydown`, event => {
    const imgNo = parseInt($(event.target).attr(`data-imgNo`));
    const keyCode = event.keyCode;
    if (!keyCode || keyCode === 13) {
        operateSlideshow.openImg(imgNo);
    }
});


/* galleryページ */
/* -------------------------------------------- */

// #movieCategoryが変更されたらYouTubeAPIを取得する
$(`#movieCategory`).on(`change`, event => {
    const value = $(event.target).val();
    operateMovie.selectMovie(value);
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
