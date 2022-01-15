var pageApiPhotos = 1;

const postData = async (email, password) => {
    try {
        // let body = JSON.stringify({ email: email, password: password })
        // console.log("body : ", body);

        const response = await fetch('http://localhost:3000/api/login',
            {
                method: 'POST',
                body: JSON.stringify({ email: email, password: password })
            })

        // console.log(response.ok);
        const { token } = await response.json();
        localStorage.setItem('jwt-token', token);

        if (token) {
            return token
        } else {
            throw new Error("Credencial invalida");
        }
    } catch (err) {
        console.error(`${err}`);
        alert("Credenciales invalidas");
    }
}

const fillFeedCards = (posts) => {
    if (posts) {
        document.getElementById("idFormLogin").className = "col-md-6 d-none";
        posts.forEach(element => {
            document.getElementById('feed-of-cards').innerHTML += `
                <div class="card my-5">
                    <img src="${element.download_url}" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">Autor: ${element.author}</h5>
                    </div>
                </div>
            `;
        });
        document.getElementById("divFeedCards").className = "col-md-12 mt-3 d-block";
    } else {
        document.getElementById("idFormLogin").className = "col-md-6 d-block";
        document.getElementById("divFeedCards").className = "col-md-12 mt-3 d-none";
    }
}

const getImages = async (jwt) => {
    try {
        const response = await fetch(`http://localhost:3000/api/photos?page=${pageApiPhotos}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt} `
                }
            })
        const { data } = await response.json();

        if (data) {
            // console.log("data : ", data);
            fillFeedCards(data);
        } else {
            localStorage.clear();
        }
    } catch (err) {
        localStorage.clear();
        console.error("typeof : ", typeof err);
        console.error(`Error: ${err} `);
        // alert(`${err.name} sda  `)
    }
}

formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('input-email').value;
    const password = document.getElementById('input-password').value;

    const JWT = await postData(email, password);
    // console.log("JWT : ", JWT);

    if (JWT) {
        getImages(JWT);
    } else {
        //alert("Credenciales invalidas");
        // throw new Error("Credencial invalida");
    }
    formLogin.reset();
});

btnLogout.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

btnShowMore.addEventListener('click', () => {
    const token = localStorage.getItem('jwt-token');
    if (token) {
        pageApiPhotos++;
        getImages(token);
    }
});

// FUNCION INVOCADA AL INICIO
const init = async () => {
    const token = localStorage.getItem('jwt-token');
    // console.log("token inicial? : ", token);
    if (token) {
        getImages(token);
    }
}
init();