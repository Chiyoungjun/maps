const menuList = document.getElementById('menuList');
const listHover = document.getElementById('listHover');

function showMenu() {
    menuList.style.left = '0';
    listHover.style.left = '300px';
}

function hideMenu() {
    menuList.style.left = '-300px';
    listHover.style.left = '0';
}

listHover.addEventListener('mouseover', showMenu);
menuList.addEventListener('mouseover', showMenu);

listHover.addEventListener('mouseout', () => {
    setTimeout(() => {
        if (!menuList.matches(':hover') && !listHover.matches(':hover')) {
            hideMenu();
        }
    }, );
});

menuList.addEventListener('mouseout', () => {
    setTimeout(() => {
        if (!menuList.matches(':hover') && !listHover.matches(':hover')) {
            hideMenu();
        }
    }, );
});
