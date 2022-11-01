async function check(){
    const req = await fetch(`http://localhost:81/api/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    let data = await req.json();

    if (data){
        var iframe = document.createElement("iframe");
        iframe.src = "http://localhost:5174/";
        iframe.style.cssText = "display: block; border: none; height: 100vh; width: 100%;";
        document.getElementById("widget").appendChild(iframe);
    }
}

check();