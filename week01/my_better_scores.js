"use strict"

const scores = [3, -2, 10, 0, -5, -8, 7, 4, -1, 9, 6]
console.log('Scores Array: ', scores)

const scores_copy = [...scores]
let NN = 0
console.log('Copied Scores Array: ', scores_copy)

const positive_scores = []
for (const elem of scores_copy){
    if(elem >= 0){
        positive_scores.push(elem)
    }
    else{
        NN++
    }
}
console.log("positive Array: ", positive_scores)
console.log("NN: ", NN)

positive_scores.sort((a,b) => a - b).reverse()
console.log("Sorted Array: ", positive_scores)

for(let i = 0; i < 2; i++){
    positive_scores.pop()
}
console.log("Deleted Two Lowest Scores", positive_scores.reverse())

const sum = positive_scores.reduce((a, b) => a + b)
console.log("Sum of Element in Copied Array: ", sum)

const avg = Math.round(sum / positive_scores.length)

for (var i = 0; i < NN + 2; i++){
    positive_scores.push(avg)
}
console.log("Extended Copy Array: ", positive_scores)
