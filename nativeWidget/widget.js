let button = document.createElement('button');
let container = document.getElementById("sappfir-button");
button.innerHTML = 'Пройти тест';
button.onclick = function(){
    const id = container.getAttribute('data-id');
    const popup = document.createElement('div');
    popup.setAttribute("id", "popup");
    popup.style.cssText = `position:fixed;
        width:100vw;
        height:100vh;
        top:50%;
        left:50%;
        transform:translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
    `

    const popupMask = document.createElement('div');
    popupMask.style.cssText = `position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.2);
        z-index: -1;
    `

    popup.appendChild(popupMask);

    const popupContent = document.createElement('div');
    popupContent.style.cssText = `width: min(50rem, 90%);
        height: 95%;
        min-height: 95%;
        position: relative;
    `

    popup.appendChild(popupContent);

    const popupClose = document.createElement('div');
    popupClose.innerHTML = '&#10010;';
    popupClose.style.cssText = `position:absolute;
        width:30px;
        height:30px;
        top:-15px;
        right: -15px;
        border-radius: 50%;
        background: #fff;
        text-decoration: none;
        text-align: center;
        transform: rotate(45deg);
        line-height: 1.9;
        cursor: pointer;
    `
    popupClose.onclick = function(){
        popup.remove();
    }

    popupContent.appendChild(popupClose);

    let iframe = document.createElement('iframe');
    iframe.src = `http://localhost:5174?key=${id}`;
    iframe.style.cssText = `width: 100%; height: 100%;  border: none; border-radius: 10px;`;

    popupContent.appendChild(iframe);

    document.body.appendChild(popup);
};


container.appendChild(button);
