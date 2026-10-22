---
layout: application
title: Lotti e germinazione
permalink: /lotti-seme/
---

<div class="seed-lots-page" id="seed-lots-app">
  <header class="seed-lots-header">
    <p class="seed-lots-kicker">SOIL GENESIS // SEED BANK OPERATIONS</p>
    <h1>LOTTI / GERMINAZIONE</h1>
    <p>Registra provenienza, quantità, conservazione e prove di germinazione per ogni lotto fisico. I dati inseriti qui restano locali finché non esporti un backup o un pacchetto da versionare.</p>
  </header>

  <div class="seed-lots-notice" role="note"><strong>IMPORTANTE</strong> · Una prova di germinazione descrive il campione testato, nelle condizioni registrate. Non garantisce da sola la vitalità dell'intero lotto né la qualità genetica dei semi.</div>

  <section class="seed-lots-summary" aria-label="Riepilogo lotti">
    <article><span>LOTTI REGISTRATI</span><strong id="lots-total">0</strong></article>
    <article><span>CON PROVE</span><strong id="lots-tested">0</strong></article>
    <article><span>PROVE REGISTRATE</span><strong id="lots-tests-total">0</strong></article>
  </section>

  <section class="seed-lots-panel" aria-labelledby="lot-form-title">
    <div class="seed-lots-heading"><span>01</span><div><h2 id="lot-form-title">NUOVO LOTTO</h2><p>Un lotto identifica una raccolta o acquisizione concreta, non soltanto una varietà.</p></div></div>
    <form id="seed-lot-form" class="seed-lots-form">
      <label class="seed-lots-wide"><span>Dossier varietà *</span>
        <select id="lot-seed" required><option value="">Seleziona una varietà</option>
          {% assign lot_seeds = site.seeds | sort_natural: "nome_comune" %}
          {% for plant in lot_seeds %}<option value="{{ plant.slug | escape }}" data-scientific="{{ plant.nome_scientifico | default: plant.scientific_name | escape }}" data-id="{{ plant.sg_id | default: plant.id | default: plant.slug | escape }}">{{ plant.nome_comune | default: plant.title | escape }}{% if plant.nome_scientifico %} — {{ plant.nome_scientifico | escape }}{% endif %}</option>{% endfor %}
        </select>
      </label>
      <label><span>Data acquisizione / raccolta *</span><input id="lot-date" type="date" required></label>
      <label><span>Origine *</span><select id="lot-origin" required><option value="">Seleziona</option><option>Raccolta propria</option><option>Scambio</option><option>Acquisto</option><option>Dono</option><option>Archivio preesistente</option><option>Origine da verificare</option></select></label>
      <label><span>Quantità iniziale</span><input id="lot-quantity" type="number" min="0" step="1" placeholder="Numero di semi"></label>
      <label><span>Unità quantità</span><select id="lot-unit"><option value="semi">semi</option><option value="g">grammi</option><option value="ml">ml</option><option value="altro">altro / non specificato</option></select></label>
      <label><span>Luogo di conservazione</span><input id="lot-storage" type="text" maxlength="160" placeholder="Es. contenitore S-03, armadio fresco"></label>
      <label><span>Stato del lotto</span><select id="lot-status"><option value="disponibile">Disponibile</option><option value="in-prova">In prova</option><option value="da-verificare">Da verificare</option><option value="esaurito">Esaurito</option><option value="perso">Perso / non reperibile</option></select></label>
      <label class="seed-lots-wide"><span>Provenienza dettagliata / note</span><textarea id="lot-notes" rows="3" maxlength="3000" placeholder="Donatore, luogo e anno della raccolta, trattamento, contenitore, dubbi di identità…"></textarea></label>
      <div class="seed-lots-actions seed-lots-wide"><button type="submit" class="seed-lots-primary">REGISTRA LOTTO</button><span id="lot-feedback" aria-live="polite"></span></div>
    </form>
  </section>

  <section class="seed-lots-panel" aria-labelledby="test-form-title">
    <div class="seed-lots-heading"><span>02</span><div><h2 id="test-form-title">PROVA DI GERMINAZIONE</h2><p>Registra il campione, il risultato osservato e le condizioni del test.</p></div></div>
    <form id="germination-form" class="seed-lots-form">
      <label class="seed-lots-wide"><span>Lotto *</span><select id="test-lot" required><option value="">Prima registra o seleziona un lotto</option></select></label>
      <label><span>Data avvio *</span><input id="test-date" type="date" required></label>
      <label><span>Semi testati *</span><input id="test-sown" type="number" min="1" step="1" required></label>
      <label><span>Semi germinati *</span><input id="test-germinated" type="number" min="0" step="1" required></label>
      <label><span>Durata osservazione (giorni)</span><input id="test-days" type="number" min="0" step="1" placeholder="Es. 14"></label>
      <label><span>Temperatura (°C)</span><input id="test-temperature" type="number" step="0.5" placeholder="Media o impostata"></label>
      <label><span>Metodo</span><select id="test-method"><option value="carta umida">Carta umida</option><option value="substrato">Substrato</option><option value="terriccio">Terriccio</option><option value="altro">Altro</option></select></label>
      <label class="seed-lots-wide"><span>Condizioni, anomalie e note</span><textarea id="test-notes" rows="2" maxlength="2000" placeholder="Luce, umidità, muffe, criteri di conteggio, semi duri o anomali…"></textarea></label>
      <div class="seed-lots-actions seed-lots-wide"><button type="submit" class="seed-lots-primary">AGGIUNGI PROVA</button><span id="test-feedback" aria-live="polite"></span></div>
      <p class="seed-lots-help seed-lots-wide">Percentuale calcolata = semi germinati / semi testati × 100. È una misura del campione, non una stima certificata del lotto. Non confrontare prove eseguite con protocolli molto diversi senza annotarlo.</p>
    </form>
  </section>

  <section class="seed-lots-panel" aria-labelledby="backup-lots-title">
    <div class="seed-lots-heading"><span>03</span><div><h2 id="backup-lots-title">BACKUP / ESPORTAZIONE</h2><p>Conserva i dati fuori da questo browser e prepara file da versionare nel repository.</p></div></div>
    <div class="seed-lots-actions">
      <button type="button" id="lots-export-json" class="seed-lots-secondary">ESPORTA BACKUP JSON</button>
      <button type="button" id="lots-import-trigger" class="seed-lots-secondary">IMPORTA BACKUP JSON</button>
      <input id="lots-import-file" type="file" accept=".json,application/json" hidden>
      <button type="button" id="lots-export-package" class="seed-lots-primary">PREPARA PACCHETTO YAML + MARKDOWN</button>
    </div>
    <p id="lots-backup-feedback" class="seed-lots-feedback" aria-live="polite"></p>
    <p class="seed-lots-help">L'esportazione non pubblica nulla su GitHub. Controlla i file generati prima di aggiungerli al repository. Gli identificativi dei lotti vengono mantenuti durante il backup e l'importazione.</p>
  </section>

  <section class="seed-lots-panel" aria-labelledby="published-lots-title">
    <div class="seed-lots-heading"><span>PUB</span><div><h2 id="published-lots-title">LOTTI PUBBLICATI</h2><p>Lotti versionati nel repository in <code>_data/seed-lots.yml</code>. Questa sezione diventa pubblica dopo commit e deploy.</p></div></div>
    {% assign published_lots = site.data['seed-lots'].lots %}
    {% if published_lots and published_lots.size > 0 %}
      <div class="seed-lots-list">
      {% for lot in published_lots %}
        <article class="seed-lot-card">
          <header><div><h3>{% if lot.seed_slug %}<a href="{{ '/sementi/' | append: lot.seed_slug | append: '/' | relative_url }}">{{ lot.seed_name | default: lot.seed_slug | escape }}</a>{% else %}{{ lot.seed_name | default: 'Varietà non collegata' | escape }}{% endif %}</h3><p class="seed-lot-scientific"><em>{{ lot.scientific_name | escape }}</em></p></div><span class="seed-lot-id">{{ lot.id | escape }}</span></header>
          <div class="seed-lot-meta"><div><strong>Acquisizione / raccolta</strong><span>{{ lot.acquisition_date | escape }}</span></div><div><strong>Origine</strong><span>{{ lot.origin | escape }}</span></div><div><strong>Quantità</strong><span>{% if lot.quantity %}{{ lot.quantity }} {{ lot.quantity_unit | escape }}{% else %}Non registrata{% endif %}</span></div><div><strong>Stato</strong><span>{{ lot.status | escape }}</span></div><div><strong>Conservazione</strong><span>{{ lot.storage | default: 'Non registrata' | escape }}</span></div></div>
          {% if lot.notes %}<p>{{ lot.notes | escape }}</p>{% endif %}
          <div class="seed-lot-tests"><h4>Prove pubblicate ({{ lot.germination_tests.size | default: 0 }})</h4>
          {% for test in lot.germination_tests %}<div class="seed-lot-test"><p><strong>{{ test.date | escape }}</strong> · {{ test.seeds_germinated }} / {{ test.seeds_tested }} germinati · <strong>{{ test.germination_percent }}%</strong></p><p>Metodo: {{ test.method | escape }} · Durata: {{ test.observation_days | default: 'non registrata' }} giorni · Temperatura: {{ test.temperature_c | default: 'non registrata' }} °C</p>{% if test.notes %}<p>{{ test.notes | escape }}</p>{% endif %}</div>{% else %}<p class="seed-lots-help">Nessuna prova pubblicata.</p>{% endfor %}
          </div>
        </article>
      {% endfor %}
      </div>
    {% else %}<p class="seed-lots-empty">Nessun lotto pubblicato. I dati locali non sono visibili agli altri visitatori finché non vengono esportati e versionati nel repository.</p>{% endif %}
  </section>

  <section class="seed-lots-panel" aria-labelledby="lots-list-title">
    <div class="seed-lots-heading"><span>04</span><div><h2 id="lots-list-title">ARCHIVIO LOTTI</h2><p>Ricerca, verifica prove e gestione dei lotti registrati in questo browser.</p></div></div>
    <label class="seed-lots-search"><span>Cerca lotto, varietà, origine o note</span><input id="lots-search" type="search" placeholder="Es. SGLOT-2026, cece, scambio…"></label>
    <div id="lots-list" class="seed-lots-list"><p class="seed-lots-empty">Nessun lotto locale registrato.</p></div>
    <p id="lots-empty-filter" class="seed-lots-empty" hidden>Nessun lotto corrisponde alla ricerca.</p>
  </section>

  <details class="seed-lots-method"><summary>Metodo e limiti dei dati</summary><ul>
    <li>Conserva separati l'identificativo della varietà e quello del lotto fisico: la stessa varietà può avere raccolte e condizioni di conservazione diverse.</li>
    <li>Registra quantità e unità coerenti; non convertire grammi in numero di semi senza una misura verificata.</li>
    <li>La percentuale di germinazione descrive soltanto i semi conteggiati nella prova. Dimensione del campione, dormienza, temperatura, umidità e durata influenzano il risultato.</li>
    <li>La registrazione locale non è un backup finché non esporti i dati. Conserva copie versionate fuori dal browser.</li>
  </ul></details>
</div>
<script src="{{ '/assets/js/seed-lots.js' | relative_url }}" defer></script>
