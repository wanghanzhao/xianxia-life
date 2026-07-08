(function () {
  if (typeof renderMap === "function") return;

  const style = document.createElement("style");
  style.textContent = `
    .map-card{margin-bottom:14px;border:1px solid rgba(185,138,53,.28);border-radius:8px;padding:12px;background:rgba(255,250,240,.86)}
    #regionHint{color:var(--muted);font-size:13px}
    .map-regions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
    .region-btn{min-height:86px;padding:10px;text-align:left}
    .region-btn.active{border-color:var(--gold);outline:2px solid rgba(185,138,53,.18)}
    .region-btn strong,.region-btn span{display:block}
    .region-btn span{margin-top:4px;color:var(--muted);font-size:12px;line-height:1.35}
    .need-line>span{flex:0 0 auto}
    .need-line>strong{flex:1 1 auto;min-width:0;text-align:right;overflow-wrap:anywhere}
    @media (max-width:560px){.map-card.mobile-panel-active{display:block;padding:10px;margin-bottom:10px}.map-regions{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.region-btn{min-height:78px;padding:9px}}
  `;
  document.head.appendChild(style);

  const addonGoods = [
    { id: "beastHide", name: "妖兽皮骨", basePrice: 42, desc: "可卖给炼器铺，也能充作低阶护身材料。" },
    { id: "demonBone", name: "妖骨", basePrice: 120, desc: "凶煞难驯，魔修和炼器师都愿意收。" },
    { id: "thunderCrystal", name: "雷纹晶", basePrice: 180, desc: "含天雷残意，是高阶破境时的稀罕辅材。" },
    { id: "fiveElementJade", name: "五行玉", basePrice: 220, desc: "五行灵气交汇凝成，化神以后尤其珍贵。" }
  ];

  addonGoods.forEach((good) => {
    if (!tradeGoods.some((item) => item.id === good.id)) tradeGoods.push(good);
  });

  const regions = [
    { id: "greenHills", name: "青溪山", desc: "灵草多，妖兽弱，适合低阶修士攒第一桶资源。", danger: 4, minRealm: 0, travelLoot: [["spiritHerb", 46], ["manual", 9]], dungeonLoot: [["spiritHerb", 32], ["beastCore", 24], ["beastHide", 22], ["manual", 10]] },
    { id: "blackPine", name: "黑松岭", desc: "狼妖与山魈盘踞，内丹、皮骨较常见。", danger: 13, minRealm: 0, travelLoot: [["spiritHerb", 22], ["beastHide", 24], ["beastCore", 16]], dungeonLoot: [["beastCore", 42], ["beastHide", 38], ["spiritOre", 18], ["manual", 12]] },
    { id: "fallenStarSea", name: "坠星海", desc: "乱礁深海，妖兽凶横，常见灵矿与阵盘残片。", danger: 24, minRealm: 1, travelLoot: [["spiritOre", 30], ["beastCore", 22], ["formationShard", 12]], dungeonLoot: [["beastCore", 46], ["formationShard", 28], ["spiritOre", 34], ["rareManual", 8]] },
    { id: "ancientRuin", name: "古修遗府", desc: "禁制残破但杀机未散，功法与阵道机缘更重。", danger: 34, minRealm: 2, travelLoot: [["manual", 24], ["formationShard", 22], ["spiritOre", 16]], dungeonLoot: [["rareManual", 20], ["formationShard", 42], ["fiveElementJade", 12], ["demonBone", 14]] },
    { id: "thunderMarsh", name: "雷泽妖原", desc: "雷暴与大妖同在，能出高阶破境材料，也最容易出事。", danger: 46, minRealm: 3, travelLoot: [["thunderCrystal", 18], ["beastCore", 28], ["demonBone", 18]], dungeonLoot: [["thunderCrystal", 34], ["fiveElementJade", 22], ["demonBone", 34], ["rareManual", 10]] }
  ];

  const prep = {
    1: { name: "感气入门", materials: [{ id: "spiritHerb", amount: 1, bonus: 5 }], elixirs: [{ id: "qingxin", amount: 1, bonus: 5 }], notes: "低阶重在稳住心神，灵草、清心丹就能帮上忙。" },
    2: { name: "筑基筑台", materials: [{ id: "spiritHerb", amount: 2, bonus: 7 }, { id: "beastCore", amount: 1, bonus: 8 }], elixirs: [{ id: "ningshen", amount: 1, bonus: 7 }, { id: "yangyuan", amount: 1, bonus: 5 }], notes: "筑基要补经脉、定神识，材料和丹药缺一类都很虚。" },
    3: { name: "凝丹火候", materials: [{ id: "beastCore", amount: 2, bonus: 9 }, { id: "spiritOre", amount: 1, bonus: 6 }, { id: "manual", amount: 1, bonus: 6 }], elixirs: [{ id: "yulu", amount: 1, bonus: 7 }, { id: "ningshen", amount: 1, bonus: 6 }], notes: "结丹不止靠丹药，妖丹火候、功法理解和护身资源都要有。" },
    4: { name: "碎丹化婴", materials: [{ id: "rareManual", amount: 1, bonus: 8 }, { id: "formationShard", amount: 2, bonus: 8 }, { id: "demonBone", amount: 1, bonus: 6 }], elixirs: [{ id: "yulu", amount: 1, bonus: 7 }, { id: "ningshen", amount: 2, bonus: 8 }], notes: "元婴关要护住神魂，阵法、功法、神识丹药都能续一口气。" },
    5: { name: "五气炼神", materials: [{ id: "fiveElementJade", amount: 2, bonus: 10 }, { id: "rareManual", amount: 1, bonus: 8 }, { id: "thunderCrystal", amount: 1, bonus: 7 }], elixirs: [{ id: "yulu", amount: 2, bonus: 8 }, { id: "ningshen", amount: 2, bonus: 8 }], notes: "化神以后开始讲五行与神魂圆融，单靠硬冲几乎是在赌命。" },
    6: { name: "合道归一", materials: [{ id: "fiveElementJade", amount: 3, bonus: 10 }, { id: "thunderCrystal", amount: 2, bonus: 9 }, { id: "formationShard", amount: 3, bonus: 7 }], elixirs: [{ id: "yulu", amount: 2, bonus: 7 }], notes: "合道要把一身所学合成自己的路，资源只能铺路，悟道才是门槛。" },
    7: { name: "引劫渡身", materials: [{ id: "thunderCrystal", amount: 4, bonus: 12 }, { id: "fiveElementJade", amount: 3, bonus: 10 }, { id: "demonBone", amount: 2, bonus: 6 }], elixirs: [{ id: "yulu", amount: 3, bonus: 8 }], notes: "渡劫就是拿命向天问道，雷材、护身法阵和心境缺了都危险。" }
  };

  function region() {
    if (!state.regionId) state.regionId = "greenHills";
    return regions.find((item) => item.id === state.regionId) ?? regions[0];
  }

  function lineScore(line, store) {
    const owned = store?.[line.id] ?? 0;
    return owned >= line.amount ? line.bonus : Math.floor(line.bonus * owned / line.amount);
  }

  window.breakthroughPrepScore = function () {
    const config = prep[state.realm + 1];
    if (!config) return 0;
    const materialScore = config.materials.reduce((sum, line) => sum + lineScore(line, state.goods), 0);
    const elixirScore = config.elixirs.reduce((sum, line) => sum + lineScore(line, state.elixirPills), 0);
    const sectScore = currentSect() ? Math.min(10, Math.floor(state.sectContribution / 18) + state.sectReputation) : 0;
    const manualScore = Math.min(8, Math.floor(state.dao / Math.max(3, realms[state.realm]?.insightNeed || 3)));
    return clamp(materialScore + elixirScore + sectScore + manualScore, 0, 42);
  };

  window.baseBreakChance = function () {
    const realmPressure = state.realm * 8 + Math.max(0, state.realm - 2) * 5;
    return clamp(Math.floor(5 + state.mind * 0.08 + state.luck * 0.45 + state.insight * 0.42 + state.worldliness * 0.12 + state.power * 0.08 - state.seclusionFatigue * 5 - realmPressure), 3, 52);
  };

  window.breakthroughChance = function (pill = bestBreakPillForTarget()) {
    const pillBonus = pill ? Math.min(pill.bonus, 12 + state.realm * 3) : 0;
    const upper = clamp(68 - state.realm * 3 + Math.floor(state.luck / 4), 38, 78);
    return clamp(baseBreakChance() + breakthroughPrepScore() + pillBonus, 3, upper);
  };

  function renderMapAddon() {
    if (!$("mapRegions") || !state) return;
    const active = region();
    $("regionHint").textContent = `当前：${active.name} · 危险 ${active.danger}`;
    $("mapRegions").innerHTML = regions.map((item) => {
      const locked = state.realm < item.minRealm;
      const loot = [...item.travelLoot, ...item.dungeonLoot].map(([id]) => goodById(id)?.name).filter(Boolean).filter((name, index, list) => list.indexOf(name) === index).slice(0, 3).join(" / ");
      return `<button class="region-btn ${item.id === active.id ? "active" : ""}" data-region="${item.id}" type="button" ${locked ? "disabled" : ""}><strong>${item.name}${locked ? ` · ${realms[item.minRealm].name}解锁` : ""}</strong><span>危险 ${item.danger} · ${loot}</span></button>`;
    }).join("");
    document.querySelectorAll("[data-region]").forEach((button) => {
      button.addEventListener("click", () => {
        const next = regions.find((item) => item.id === button.dataset.region);
        if (!next || state.realm < next.minRealm) return;
        state.regionId = next.id;
        log(`你将接下来行走的方向定在「${next.name}」。${next.desc}`, "gold");
        save();
        render();
      });
    });
  }

  const oldRender = render;
  window.render = render = function () {
    oldRender();
    if (!state) return;
    renderMapAddon();
    const extra = [
      ["地域", region().name],
      ["妖险", region().danger],
      ["破境筹备", `${breakthroughPrepScore()}%`]
    ].map(([label, value]) => `<div class="resource"><span>${label}</span><strong>${value}</strong></div>`).join("");
    ["resourceGrid", "detailResourceGrid"].forEach((id) => {
      if ($(id) && !$(id).textContent.includes("破境筹备")) $(id).insertAdjacentHTML("beforeend", extra);
    });
  };

  const oldMaterializeChoice = materializeChoice;
  window.materializeChoice = materializeChoice = function (blueprint) {
    const choice = oldMaterializeChoice(blueprint);
    const active = region();
    const deep = blueprint.style === "deep";
    const risky = ["risk", "deep", "team"].includes(blueprint.style);
    if (risky) choice.effects.health = (choice.effects.health ?? 0) - Math.floor(active.danger / 5);
    choice.deathChance += blueprint.style === "withdraw" ? 0 : Math.floor(active.danger / (deep ? 2 : 4));
    choice.hint = `${choice.hint} · ${active.name}危险 ${active.danger}`;
    return choice;
  };

  window.openEncounter = openEncounter = function (kind, baseGain = 0) {
    const index = roll(0, encounters[kind].length - 1);
    const event = encounters[kind][index];
    const active = region();
    state.pendingChoice = { kind, title: event.title, regionId: active.id, text: `${active.name}：${event.text}`, choices: generateChoices(kind) };
    if (kind === "travel") add(state, { seclusionFatigue: -1 });
    const gainText = baseGain > 0 ? `一路行止亦是修行，修为增长 ${baseGain}。` : "";
    log(`你在「${active.name}」遇见了「${event.title}」。${event.text}${gainText}`, "gold");
  };

  const oldMaybeFindTradeLoot = maybeFindTradeLoot;
  window.maybeFindTradeLoot = maybeFindTradeLoot = function (kind) {
    const baseText = oldMaybeFindTradeLoot(kind);
    const active = region();
    const pool = kind === "dungeon" ? active.dungeonLoot : kind === "travel" ? active.travelLoot : [];
    const found = [];
    pool.forEach(([goodId, chance]) => {
      const dangerBonus = kind === "dungeon" ? Math.floor(active.danger / 5) : Math.floor(active.danger / 8);
      if (roll(1, 100) <= chance + dangerBonus + Math.floor(state.luck / 3)) {
        const amount = goodId === "spiritHerb" ? roll(1, 3) : goodId === "beastHide" ? roll(1, 2) : 1;
        addGood(goodId, amount);
        found.push(`${goodById(goodId).name} x${amount}`);
      }
    });
    return `${baseText}${found.length ? ` 你还在${active.name}带回了${found.join("、")}。` : ""}`;
  };

  function consumePrep() {
    const config = prep[state.realm + 1];
    if (!config) return "";
    const consumed = [];
    config.materials.forEach((line) => {
      if ((state.goods[line.id] ?? 0) >= line.amount) {
        removeGood(line.id, line.amount);
        consumed.push(`${goodById(line.id)?.name ?? line.id}x${line.amount}`);
      }
    });
    config.elixirs.forEach((line) => {
      if ((state.elixirPills[line.id] ?? 0) >= line.amount) {
        removeElixirPill(line.id, line.amount);
        consumed.push(`${elixirById(line.id)?.name ?? line.id}x${line.amount}`);
      }
    });
    if (currentSect() && state.sectContribution >= 18) {
      const used = Math.min(state.sectContribution, 36 + state.realm * 8);
      add(state, { sectContribution: -used });
      consumed.push(`宗门贡献x${used}`);
    }
    return consumed.length ? ` 此番布置耗去${consumed.join("、")}。` : "";
  }

  window.attemptBreakthrough = attemptBreakthrough = function () {
    const current = realm();
    if (!nextRealm()) {
      log("你已立于此界巅峰，再往前便是不可言说之境。", "gold");
      return;
    }
    if (state.cultivation < current.need) {
      log(`你试图冲击${nextRealm().name}，却因修为不足而气息紊乱。`, "danger");
      state.health -= 8;
      passYears(1);
      return;
    }
    if (state.mind < current.mindNeed) {
      log(`你强行叩问${nextRealm().name}关隘，却因心境不足，杂念丛生。需心境 ${current.mindNeed}。`, "danger");
      state.mind -= 5;
      state.health -= 6;
      passYears(1);
      return;
    }
    if (state.dao < current.insightNeed) {
      log(`你修为虽足，却缺少破境所需的悟道。需悟道 ${current.insightNeed}，可通过历练、论道、机缘获得。`, "danger");
      state.mind -= 4;
      passYears(1);
      return;
    }
    const pill = bestBreakPillForTarget();
    const prepScore = breakthroughPrepScore();
    const chance = breakthroughChance(pill);
    const success = roll(1, 100) <= chance;
    if (pill) removeBreakPill(pill.id);
    const prepText = consumePrep();
    passYears(1);
    const pillBonus = pill ? Math.min(pill.bonus, 12 + state.realm * 3) : 0;
    const pillText = pill ? `你服下「${pill.name}」，丹力助推 ${pillBonus}%，此番成功率为 ${chance}%。${prepText}` : `未得破境丹护持，此番成功率仅 ${chance}%。${prepText}`;
    if (success) {
      state.realm += 1;
      state.cultivation = 0;
      state.dao = Math.max(0, state.dao - current.insightNeed);
      state.worldliness = Math.max(0, state.worldliness - Math.ceil(current.insightNeed / 2));
      state.seclusionFatigue = 0;
      state.life = realms[state.realm].life + state.luck;
      state.health = 100;
      state.mind = clamp(state.mind + 8, 0, 100);
      log(`${pillText} 雷声隐隐，你破关而出，终成${realm().name}修士。寿元增至 ${state.life}。`, "gold");
      return;
    }
    state.cultivation = Math.floor(state.cultivation * (0.48 + Math.min(0.14, prepScore / 300)));
    state.health -= roll(28, 58) + state.realm * 4;
    state.mind -= roll(12, 26) + state.realm * 2;
    state.seclusionFatigue = clamp(state.seclusionFatigue + 2, 0, 10);
    if (state.health <= 0 || roll(1, 100) <= 12 + state.realm * 5 - Math.floor(state.luck / 3)) {
      die(state, `${pillText} 冲关失败，灵气倒卷，经脉寸断，你没能撑过这场大劫。`);
      return;
    }
    log(`${pillText} 冲关失败，灵气倒卷，经脉如焚。你勉强保住根基。`, "danger");
  };

  window.renderBreakNeed = renderBreakNeed = function () {
    const current = realm();
    const target = nextRealm();
    if (!target) {
      const html = `<div class="need-line ok"><span>前路</span><strong>可问飞升</strong></div>`;
      $("breakNeed").innerHTML = html;
      $("detailBreakNeed").innerHTML = html;
      return;
    }
    const needHtml = [["修为", state.cultivation, current.need], ["心境", state.mind, current.mindNeed], ["悟道", state.dao, current.insightNeed]].map(([label, value, need]) => `<div class="need-line ${value >= need ? "ok" : "bad"}"><span>${label}</span><strong>${value}/${need}</strong></div>`).join("");
    const pill = bestBreakPillForTarget();
    const config = prep[state.realm + 1];
    const materialHtml = config ? [...config.materials.map((line) => {
      const owned = state.goods[line.id] ?? 0;
      return `<div class="need-line ${owned >= line.amount ? "ok" : "bad"}"><span>${goodById(line.id)?.name ?? line.id}</span><strong>${owned}/${line.amount} +${line.bonus}%</strong></div>`;
    }), ...config.elixirs.map((line) => {
      const owned = state.elixirPills[line.id] ?? 0;
      return `<div class="need-line ${owned >= line.amount ? "ok" : "bad"}"><span>${elixirById(line.id)?.name ?? line.id}</span><strong>${owned}/${line.amount} +${line.bonus}%</strong></div>`;
    })].join("") : "";
    const pillBonus = pill ? Math.min(pill.bonus, 12 + state.realm * 3) : 0;
    const html = `${needHtml}<div class="need-line"><span>基础成功率</span><strong>${baseBreakChance()}%</strong></div><div class="need-line ok"><span>筹备加成</span><strong>${breakthroughPrepScore()}%</strong></div><div class="need-line ${pill ? "ok" : "bad"}"><span>可用破境丹</span><strong>${pill ? `${pill.name} +${pillBonus}%` : "无"}</strong></div><div class="need-line ${breakthroughChance(pill) >= 30 ? "ok" : "bad"}"><span>本次预估</span><strong>${breakthroughChance(pill)}%</strong></div>${config ? `<div class="need-line"><span>${config.name}</span><strong>${config.notes}</strong></div>${materialHtml}` : ""}`;
    $("breakNeed").innerHTML = html;
    $("detailBreakNeed").innerHTML = html;
  };

  render();
})();
