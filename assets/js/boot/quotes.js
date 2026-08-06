window.SG = window.SG || {};

SG.bootQuotes=[

"Reject the dogma",

"Diversity is resilience.",

"Knowledge survives by sharing.",

"No archive is complete.",

"Freedom begins with a seed.",

"The archive is alive.",

"Seeds are memory made tangible.",

"Preserve diversity. Preserve tomorrow.",

"Every custodian strengthens the network.",

"No protocol survives without people."

];

SG.randomQuote=function(){

return SG.bootQuotes[

Math.floor(

Math.random()*SG.bootQuotes.length

)

];

};