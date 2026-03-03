"use strict" ;

/*
# Exercise Basic-2: My Users' List
_Goal: basic handling of JavaScript strings_

Develop a small JS program to manage the list of users in a website.

- Define the names of users as a comma-separated list.
  - For instance: `"Luigi De Russis, Francesca Russo, Fulvio Corno, Luca Scibetta, Alberto Monge Roffarello"`.
- Parse the string and create an array containing one name per array position.
  - Beware: no extra spaces should be present.
- Create a second array by computing the acronyms of the people as the initial letters of the name. Acronyms should be in all-capital letters.
  - For example, `Luigi De Russis` -> `LDR`.
- Print the resulting list of acronyms and the full names.
  - Extra: in alphabetical order of acronym.
*/

// split the string into the indivudual names
const names = "Luigi De Russis, Francesca Russo, Fulvio Corno, Luca Scibetta, Alberto Monge Roffarello" ;
const list_names = names.split(',')

// remove extra spaces from beginning/end of each name
// const list_2 = []
// for( const name of list_names )
//   list_2.push(name.trim())


// create a list with acronyms
const acronyms = list_names.map( s => s.trim() )
  .map(  ( name => {
    return name.split(' ')
      .reduce((str, comp)=>(str+comp[0]), "")
      .toUpperCase()
}))

// console.log(acronyms)   // example: ['LDR', 'FR', 'FC', 'LS', 'AMR']

// sort by alpha order of acronym
acronyms.sort()

// finally, join the acronyms together as a string

const output = acronyms.join(', ')

console.log(output)