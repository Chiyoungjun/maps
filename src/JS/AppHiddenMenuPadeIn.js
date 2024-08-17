const sideMenu = document.getElementById('appSide');
const sideClick = document.getElementById("appSideClick");
const hiddenMenu = document.getElementById('hiddenMenu');

function slideMenu() {
    if (hiddenMenu.className === 'sideIn'){
        sideMenu.style.right = '0';
        hiddenMenu.style.right = '20vw';
    }
    else{
        sideMenu.style.right = '-20vw';
        hiddenMenu.style.right = '0vw';
    }
}

sideClick.addEventListener('click', slideMenu);
