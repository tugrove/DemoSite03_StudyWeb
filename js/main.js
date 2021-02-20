$( () => {
    $(`#sideMenuButton`).on(`click`, () => {
        operateSideMenu.toggle();
    });
    $(`#sideMenu a`).on(`click`, () => {
        operateSideMenu.close();
    });
    $(`#sideMenu .globalNav .parent-ul .parent-li span`).on(`click`, event => {
        const tmp = event.currentTarget.classList.value;
        operateSideMenu.globalNav.toggleChildUl(tmp);
    });
});

const operateSideMenu = {

    toggle: function () {
        $(`#sideMenuButton`).toggleClass(`open`);
        $(`#sideMenu`).toggleClass(`open`);
        this.globalNav.closeChildUl();
    },

    close: function () {
        $(`#sideMenuButton`).removeClass(`open`);
        $(`#sideMenu`).removeClass(`open`);
        this.globalNav.closeChildUl();
    },

    globalNav: {

        toggleChildUl: function(cls) {
            $(`#sideMenu .globalNav .parent-ul .parent-li.${cls}`).toggleClass(`open`);
        },

        closeChildUl: function() {
            $(`#sideMenu .globalNav .parent-ul .parent-li`).removeClass(`open`);
        }

    }

};
