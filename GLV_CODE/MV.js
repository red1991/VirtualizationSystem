/**
 * Oggetto Macchina Virtuale.
 *
 * @author: Riccardo Rossi <red.riccardo.91@gmail.com>
 * @this {MV}
 * @param {string} nome - Nome della macchina virtuale.
 * @param {string} descrizione - Descrizione della macchina virtuale.
 * @param {int} dimensioneRam - Dimensione della memoria RAM.
 * @param {string} nomeHost - Hostname della macchina virtuale.
 * @param {boolean} checkedCB - Checkbox CodeBlocks.
 * @param {boolean} checkedLO - Checkbox LibreOffice.
 */
function MV(nome, descrizione, dimensioneRam, nomeHost, checkedCB, checkedLO) {
/** @private */ this.nome = nome;
/** @private */ this.descrizione = descrizione;
/** @private */ this.dimensioneRam = dimensioneRam;
/** @private */ this.nomeHost = nomeHost;
/** @private */ this.checkedCB = checkedCB;
/** @private */ this.checkedLO = checkedLO;
}