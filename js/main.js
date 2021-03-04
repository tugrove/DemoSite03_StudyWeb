/* 変数定義 ************************************/

// 定数
const OPEN = `open`;
const ERROR = `error`;

/* オブジェクト定義 *****************************/

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
            elem.classList.toggle(OPEN);
        },

        closeAllChildUl: function() {
            $(`#sideMenu .globalNav .parent-ul .parent-li`).removeClass(OPEN);
        }
    }
};

// form関連
const operateForm = {

    addError: function(elem) {
        elem.addClass(ERROR);
    }
};


/* HTMLの読み込み後の処理 ***********************/
$( () => {
    // サイドメニューボタンを押した際の処理
    $(`#sideMenuButton`).on(`click`, () => {
        operateSideMenu.toggle();
    });
    // サイドメニュー内のリンクを踏んだ際にサイドメニューを閉じる処理
    $(`#sideMenu a`).on(`click`, () => {
        operateSideMenu.close();
    });
    // サイドメニュー内のアコーディオンメニューを開閉する処理
    $(`#sideMenu .globalNav .parent-ul .parent-li`).on(`click keydown`, `span`, event => {
        const parent = event.delegateTarget;
        const keyCode = event.keyCode;
        if (!keyCode || keyCode === 13) {
            operateSideMenu.globalNav.toggleChildUl(parent);
        }
    });
    /* contactページのform関連 **********************/
    // 送信ボタン
    $(`.page-contact #pageMain form #submitButton`).on(`click`, event => {
        const parent = $(event.target).parent();
        operateForm.addError(parent);
        operateScroll.goToTop(parent);
    });
});
