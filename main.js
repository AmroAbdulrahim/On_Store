
function toggoleLoader(show = true){
    if(show){
        document.getElementById("loader").style.visibility = "visible"
        document.getElementById("contact").style.margin = "100%"
    }else{
        document.getElementById("loader").style.visibility = "hidden"
        document.getElementById("contact").style.margin = "200px 0 0 0"
        
    }
}

function navBut(){
    let navBut = document.getElementById("box")
    // if(navBut.style.marginTop = "10px"){
    //     navBut.style.marginTop = "120px"
    // }else if(navBut.style.marginTop = "120px"){
    //     navBut.style.marginTop = "10px"
    // }
    
}

let regBtn = document.getElementById("reg-btn")

regBtn.onclick = () => {
    let username = document.getElementById("reg-username").value
    let email = document.getElementById("reg-email").value
    let phoneNumber = document.getElementById("reg-number").value
    let address = document.getElementById("reg-address").value

    const formData = {
        username,
        email,
        phoneNumber,
        address
    };

    localStorage.setItem("user", JSON.stringify(formData))

    document.getElementById("registerForm").submit()
}

let loginBtn = document.getElementById("log-btn")

loginBtn.onclick = () => {
    
    let email = document.getElementById("email-input").value
    
    fetch("http://localhost:8000/users")
    .then(response => {
        return response.json()
    }).then(data => {
        for(user of data){
            if(user.email === email){
                console.log(user)
                let username = user.username
                let email = user.email
                let phoneNumber = user.phoneNumber
                let address = user.address
                
                const formData = {
                    username,
                    email,
                    phoneNumber,
                    address
                };
                
                localStorage.setItem("user", JSON.stringify(formData))
                setupUI()
                document.getElementById("loginForm").submit()
            }
        }
    })

}

function logout(){
    localStorage.removeItem("user")
    setupUI()
}

function getCurrentUser(){
    let user = null
    const storageUser = localStorage.getItem("user")
    if(storageUser != null){
        user = JSON.parse(storageUser)
    }
    return user
}

function setupUI(){
    const user = localStorage.getItem("user")
    // const user = JSON.parse(localStorage.getItem("user")) || []

    const loginDiv = document.getElementById("login-div")
    const logoutDiv = document.getElementById("logout-div")

    
    if(user == null){
        loginDiv.style.setProperty("display", "flex", "important")
        logoutDiv.style.setProperty("display", "none", "important")
        
    }else{
        loginDiv.style.setProperty("display", "none", "important")
        logoutDiv.style.setProperty("display", "flex", "important")
        
        const user = getCurrentUser()
        document.getElementById("nav-username").innerHTML = user.username
    }

}
setupUI()

function sections(){
    let section = document.getElementById("section").value
    console.log(section)
    if(section === "المفضلة"){
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        if (favorites.length === 0) {

            return;
        }
        document.getElementById("content").innerHTML = ""
        favorites.forEach(id => {
            fetch(`http://localhost:8000/data/${id.id}`)
            .then(res => res.json())
            .then(item => {
                
                let content = `
                <div id="items" onclick="showDetalls('${item._id}')">
                    <img src="${item.image}" alt="">
                    <h1>${item.name}</h1>
                    <p>${item.detalls}</p>
                    <h2>${item.pric}</h2>
                    <svg style="position: relative; left: 70px; top: 20px;" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
                        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
                    </svg>
                </div>
                `
                document.getElementById("content").innerHTML += content
            })
        })
    }else{
        fetch("http://localhost:8000/data")
        .then(response => {
            return response.json()
        }).then(data => {
            
            document.getElementById("content").innerHTML = ""
            
            for(item of data){
                if(item.section === section){
                    
                    let content = `
                    <div id="items" onclick="showDetalls('${item._id}')">
                        <img src="${item.image}" alt="">
                        <h1>${item.name}</h1>
                        <p style="width: 230px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.detalls}</p>
                        <h2>${item.pric}</h2>
                        
                    </div>
                    `
                    document.getElementById("content").innerHTML += content
                    console.log(item._id)

                }else{
                
                    console.log("0")
                }
            }
            console.log(data)
        })

    }
}

function showDetalls(itemId){
    window.location = `Item-Detalls.html?itemId=${itemId}`
    
}

function getContent(){
    toggoleLoader(true)
    fetch("http://localhost:8000/data")
    .then(response => {
        return response.json()
    }).then(data => {
        toggoleLoader(false)
        document.getElementById("content").innerHTML = ""
        
        for(item of data){
            let content = `
            <div id="items" onclick="showDetalls('${item._id}')">
                <img src="${item.image}" alt="">
                <h1>${item.name}</h1>
                <p style="width: 230px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.detalls}</p>
                <h2>${item.pric}</h2>
                
            </div>
            `
            // <svg onclick="star()" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
            //         <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
            //     </svg>
            document.getElementById("content").innerHTML += content
            // console.log(item._id)
        }
        // console.log(data)
    })
}
getContent()

function star(){
    console.log("star")
}

function getTheContent(){

    let sitem = document.getElementById("searchInput").value

    fetch("http://localhost:8000/data")
    .then(response => {
        return response.json()
    }).then(data => {
        
        document.getElementById("content").innerHTML = ""
        
        for(item of data){
            if(item.name === sitem){
                
                let content = `
                <div id="items" onclick="showDetalls('${item._id}')">
                    <img src="${item.image}" alt="">
                    <h1>${item.name}</h1>
                    <p>${item.detalls}</p>
                    <h2>${item.pric}</h2>
                    <svg style="position: relative; left: 70px; top: 20px;" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
                        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
                    </svg>
                </div>
                `
                document.getElementById("content").innerHTML += content
                console.log(item._id)

            }
            
            
        }
        console.log("0")
        theAlert("is not defind", "warning")
        console.log(data)
    })

    // console.log(item)
    // theAlert("is not defind", "warning")
    // alert("Is Not Defind")
    // let query = document.getElementById("searchInput").value.toLowerCase()

    // fetch("http://localhost:8000/data")
    // .then(response => {
    //     return response.json()
    // }).then(data => {

    //     let filteredData = data.filter(item => item.name.includes(query))

    //     document.getElementById("content").innerHTML = ""
        
    //     for(item of filteredData){
    //         let content = `
    //         <div id="items" onclick="showDetalls('${item._id}')">
    //             <img src="${item.image}" alt="">
    //             <h1>${item.name}</h1>
    //             <p>${item.detalls}</p>
    //             <h2>${item.pric}</h2>
    //         </div>
    //         `
    //         document.getElementById("content").innerHTML += content
    //         console.log(item._id)
    //     }
            
    //     console.log(data)
    // })
}

function favorite(itemId){
    console.log(itemId)

}

function theAlert(massage, type="success"){
        
    let dv =`
    <div class="alert alert-${type} role="alert" style="width: 300px; display: flex; justify-content: right;">
        <div>${massage}</div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" style="margin-left: 20px;"></button>
    </div>`
   document.getElementById("alert").innerHTML += dv
}