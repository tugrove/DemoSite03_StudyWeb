$( () => {
    $(`#sideMenuButton`).on(`click`, event => {
        const tmp = event.currentTarget.classList.value;
        if (tmp === `open`) {
            operateSideMenu.close();
        } else {
            operateSideMenu.open();
        }
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

    open: function () {
        $(`#sideMenuButton`).addClass(`open`);
        $(`#sideMenu`).addClass(`open`);
        this.globalNav.closeChildUl();
    },

    close: function () {
        $(`#sideMenuButton`).removeClass(`open`);
        $(`#sideMenu`).removeClass(`open`);
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
