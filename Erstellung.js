/*fs => Dateien schreiben können, readline-sync=> synchronen code schreiben können*/
const fs = require('fs');
const readline = require('readline-sync');

/*Hier ist der zweite Parameter der Funktion readline.question ein Objekt mit Wert true, das das Passwort verbirgt*/
const passwort = readline.question('Passwort der Lehrkraft: ', { hideEchoBack: true });
if (passwort !== 'sandra') {
    console.log('Zugriff verweigert.');
    process.exit();
}
console.log('\nZugriff erlaubt.\n');

/*weitere Abfrage - Fach soll immer in Großbuchstaben*/
const fach = readline.question('Fach: ').toUpperCase();
const hinweis = readline.question('Hinweis an die Klasse: ');

/*while-Schleifen*/ 
let fragen = []; /*fragen werden gepusht - später eingefügt (fragen.push*/
let frageNummer = 1; /*wird hochgezählt, wenn const mehr === ja*/

while (true) {
    console.log(`\n--- Neue Frage ${frageNummer} ---`);
    const frage = readline.question('Frage: ');
    const richtig = readline.question('Richtige Antwort: ');
    const falsch1 = readline.question('Falsche Antwort 1: ');
    const falsch2 = readline.question('Falsche Antwort 2: ');

    const antworten = [richtig, falsch1, falsch2].sort(() => Math.random() - 0.5); /*Antworten werden immer neu gemischt*/
    
    const punkte = readline.questionInt('Wie viele Punkte gibt diese Frage? '); /*readline.questionInt statt parseInt(readline.question()...))*/

    fragen.push({ frage, richtig, antworten, punkte }); /*richtig muss einmal seperat (und in der const Antworten) stehen, damit man das Richtige wieder erkennt*/

    const mehr = readline.question('Noch eine Frage erstellen? (ja/nein): ').toLowerCase();
    if (mehr !== 'ja') break;
    frageNummer++; /*bei nein - Abbruch, bei ja Frage +1 (++)*/
}


while (true) {
    console.log('\n--- Alle Fragen ---');

    fragen.forEach((frageObjekt, frageIndex) => {
        console.log(`\nFrage ${frageIndex + 1}: ${frageObjekt.frage}`); /*alle Fragen werden durchgesehen und als Objekt mit Indexnummer angezeigt*/

        frageObjekt.antworten.forEach((antwortText, antwortIndex) => {  
        console.log(`  ${antwortIndex + 1}. ${antwortText}`);           /*geht alle Antworten des jeweiligen Frageobjekts durch (so wie sie gemischt sind) und zeigt sie mit Indexnummer*/
    });

    console.log(`  -> Richtige Antwort: ${frageObjekt.richtig}`);
    console.log(`  -> Punkte: ${frageObjekt.punkte}`);    /*zeigt richtige Antwort und Punktzahl*/
});

   
    const aktion = readline.question('\nAktion : "bearbeiten", "entfernen", "weiter"\n> ').toLowerCase();

    if (aktion === 'weiter') break; /*hier fragt mein Programm, ob eine Frage bearbeitet oder entfernt werden soll, oder ob es weiter gehen,
                                     also als Klausur gespeichert werden soll. Eingabe wird immer in Kleinsbuchstaben gewandelt*/

    /*bei bearbeiten oder entfernen wird dann zunächt die Fragenummer abgefragt*/

    const index = readline.questionInt('Welche Frage (Nummer): ') - 1;  /*weil Indizies mit null anfangen, wird 1 minus 1 genommen*/
    if (index < 0 || index >= fragen.length) {
        console.log('❌ Ungültige Nummer.');  /*Falls die eingegebene Fragennummer ungültig ist,
                                             also kleiner als 0 oder größer/gleich der Anzahl der Fragen.
                                             (Array-Indizes starten bei 0, deshalb ist der höchste gültige Index: fragen.length - 1)*/
        continue;
    }

    if (aktion === 'entfernen') {
        fragen.splice(index, 1);
        console.log('✅ Frage entfernt. ✅'); /*bei entfernen wird mit splice im Arr ab dem Index (die Fragennummer) 1 Objekt (eine komplette Frage) gelöscht*/
    } else if (aktion === 'bearbeiten') {
        console.log('\n--- Neue Angaben für diese Frage ---');
        const neueFrage = readline.question('Frage: ');
        const neueRichtig = readline.question('Richtige Antwort: ');
        const neueFalsch1 = readline.question('Falsche Antwort 1: ');
        const neueFalsch2 = readline.question('Falsche Antwort 2: ');
        const neueAntworten = [neueRichtig, neueFalsch1, neueFalsch2].sort(() => Math.random() - 0.5);
        const neuePunkte = readline.questionInt('Neue Punktzahl: ');
                                            /*bei bearbeiten wird die Frage komplett neu abgefragt- es wird auch nochmal gemischt*/
        fragen[index] = {
            frage: neueFrage,
            richtig: neueRichtig,
            antworten: neueAntworten,
            punkte: neuePunkte  /*die neue Frage wird als Objekt im Arr erstellt*/
        };
        console.log('✅ Frage aktualisiert. ✅');
    } else {
        console.log('❌ Unbekannte Aktion.');
    }
}


const Klausur = { fach, hinweis, fragen };
fs.writeFileSync(`Klausur_${fach}.json`, JSON.stringify(Klausur, null, 2));
console.log(`\n✅ Klausur gespeichert als: Klausur_${fach}.json ✅`);
/*abschließend werden die Eingaben als Datei gespeichert - fswriteFileSync schreibt eine Textdatei, Json.stringify übersetzt alles dafür*/