
    if (document.body.classList.contains('koreanFoodPage')) {
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

    // 이벤트 리스너 추가
    listHover.addEventListener('mouseover', showMenu);
    menuList.addEventListener('mouseover', showMenu);

    listHover.addEventListener('mouseout', () => {
    setTimeout(() => {
    if (!menuList.matches(':hover') && !listHover.matches(':hover')) {
    hideMenu();
}
}, 300);
});

    menuList.addEventListener('mouseout', () => {
    setTimeout(() => {
    if (!menuList.matches(':hover') && !listHover.matches(':hover')) {
    hideMenu();
}
}, 300);
});

    // 페이지를 떠날 때 이벤트 리스너 제거
    window.addEventListener('beforeunload', () => {
    listHover.removeEventListener('mouseover', showMenu);
    menuList.removeEventListener('mouseover', showMenu);
    listHover.removeEventListener('mouseout', () => {});
    menuList.removeEventListener('mouseout', () => {});
});
}