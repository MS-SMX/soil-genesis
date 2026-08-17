---
layout: default
title: V-Log
permalink: /log/v-log/
---

<div class="log-page">

<header class="log-header">

<div class="log-kicker">
            SOIL GENESIS // VIDEO LOG
        </div>

<h1>V-LOG</h1>

<p>
            Brevi aggiornamenti dal terreno e dal percorso
            di Soil Genesis.
        </p>

</header>


<section class="log-grid">

        {% assign entries = site.logs
            | where: "type", "vlog"
            | sort: "date"
            | reverse %}

        {% for entry in entries %}

 <a
    class="log-row vlog-row"
    href="https://www.youtube.com/watch?v={{ entry.youtube_id }}"
    target="_blank"
    rel="noopener noreferrer">

    {% if entry.youtube_id %}

        <div class="log-row-image">

            <img
                src="https://img.youtube.com/vi/{{ entry.youtube_id }}/maxresdefault.jpg"
                alt="{{ entry.title }}"
                loading="lazy">

            <span class="log-row-play">
                ▶
            </span>

        </div>

    {% endif %}


    <div class="log-row-main">

        <div class="log-row-meta">

            <span>
                V-LOG // {{ entry.date | date: "%d.%m.%Y" }}
            </span>

            {% if entry.duration %}

                <span>
                    {{ entry.duration }}
                </span>

            {% endif %}

        </div>


        <h2>
            {{ entry.title }}
        </h2>


        {% if entry.description %}

            <p>
                {{ entry.description }}
            </p>

        {% endif %}

    </div>


    <span class="log-row-action">
        WATCH ↗
    </span>

</a>

        {% endfor %}

 </section>

</div>