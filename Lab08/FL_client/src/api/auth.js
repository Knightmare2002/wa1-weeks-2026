const SERVER_URL = 'http://localhost:3001'

async function doLogin(email, password){
    const response = await fetch(`${SERVER_URL}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({email, password})
    })

    if(response.ok){
        return await response.json()
    } 
    throw new Error('Login Fallito')
}

async function doLogout(){
    const response = await fetch(`${SERVER_URL}/api/sessions/current`, {
        method: 'DELETE',
        credentials: 'include',
    })

    if(!response.ok){
        throw new Error('Logout fallito')
    }
}

async function checkSession(){
    const response = await fetch(`${SERVER_URL}/api/sessions/current`, {
        credentials: 'include'
    })

    if(response.ok){
        return await response.json()
    }
    return null
}

export {doLogin, doLogout, checkSession}