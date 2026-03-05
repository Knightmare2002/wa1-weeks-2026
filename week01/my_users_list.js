"use strict"

function getAcronym(fullName){
    return fullName.split(' ').map(a => a.charAt(0)).join('')
}

const users = "Luigi De Russis, Francesca Russo, Fulvio Corno, Luca Scibetta, Enrico Masala, Antonio Servetti"
console.log("Users: ", users)

const users_list = users.split(',')
console.log('Users List: ', users_list)

const trimmed_users_list = users_list.map(user => user.trim())
console.log('Users List: ', trimmed_users_list)

const acroyms_list = []
for (const user of trimmed_users_list){
    const acronym = getAcronym(user)
    acroyms_list.push(acronym)
}
console.log("Acrhonyms List: ", acroyms_list.sort())
console.log("User List Sorted by Achronyms: ", trimmed_users_list.sort((a,b) => {
    const acronym1 = getAcronym(a)
    const acronym2 = getAcronym(b)

    return acronym1.localeCompare(acronym2);
}))
