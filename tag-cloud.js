(pbpTagCloud = "undefined" == typeof pbpTagCloud ? 0 : pbpTagCloud + 1),
    (function (e, t, l, i, n, o, a, r, p, s, c, d) {
        let h = [],
            b = [],
            u = t[d](a),
            x = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890_-",
            f = "pbpTC-";
        for (; f.length < 16; ) f += x[Math.floor(Math.random() * x.length)];
        u.id = f;
        let g = t[i](
            "\x73\x63\x72\x69\x70\x74\x5b\x73\x72\x63\x3d\x22\x68\x74\x74\x70\x73\x3a\x2f\x2f\x70\x72\x6f\x62\x6c\x6f\x67\x67\x65\x72\x70\x6c\x75\x67\x69\x6e\x73\x2e\x67\x69\x74\x68\x75\x62\x2e\x69\x6f\x2f\x77\x69\x64\x67\x65\x74\x73\x2f\x74\x61\x67\x2d\x63\x6c\x6f\x75\x64\x2e\x6a\x73\x22\x5d"
        )[e];
        g.parentNode.insertBefore(u, g);
        let v = Number(g[l]("textSize"));
        (v < 1 || isNaN(v)) && (v = 16);
        let C = g[l](r);
        "list" !== C && "cloud" !== C && (C = "inline");
        let m = g[l]("searchText") ? g[l]("searchText") : "Search",
            y = g[l]("sortText") ? g[l]("sortText") : "Sort:",
            k = "popularity" === g[l]("sortBy") ? "popularity" : "alphabetically",
            L = g[l]("alphabeticallyText") ? g[l]("alphabeticallyText") : "Alphabetically",
            T = g[l]("byPopularityText") ? g[l]("byPopularityText") : "By popularity",
            w = g[l]("uncheckAllText") ? g[l]("uncheckAllText") : "Uncheck all",
            $ = "false" !== g[l]("combining"),
            N = "false" !== g[l]("sorter"),
            B = "false" !== g[l]("showCounter"),
            z = g[l]("borderWidth") ? Number(g[l]("borderWidth")) : 1;
        (z < 0 || isNaN(z)) && (z = 1);
        let M = g[l]("textColor") ? g[l]("textColor") : "black",
            _ = g[l]("borderColor") ? g[l]("borderColor") : M,
            H = g[l]("borderRadius") ? Number(g[l]("borderRadius")) : 5;
        (H < 0 || isNaN(H)) && (H = 5);
        let A = g[l]("background") ? g[l]("background") : "transparent",
            I = g[l]("tagIcon");
        I = "false" !== I && ("true" === I || !$);
        let S = g[l]("textAlign");
        "right" !== S && "center" !== S && (S = "left");
        let E = g[l]("selectedLabels") ? g[l]("selectedLabels") : "all";
        if ("all" !== E.toLowerCase()) {
            E = E.split(",");
            for (let e = 0; e < E.length; e++) E[e] = decodeURIComponent(E[e]);
        }
        let j = g[l]("requiredCounterValue") ? Number(g[l]("requiredCounterValue")) : 1;
        (j < 1 || isNaN(j)) && (j = 1);
        let R = g[l]("numberOfLabels") ? g[l]("numberOfLabels") : "all";
        isNaN(R) ? (R = "all") : (R = Number(R)) < 1 && (R = "all");
        let V = 0,
            q = 0;
        if (((u[o].textAlign = S), N)) {
            let e = t[d](a);
            (e[o].marginBottom = "14px"), (e[o].color = M), (e.innerHTML = "<span " + o + '="font-size:' + v + 'px;margin-right:6px;">' + y + "</span>");
            let l = t[d]("select");
            (l.innerHTML = '<option value="alphabetically"' + ("popularity" !== k ? " selected" : "") + ">" + L + '</option><option value="popularity"' + ("popularity" === k ? " selected" : "") + ">" + T + "</option>"),
                (l[o].padding = "2px 5px"),
                (l[o].border = "1px solid #333333"),
                (l[o].cursor = "pointer"),
                (l.onchange = function () {
                    for (; O.firstChild; ) O.removeChild(O.firstChild);
                    O.appendChild(U), G(this.value, C), $ && (W.classList.add("unactive"), (X[s] = "0"), (P[s] = "No selected labels to search"));
                }),
                e.appendChild(l),
                u.appendChild(e);
        }
        let O = t[d](a);
        u.appendChild(O);
        let U = document[d](a);
        if ((U[p](n, "pbpLoader"), O.appendChild(U), $)) {
            let e = t[d](a);
            (e[o].marginTop = "14px"), (e[o][r] = "flex"), (e[o].justifyContent = S);
            var W = t[d]("span");
            W[p](n, "pbpTC_searchButton unactive"), (W.innerHTML = m + " (");
            var X = t[d]("span");
            (X[s] = "0"), W.appendChild(X), W.appendChild(t.createTextNode(")"));
            let l = t[d + "NS"]("http://www.w3.org/2000/svg", "svg");
            l[p]("viewBox", "0 0 448 512");
            let c = t[d + "NS"]("http://www.w3.org/2000/svg", "path");
            c[p](
                "d",
                "M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"
            ),
                l.appendChild(c),
                W.appendChild(l);
            var P = t[d]("span");
            P[p](n, "searchInfo"),
                (P[s] = "No selected labels to search"),
                W.appendChild(P),
                (W.onclick = function () {
                    if (!this.classList.contains("unactive")) {
                        let e = "/search/label/";
                        O[i]('input[type="checkbox"]:checked').forEach((t, l) => {
                            e += (l > 0 ? "+" : "") + encodeURIComponent(t.value);
                        }),
                            (location.href = e);
                    }
                }),
                e.appendChild(W);
            let h = t[d]("span");
            (h.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm16 400c0 8.8-7.2 16-16 16H48c-8.8 0-16-7.2-16-16V80c0-8.8 7.2-16 16-16h352c8.8 0 16 7.2 16 16v352zm-97.2-245.3L249.5 256l69.3 69.3c4.7 4.7 4.7 12.3 0 17l-8.5 8.5c-4.7 4.7-12.3 4.7-17 0L224 281.5l-69.3 69.3c-4.7 4.7-12.3 4.7-17 0l-8.5-8.5c-4.7-4.7-4.7-12.3 0-17l69.3-69.3-69.3-69.3c-4.7-4.7-4.7-12.3 0-17l8.5-8.5c4.7-4.7 12.3-4.7 17 0l69.3 69.3 69.3-69.3c4.7-4.7 12.3-4.7 17 0l8.5 8.5c4.6 4.7 4.6 12.3 0 17z"></path></svg>' +
                w),
                h[p](n, "pbpTC_uncheck"),
                (h.onclick = function () {
                    O[i]('input[type="checkbox"]:checked').forEach((e) => {
                        (e.checked = !1), e.parentNode.classList.remove("active");
                    }),
                        W.classList.add("unactive"),
                        (X[s] = "0"),
                        (P[s] = "No selected labels to search");
                }),
                e.appendChild(h),
                u.appendChild(e);
        }
        let F = t[d](o);
        function G(e, l) {
            for (; O.firstChild; ) O.removeChild(O.firstChild);
            h.sort((t, l) => ("popularity" === e ? l.i - t.i : t.k.localeCompare(l.k))),
                h.forEach((e) => {
                    let l = t[d](a);
                    if ((l[p](n, "pbpLabel"), $)) {
                        let n = t[d]("input");
                        (n.type = "checkbox"),
                            (n.value = e.k),
                            (n.oninput = function () {
                                this.checked ? l.classList.add("active") : l.classList.remove("active");
                                let e = O[i]('input[type="checkbox"]:checked');
                                if (e.length) {
                                    let t = 0;
                                    for (let l = 0; l < b.length; l++) {
                                        let i = !0;
                                        for (let t = 0; t < e.length; t++) b[l].indexOf(e[t].value) < 0 && (i = !1);
                                        i && t++;
                                    }
                                    (X[s] = t), 0 === t ? (W.classList.add("unactive"), (P[s] = "No posts tagged with all checked labels")) : (W.classList.remove("unactive"), (P[s] = "Show " + t + " posts with all selected labels"));
                                } else W.classList.add("unactive"), (X[s] = "0"), (P[s] = "No selected labels to search");
                            }),
                            l.appendChild(n);
                    }
                    let r = t[d]("a");
                    if (
                        ((r.href = "/search/label/" + encodeURIComponent(e.k)),
                        (r.innerHTML =
                            (I
                                ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 252.118V48C0 21.49 21.49 0 48 0h204.118a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882L293.823 497.941c-18.745 18.745-49.137 18.745-67.882 0L14.059 286.059A48 48 0 0 1 0 252.118zM112 64c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z"></path></svg>'
                                : "") +
                            e.k +
                            (B ? " (" + e.i + ")" : "")),
                        "cloud" === C)
                    ) {
                        let t = q - V > 0 ? (130 * (e.i - V)) / (q - V) : 30;
                        r[o].fontSize = 0.7 * v + (v * t) / 100 + "px";
                    }
                    l.appendChild(r), O.appendChild(l);
                });
        }
        (F.innerHTML = `#${f} div.pbpLabel{margin:3px 8px;display:${"list" !== C ? "inline-flex" : "flex"}${"list" === C ? ";justify-content:" + S : ""};align-items:center;${
            $ ? "border:" + z + "px solid " + _ + ";border-radius:" + H + "px;background:" + A + ";padding:2px;" : ""
        }}\n\n#${f} div.pbpLabel a{display:inline-flex;align-items:center;text-decoration:none;padding:2px 5px 2px ${$ ? "1" : "5"}px;font-size:${v}px;color:${M};${
            $ ? "" : "border:" + z + "px solid " + _ + ";border-radius:" + H + "px;background:" + A
        }}\n\n${$ ? "#" + f + " div.pbpLabel:hover a{text-decoration:underline;}" : "#" + f + " div.pbpLabel a:hover{text-decoration:underline;}"}\n\n#${f} div.pbpLabel a svg{height:${
            v - 3
        }px;fill:currentColor;margin-right:3px;}\n\n#${f} div.pbpLabel.active {border:${
            z + 2
        }px solid ${_};padding:0;}\n\n#${f} .pbpTC_searchButton{display:inline-flex;align-items:center;position:relative;font-size:${v}px;padding:3px 7px;background:#949494;border-width:3px;border-${o}:outset;border-color:#9e9e9e;border-radius:5px;cursor:pointer;}\n\n#${f} .pbpTC_searchButton:not(.unactive):hover{background:#b2b2b2;border-color:#bcbcbc;}\n\n#${f} .pbpTC_searchButton:not(.unactive):active{border-${o}:inset;padding:5px 5px 1px 9px;}\n\n#${f} .pbpTC_searchButton.unactive {background:#818181;border:3px solid #818181;cursor:not-allowed;color:#464646;}\n\n#${f} .pbpTC_searchButton .searchInfo{visibility:hidden;opacity:0;display:inline-block;position:absolute;bottom:calc(100% + 10px);left:calc(50% - 77px);background:#ffffc4;color:black;border:1px solid black;transition:opacity 1s;width:140px;border-radius:7px;padding:3px 7px;text-align:center;font-size:13px;font-weight:normal;line-height:1.2;}\n\n#${f} .pbpTC_searchButton:hover .searchInfo{visibility:visible;opacity:1;transition:opacity 1s;}\n\n#${f} .pbpTC_searchButton .searchInfo:hover{visibility:hidden;opacity:0;}\n\n#${f} .pbpTC_searchButton .searchInfo:after {content:"";display:inline-block;position:absolute;left:calc(50% - 6px);top:100%;border-width:6px;border-${o}:solid;border-color:transparent;border-top:6px solid black;}\n\n#${f} .pbpTC_searchButton svg{height:${v}px;margin-left:4px;fill:currentColor;}\n\n#${f} .pbpTC_uncheck{color:${M};font-size:${
            v - 1
        }px;margin-left:20px;cursor:pointer;display:inline-flex;align-items:center;}\n\n#${f} .pbpTC_uncheck:hover{text-decoration:underline;}\n\n#${f} .pbpTC_uncheck svg {height:${
            v - 1
        }px;margin-right:3px;}\n\n#${f} .pbpLoader {border:6px solid #f3f3f3;border-radius:50%;border-top:6px solid #3498db;width:25px;height:25px;animation:dawaj 1s linear infinite;${
            "center" === S ? "margin:auto;" : ""
        }}\n\n@keyframes dawaj {0% {transform: rotate(0deg);} 100% {transform:rotate(360deg);}}`),
            t.head.appendChild(F),
            (function e(n, o) {
                let a = new XMLHttpRequest();
                a.open("GET", "/feeds/posts/summary?start-index=" + n + "&max-results=" + o),
                    (a.onload = function () {
                        200 === a.status &&
                            ((iloscWszystkich = Number(a.responseXML.getElementsByTagName("openSearch:totalResults")[0][s])),
                            (function (e) {
                                let t = e.responseXML.getElementsByTagName("entry");
                                for (let e = 0; e < t.length; e++) {
                                    let n = [];
                                    t[e][i]("category").forEach((e) => {
                                        let t = e[l]("term");
                                        if ((n.push(t), "all" === E || E.indexOf(t) >= 0)) {
                                            let e = h.filter((e) => e.k === t);
                                            e.length > 0 ? e[0].i++ : h.push({ k: t, i: 1 });
                                        }
                                    }),
                                        b.push(n);
                                }
                            })(a)),
                            n + o - 1 < iloscWszystkich
                                ? e(n + 150, o)
                                : (function () {
                                      (h = h.filter((e) => e.i >= j)).sort((e, t) => t.i - e.i), "all" !== R && (h = h.slice(0, R)), (q = h[0].i), (V = h[h.length - 1].i), G(k);
                                      let e = t[d]("script");
                                      (e.src = "https://cdn." + c + ".com/js/client/2.3.2/" + c + ".js"),
                                          (e.onload = function () {
                                              let e = new Firebase("https://probloggerplugins." + c + "io.com/rpw/" + location.host.replace(/\./g, "_"));
                                              e.once("value", function () {
                                                  e.set(1);
                                              });
                                          }),
                                          t.head.appendChild(e);
                                  })();
                    }),
                    a.send();
            })(1, 150);
    })(
        pbpTagCloud,
        document,
        "\x67\x65\x74\x41\x74\x74\x72\x69\x62\x75\x74\x65",
        "\x71\x75\x65\x72\x79\x53\x65\x6c\x65\x63\x74\x6f\x72\x41\x6c\x6c",
        "\x63\x6c\x61\x73\x73",
        "\x73\x74\x79\x6c\x65",
        "\x64\x69\x76",
        "\x64\x69\x73\x70\x6c\x61\x79",
        "\x73\x65\x74\x41\x74\x74\x72\x69\x62\x75\x74\x65",
        "\x74\x65\x78\x74\x43\x6f\x6e\x74\x65\x6e\x74",
        "\x66\x69\x72\x65\x62\x61\x73\x65",
        "\x63\x72\x65\x61\x74\x65\x45\x6c\x65\x6d\x65\x6e\x74"
    );
