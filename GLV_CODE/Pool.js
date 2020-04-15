/**
 * Oggetto Pool.
 *
 * @author: Riccardo Rossi <red.riccardo.91@gmail.com>
 * @this {Pool}
 * @param {string} textNome - Nome del pool.
 * @param {string} textDescrizione - Descrizione del pool.
 * @param {int} textNumero - Numero di macchine virtuali del pool.
 */
function Pool(textNome, textDescrizione, textNumero) {
/** @private */ this.textNome = textNome;
/** @private */ this.textDescrizione = textDescrizione;
/** @private */ this.textNumero = textNumero;
}