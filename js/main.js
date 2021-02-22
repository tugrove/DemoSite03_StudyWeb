$( () => {
    $(`#sideMenuButton`).on(`click`, () => {
        operateSideMenu.toggle();
    });
    $(`#sideMenu a`).on(`click`, () => {
        operateSideMenu.close();
    });
    $(`#sideMenu .globalNav .parent-ul .parent-li span`).on(`click`, event => {
        const parent = event.currentTarget.parentElement;
        operateSideMenu.globalNav.toggleChildUl(parent);
    });
});

const operateSideMenu = {

    open: function() {
        $(`#sideMenuButton`).addClass(`open`);
        $(`#sideMenu`).addClass(`open`);
        this.globalNav.closeChildUl();
    },

    close: function() {
        $(`#sideMenuButton`).removeClass(`open`);
        $(`#sideMenu`).removeClass(`open`);
    },

    toggle: function() {
        const getClass = $(`#sideMenuButton`).attr(`class`);
        if (getClass === `open`) {
            this.close();
        } else {
            this.open();
        }
    },

    globalNav: {

        toggleChildUl: function(elem) {
            elem.classList.toggle(`open`);
        },

        closeChildUl: function() {
            $(`#sideMenu .globalNav .parent-ul .parent-li`).removeClass(`open`);
        }

    }

};
