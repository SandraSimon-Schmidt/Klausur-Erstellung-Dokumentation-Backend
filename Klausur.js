/*fs => Dateien schreiben können, readline-sync=> synchronen code schreiben können*/
const fs = require('fs'); 
const readline = require('readline-sync');
/*Abfrage - Fach soll immer in Großbuchstaben*/
const fach = readline.question('Zu welchem Fach soll die Klausur sein? ').toUpperCase();
const datei = `Klausur_${fach}.json`; /* die von Erstellung.js erstellte jsondatei */

if (!fs.existsSync(datei)) {
    console.log('Keine Klausur im Fach vorhanden.');
    process.exit(); /*statt return*/
}

const Klausur = JSON.parse(fs.readFileSync(datei)); /*von String zu Objekt - const datei s.o.*/

let name = '';
let klasse = '';
let datum = '';   /*leere Variabeln, werden mit Schleifen abgefragt */

while (!name) name = readline.question('Name: ');
while (!klasse) klasse = readline.question('Klassenstufe: ');
while (!datum) datum = readline.question('Datum: ');

console.log(`\n${Klausur.hinweis}\n`); /*const Klausur = fach, hinweis, fragen, Objekt aus Datei Erstellung.js */

let gesamtPunkte = 0;     /*Start-Punkte, nach Prüfung der Fragen werden deren Punkte zur 0 zuaddieret */
let erreichtePunkte = 0;

let antworten = []; /* das wird von unten gefüllt mit push */

Klausur.fragen.forEach((frageObjekt, index) => {
    console.log(`\nFrage ${index + 1}: ${frageObjekt.frage}`);
    frageObjekt.antworten.forEach((antwort, i) => {
        console.log(`  ${i + 1}. ${antwort}`);
    });  /*Klausur.fragen ist ein Array von Fragen (jeweils ein Objekt). forEach führt alle aus */

    let wahl;
    while (true) {
        wahl = readline.questionInt('Deine Wahl (1-3): ');
        if (wahl >= 1 && wahl <= 3) break;
        console.log('Bitte nur 1, 2 oder 3 eingeben.');
    }

    antworten.push(frageObjekt.antworten[wahl - 1]); /* Arr Antwort wird gefüllt*/
    gesamtPunkte += frageObjekt.punkte;

    if (frageObjekt.antworten[wahl - 1] === frageObjekt.richtig) {
        erreichtePunkte += frageObjekt.punkte; /*Punkte werden zu Startpunkten addiert*/
    }
});

const prozent = ((erreichtePunkte / gesamtPunkte) * 100).toFixed(2); /*errechnen der %, auf 2 dez. gerundet */
let note;
/*notenskala*/
if (prozent >= 92) note = 1;
else if (prozent >= 82) note = 2;
else if (prozent >= 67) note = 3;
else if (prozent >= 50) note = 4;
else if (prozent >= 26) note = 5;
else note = 6;

/*Objekt mit allen wichtigen Daten - wird unten als Json datei gespeichert*/
const ergebnis = {
    name,
    klasse,
    datum,
    fach,
    erreichtePunkte,
    gesamtPunkte,
    prozent: parseFloat(prozent), /*toFixed() ist eine Zeichenkette/ein String. parsefloat ändert den wieder zu einer Zahl*/
    note
};

fs.writeFileSync(`Ergebnis_${name}_${fach.toUpperCase()}.json`, JSON.stringify(ergebnis, null, 2));

console.log(`\nDu hast ${erreichtePunkte}/${gesamtPunkte} Punkten erreicht (${prozent}%). Deine Note: ${note}`);

/* die erstellte json  --> const ergebnis <-- wird für die Datei Ergebnis.js verwendet */