const fs = require('fs');
const readline = require('readline-sync');
/*wieder mit passwortabfrage */
const passwort = readline.question('Passwort der Lehrkraft: ', { hideEchoBack: true });
if (passwort !== 'sandra') {
    console.log('Zugriff verweigert.');
    process.exit();
}
console.log('\nZugriff erlaubt.\n');

/*Alle Ergebnisdateien im aktuellen Ordner auslesen, die mit "Ergebnis_" beginnen und auf ".json" enden) */
const dateien = fs.readdirSync('.').filter(f => f.startsWith('Ergebnis_') && f.endsWith('.json'));

let schuelerErgebnisse = {};/*Objekt wird später gefüllt */ 

dateien.forEach(datei => {  /*alle Daten werden verarbeitet */
    
        const daten = JSON.parse(fs.readFileSync(datei, 'utf-8')); /*die const daten wird wieder "entstringt" */

        
        if (!daten.name || !daten.fach || daten.note === undefined) {
            console.warn(`⚠️ Datei ${datei} enthält unvollständige Daten und wird übersprungen.`); /*das wird geprüft, sollte nicht sein */
            return;
        }

        if (!schuelerErgebnisse[daten.name]) {
            schuelerErgebnisse[daten.name] = {
                klasse: daten.klasse || 'unbekannt',
                fächer: {}
            };
        }
/*Ergebnisse je Fach für den Schüler */
    schuelerErgebnisse[daten.name].fächer[daten.fach] = {
    datum: daten.datum,
    erreichtePunkte: daten.erreichtePunkte,
    gesamtPunkte: daten.gesamtPunkte,
    prozent: daten.prozent,
    note: daten.note
};

});
/*Ausgabe Klausurergebnisse pro Schüler und Fach  */
console.log('\n--- Auswertung aller Klausuren ---');
for (const [name, info] of Object.entries(schuelerErgebnisse)) {
    console.log(`\n ${name} (Klasse ${info.klasse}):`);
    for (const [fach, daten] of Object.entries(info.fächer)) {
      const punkte = `${daten.erreichtePunkte}/${daten.gesamtPunkte}`;
console.log(`  - ${fach} (${daten.datum}): ${punkte} Punkte, ${daten.prozent}%, Note ${daten.note}`);
      
    }
}

/*Ausgabe Fachstatistik*/
let fachStatistik = {};

/*Noten aus allen Schülerdaten sammeln und statistische Werte berechnen */
for (const info of Object.values(schuelerErgebnisse)) {
    for (const [fach, daten] of Object.entries(info.fächer)) {
        if (typeof daten.note !== 'number') continue;
/*Neues Fach in Statistik anlegen*/
        if (!fachStatistik[fach]) {
            fachStatistik[fach] = { anzahl: 0, gesamtNote: 0, beste: 6, schlechteste: 1 };
        }
/*Noten und Anzahl addieren sowie beste und schlechteste Note aktualisieren */
        fachStatistik[fach].anzahl++;
        fachStatistik[fach].gesamtNote += daten.note;
        fachStatistik[fach].beste = Math.min(fachStatistik[fach].beste, daten.note);
        fachStatistik[fach].schlechteste = Math.max(fachStatistik[fach].schlechteste, daten.note);
    }
}

console.log('\n--- Noten-Statistik pro Fach ---'); 
for (const [fach, stats] of Object.entries(fachStatistik)) { /*Object.entries gibt ein Arr mit Fach/Note aus */
    const durchschnitt = (stats.gesamtNote / stats.anzahl).toFixed(2);
    console.log(`\n ${fach}:`);
    console.log(`  - Anzahl Klausuren: ${stats.anzahl}`);
    console.log(`  - Durchschnittsnote: ${durchschnitt}`);
    console.log(`  - Beste Note: ${stats.beste}`);
    console.log(`  - Schlechteste Note: ${stats.schlechteste}`);
}
