document.addEventListener('DOMContentLoaded', (event) => {
    const singlePlayerButton = document.getElementById('singleplayer-btn');
    const multiPlayerButton = document.getElementById('multiplayer-btn');
    const singlePlayerView = document.getElementById('singleplayer-view');
    //const multiPlayerView = document.getElementById('multiplayer-view');    

    if (!singlePlayerButton || !multiPlayerButton || !singlePlayerView) {
        console.error('One or more elements are missing');
        return;
    }

    singlePlayerButton.addEventListener('click', () => {
        console.log('Single Player Button Clicked');
        singlePlayerView.style.display = 'block';
        //multiPlayerView.style.display = 'none';
        multiPlayerButton.classList.add('passive-mode');
        singlePlayerButton.classList.remove('passive-mode');
    });

    multiPlayerButton.addEventListener('click', () => {
        console.log('Multi Player Button Clicked');
        singlePlayerView.style.display = 'none';
        //multiPlayerView.style.display = 'block';
        multiPlayerButton.classList.remove('passive-mode');
        singlePlayerButton.classList.add('passive-mode');
    });
});