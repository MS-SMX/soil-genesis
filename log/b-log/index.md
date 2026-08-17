---
layout: default
title: B-Log
permalink: /log/b-log/
---

<div class="log-page">

<header class="log-header">

<div class="log-kicker">
            SOIL GENESIS // WRITTEN LOG
        </div>

<h1>B-LOG</h1>

<p>
            Sproloqui pubblicati
            su Substack.
        </p>

</header>


 <section class="log-grid">

        {% assign entries = site.logs
            | where: "type", "blog"
            | sort: "date"
            | reverse %}

        {% for entry in entries %}

<a
    class="log-row blog-row"
    href="{{ entry.substack_url }}"
    target="_blank"
    rel="noopener noreferrer">

    <div class="log-row-main">

        <div class="log-row-meta">

            <span>
                B-LOG // {{ entry.date | date: "%d.%m.%Y" }}
            </span>

            {% if entry.reading_time %}

                <span>
                    {{ entry.reading_time }}
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
        READ ↗
    </span>

</a>

        {% endfor %}
</section>

</div>