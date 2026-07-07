const realms = [
  { name: "凡人", need: 70, insightNeed: 0, mindNeed: 42, life: 70 },
  { name: "炼气", need: 260, insightNeed: 5, mindNeed: 55, life: 105 },
  { name: "筑基", need: 760, insightNeed: 14, mindNeed: 66, life: 165 },
  { name: "金丹", need: 1800, insightNeed: 30, mindNeed: 74, life: 250 },
  { name: "元婴", need: 4200, insightNeed: 56, mindNeed: 82, life: 390 },
  { name: "化神", need: 9000, insightNeed: 92, mindNeed: 88, life: 640 },
  { name: "合道", need: 18000, insightNeed: 140, mindNeed: 94, life: 980 },
  { name: "渡劫", need: 99999, insightNeed: 220, mindNeed: 98, life: 1400 }
];

const breakthroughPills = [
  { id: "qi", name: "凝气丹", targetRealm: 1, bonus: 16, cost: 90 },
  { id: "foundation", name: "筑基丹", targetRealm: 2, bonus: 24, cost: 180 },
  { id: "foundationPure", name: "上品筑基丹", targetRealm: 2, bonus: 40, cost: 360, rare: true },
  { id: "goldCore", name: "结金丹", targetRealm: 3, bonus: 24, cost: 420 },
  { id: "goldCorePure", name: "上品结金丹", targetRealm: 3, bonus: 38, cost: 820, rare: true },
  { id: "nascent", name: "化婴丹", targetRealm: 4, bonus: 22, cost: 980 },
  { id: "spirit", name: "凝神丹", targetRealm: 5, bonus: 20, cost: 1800 },
  { id: "harmony", name: "合道丹", targetRealm: 6, bonus: 18, cost: 3200 },
  { id: "tribulation", name: "渡劫丹", targetRealm: 7, bonus: 16, cost: 5200 }
];

const tradeGoods = [
  { id: "spiritHerb", name: "灵草", basePrice: 24, desc: "炼丹常用材料，坊市需求稳定。" },
  { id: "beastCore", name: "妖兽内丹", basePrice: 58, desc: "炼器、炼丹皆可用，秘境中较常见。" },
  { id: "spiritOre", name: "灵矿", basePrice: 46, desc: "阵器铺常年收购。" },
  { id: "manual", name: "功法残卷", basePrice: 110, desc: "可卖灵石，也可参悟换悟道。" },
  { id: "formationShard", name: "阵盘残片", basePrice: 82, desc: "懂阵法的人愿出高价。" },
  { id: "rareManual", name: "古修功法", basePrice: 260, desc: "价值高，但参悟也可能走火入魔。" }
];

const origins = [
  {
    id: "farmer",
    name: "山村孤儿",
    desc: "根骨平平，心性坚韧。寿元 +8，心境 +8。",
    patch: { life: 8, mind: 8, talent: 0 }
  },
  {
    id: "clan",
    name: "修真世家",
    desc: "出身显贵，灵石丰厚。灵石 +120，悟性 +3。",
    patch: { spiritStones: 120, insight: 3 }
  },
  {
    id: "sword",
    name: "剑奴出身",
    desc: "少年磨剑，杀伐果断。战力 +10，心境 -4。",
    patch: { power: 10, mind: -4 }
  },
  {
    id: "herb",
    name: "药谷童子",
    desc: "识草木药性，善避灾厄。清心丹 +2，福缘 +6。",
    patch: { pills: 2, luck: 6 }
  }
];

const actionDefs = [
  { id: "cultivate", name: "静室修炼", desc: "稳步增长修为，消耗一年寿元。" },
  { id: "travel", name: "外出历练", desc: "获得悟道与机缘，也可能受伤。" },
  { id: "dungeon", name: "秘境探险", desc: "高风险高回报，低境界极易殒命。" },
  { id: "seclude", name: "闭关十年", desc: "高修为收益，但会积累闭关疲惫。" },
  { id: "social", name: "结交同道", desc: "增长心境与尘缘，缓解疲惫。" },
  { id: "breakthrough", name: "尝试突破", desc: "需修为、心境、悟道共同达标。" }
];

const encounters = {
  travel: [
    {
      title: "荒山古洞",
      text: "你在荒山深处发现一座半塌古洞，洞口阴风阵阵，石壁上隐约有剑痕。",
      choices: [
        {
          label: "入洞探查",
          hint: "高机缘，也有受伤风险",
          result: "你入洞三百步，得一卷残缺功法，出洞时被阴煞伤了肺腑。",
          type: "gold",
          apply: (s) => add(s, { cultivation: 36, insight: 1, dao: 3, health: -14 })
        },
        {
          label: "拓印剑痕",
          hint: "稳妥获得悟道",
          result: "你不入洞府，只在洞口拓下剑痕，连夜参悟，颇有所得。",
          type: "gold",
          apply: (s) => add(s, { dao: 2, power: 2, mind: 1 })
        },
        {
          label: "转身离去",
          hint: "避险，心境小涨",
          result: "你压下贪念，转身离开。回望山风，心中反而清明几分。",
          type: "",
          apply: (s) => add(s, { mind: 5, seclusionFatigue: -1 })
        }
      ]
    },
    {
      title: "妖兽领地",
      text: "暮色中，你误入妖兽领地。一头铁背苍狼伏在乱石后，似乎也发现了你。",
      choices: [
        {
          label: "拔剑迎战",
          hint: "涨战力，可能受伤",
          result: "你苦战半夜斩杀苍狼，满身血污，却也磨出一口锐气。",
          type: "danger",
          apply: (s) => add(s, { power: 8, health: -20, cultivation: 18, dao: 1 })
        },
        {
          label: "布置陷阱",
          hint: "消耗灵石，收益稳定",
          result: "你以灵石引动简易阵盘，将苍狼困入乱石阵中。",
          type: "gold",
          apply: (s) => add(s, { spiritStones: -24, power: 4, cultivation: 20 })
        },
        {
          label: "屏息绕行",
          hint: "避战，获得心境",
          result: "你借夜色绕过领地，听见狼嚎渐远，方知退让也是修行。",
          type: "",
          apply: (s) => add(s, { mind: 4, worldliness: 1 })
        }
      ]
    },
    {
      title: "溪边老叟",
      text: "你在溪边遇见一位蓑衣老叟。他问你：修行是为长生，还是为自在？",
      choices: [
        {
          label: "答：为长生",
          hint: "寿元与修为",
          result: "老叟笑你诚实，赠你一枚青玉坠，说可避一场小劫。",
          type: "gold",
          apply: (s) => {
            if (!s.inventory.includes("青玉坠")) s.inventory.push("青玉坠");
            add(s, { luck: 2, cultivation: 30 });
          }
        },
        {
          label: "答：为自在",
          hint: "心境与悟道",
          result: "老叟大笑而去，只留一句：自在二字，最难背负。",
          type: "gold",
          apply: (s) => add(s, { mind: 8, dao: 2 })
        },
        {
          label: "沉默行礼",
          hint: "福缘",
          result: "你不作机锋，只郑重一礼。老叟点头，递来一枚丹药。",
          type: "gold",
          apply: (s) => add(s, { luck: 1, pills: 1 })
        }
      ]
    },
    {
      title: "坊市争执",
      text: "你在坊市售卖灵草，却见摊主欺压一名初入道途的少年。",
      choices: [
        {
          label: "出言相助",
          hint: "得尘缘，可能惹麻烦",
          result: "你替少年讨回公道，围观者暗暗称许，摊主却记住了你的脸。",
          type: "gold",
          apply: (s) => add(s, { worldliness: 3, mind: 3, spiritStones: 35 })
        },
        {
          label: "低价收草",
          hint: "多赚灵石，损心境",
          result: "你趁乱低价收走灵草，再转手卖出，灵石丰厚，心中却不太安稳。",
          type: "",
          apply: (s) => add(s, { spiritStones: 85, mind: -5 })
        },
        {
          label: "置身事外",
          hint: "普通收益",
          result: "你售出自己的灵草，不多问他人因果。",
          type: "",
          apply: (s) => add(s, { spiritStones: 50, worldliness: 1 })
        }
      ]
    },
    {
      title: "云海日出",
      text: "你登上孤峰，见云海翻涌，红日跃出天际。此景可入诗，也可入道。",
      choices: [
        {
          label: "观景悟道",
          hint: "悟道较高",
          result: "你枯坐到日暮，忽觉万物有生灭，心中多了一分明悟。",
          type: "gold",
          apply: (s) => add(s, { dao: 2, mind: 3 })
        },
        {
          label: "采集朝露",
          hint: "丹药材料",
          result: "你以玉瓶收取峰顶朝露，归来炼成一枚清心丹。",
          type: "gold",
          apply: (s) => add(s, { pills: 1, mind: 2 })
        }
      ]
    }
  ],
  dungeon: [
    {
      title: "血雾秘境",
      text: "血雾秘境三十年一开，同行五人皆是炼气修士。入口处白骨半埋，似在警告后来者。",
      choices: [
        {
          label: "深入内围",
          hint: "可能暴富，也可能身死道消",
          result: "你们深入血雾，阵纹忽然倒转。同行者惨叫声渐远，你拼命逃出，半条命留在了秘境里。",
          type: "danger",
          apply: (s) => {
            if (deadlyRoll(s, 58)) return die(s, "血雾合拢，同行五人尽数失踪，你也未能走出秘境。");
            add(s, { health: -46, dao: 8, cultivation: 70, spiritStones: 120 });
          }
        },
        {
          label: "只搜外围",
          hint: "收益较低，风险仍在",
          result: "你们只在外围搜寻，仍折损一名同伴，带回几块残破灵矿。",
          type: "danger",
          apply: (s) => {
            if (deadlyRoll(s, 18)) return die(s, "外围禁制突然爆裂，你被血雾吞没。");
            add(s, { health: -22, dao: 3, spiritStones: 70, mind: -4 });
          }
        },
        {
          label: "临阵退出",
          hint: "保命，损心境",
          result: "你在入口前退了出来。同行者有人讥笑你胆怯，但三日后，归来的只有两人。",
          type: "",
          apply: (s) => add(s, { mind: -3, worldliness: 1 })
        }
      ]
    },
    {
      title: "古修洞府",
      text: "一座古修洞府现世，门前有残阵护持。破阵需赌悟性，也需赌命。",
      choices: [
        {
          label: "强行破阵",
          hint: "极危险，机缘大",
          result: "阵光如刀，你以血开路，终于摸到洞府石匣。",
          type: "danger",
          apply: (s) => {
            if (deadlyRoll(s, 45)) return die(s, "阵光贯穿眉心，你的修行止于此地。");
            add(s, { health: -38, dao: 10, insight: 1, cultivation: 90 });
            if (!s.inventory.includes("古修玉简")) s.inventory.push("古修玉简");
          }
        },
        {
          label: "请阵师同行",
          hint: "花灵石买安全",
          result: "阵师分走大半收获，但你至少活着带回了玉简残页。",
          type: "gold",
          apply: (s) => add(s, { spiritStones: -90, dao: 5, cultivation: 42, health: -8 })
        },
        {
          label: "卖出消息",
          hint: "保守赚钱",
          result: "你将洞府消息卖给商会，换得灵石，也避开一场杀局。",
          type: "gold",
          apply: (s) => add(s, { spiritStones: 110, worldliness: 2, mind: 2 })
        }
      ]
    },
    {
      title: "妖潮防线",
      text: "边城妖潮爆发，宗门征召散修守城。城墙下妖影如海，退一步便是万家灯火。",
      choices: [
        {
          label: "死守城头",
          hint: "高战功，高死亡",
          result: "你守到天明，身边同道换了一批又一批。",
          type: "danger",
          apply: (s) => {
            if (deadlyRoll(s, 36)) return die(s, "妖潮冲破城头，你被兽群淹没。");
            add(s, { health: -34, power: 12, worldliness: 5, spiritStones: 95, dao: 3 });
          }
        },
        {
          label: "护送百姓",
          hint: "尘缘高，收益稳",
          result: "你护送百姓撤离，未得多少战功，却在哭声中明白了何为红尘。",
          type: "gold",
          apply: (s) => add(s, { worldliness: 8, mind: 8, dao: 3, health: -12 })
        },
        {
          label: "借故离城",
          hint: "活命，损道心",
          result: "你离城三十里，仍能听见战鼓。此后数年，你常在梦中回到那夜。",
          type: "danger",
          apply: (s) => add(s, { mind: -12, seclusionFatigue: 2 })
        }
      ]
    }
  ],
  social: [
    {
      title: "散修论道",
      text: "一位落魄散修邀你煮茶论道。他言辞锋利，句句直指你修行中的短处。",
      choices: [
        {
          label: "虚心请教",
          hint: "心境与悟性",
          result: "你放下颜面请教，对方反而倾囊相授。",
          type: "gold",
          apply: (s) => add(s, { mind: 10, insight: 1, dao: 1, seclusionFatigue: -2 })
        },
        {
          label: "据理争辩",
          hint: "悟道与战力",
          result: "你二人争到天明，虽不相服，却各有所得。",
          type: "",
          apply: (s) => add(s, { dao: 2, power: 2, mind: -2 })
        },
        {
          label: "赠茶结缘",
          hint: "尘缘",
          result: "你不争高下，只赠他一包灵茶。数年后，他托人还你一份人情。",
          type: "gold",
          apply: (s) => add(s, { worldliness: 3, mind: 4, spiritStones: -10 })
        }
      ]
    },
    {
      title: "宗门小比",
      text: "宗门小比将开。你的对手境界相仿，但剑势凌厉，名声在外。",
      choices: [
        {
          label: "全力争胜",
          hint: "高战力，可能受伤",
          result: "你全力出手，虽险胜半招，却被剑气伤了经脉。",
          type: "danger",
          apply: (s) => add(s, { power: 8, health: -10, worldliness: 1 })
        },
        {
          label: "以守代攻",
          hint: "心境与悟道",
          result: "你守到最后一刻才认负，反倒看清了自身破绽。",
          type: "gold",
          apply: (s) => add(s, { mind: 6, dao: 2, power: 2 })
        },
        {
          label: "赛前弃权",
          hint: "避险，损名声",
          result: "你称病弃权，保住气血，却被几名同门暗中讥笑。",
          type: "",
          apply: (s) => add(s, { health: 4, mind: -3 })
        }
      ]
    },
    {
      title: "采药少女",
      text: "山雨将至，你看见一名采药少女失足坠崖，藤蔓已快断裂。",
      choices: [
        {
          label: "冒险相救",
          hint: "得红尘缘，可能受伤",
          result: "你纵身跃下救人，手臂被岩石划伤。她后来常送灵药入山。",
          type: "gold",
          apply: (s) => {
            if (!s.traits.includes("红尘缘")) s.traits.push("红尘缘");
            add(s, { pills: 1, mind: 5, worldliness: 3, health: -6, seclusionFatigue: -1 });
          }
        },
        {
          label: "以法术牵引",
          hint: "消耗修为，稳妥",
          result: "你以灵力化索将她拉回山道，虽耗气不少，却无伤大雅。",
          type: "gold",
          apply: (s) => add(s, { cultivation: -18, worldliness: 2, mind: 4 })
        },
        {
          label: "呼人相助",
          hint: "低风险低收益",
          result: "你唤来山民合力施救。众人谢你机警。",
          type: "",
          apply: (s) => add(s, { worldliness: 1, mind: 2 })
        }
      ]
    },
    {
      title: "藏经楼旧卷",
      text: "藏经楼长老让你整理旧卷。尘封书架上，有功法注疏，也有前人游记。",
      choices: [
        {
          label: "研读功法注疏",
          hint: "悟性与修为",
          result: "你补足许多修炼常识，往日疑难豁然开朗。",
          type: "gold",
          apply: (s) => add(s, { insight: 1, cultivation: 24, spiritStones: -8 })
        },
        {
          label: "翻阅前人游记",
          hint: "悟道与尘缘",
          result: "你读到一位前辈入世百年的见闻，心中多了许多山外山。",
          type: "gold",
          apply: (s) => add(s, { dao: 2, worldliness: 2, mind: 3 })
        }
      ]
    }
  ]
};

const choiceBlueprints = {
  travel: [
    {
      style: "risk",
      labels: ["冒险深入", "近前查探", "以身试险"],
      hints: ["机缘较高，也可能受伤", "赌福缘与气血", "可能悟道，也可能惹祸"],
      results: ["你压下惧意继续向前，果然见到常人难遇的一线机缘。", "你踏入险地，虽有所得，却也付出不小代价。"],
      effect: () => ({ cultivation: roll(18, 48), dao: roll(1, 4), health: -roll(8, 24) }),
      death: () => roll(4, 14)
    },
    {
      style: "observe",
      labels: ["先观其变", "记下异象", "绕行探查"],
      hints: ["收益较稳，风险较低", "偏向悟道与心境", "不贪不躁"],
      results: ["你没有贸然出手，只在远处观察许久，反倒看出几分门道。", "你避开最凶险处，取走了边缘的一点机缘。"],
      effect: () => ({ dao: roll(1, 3), mind: roll(1, 5), health: -roll(0, 6) }),
      death: () => roll(0, 4)
    },
    {
      style: "wealth",
      labels: ["取可售之物", "搜寻灵材", "换作灵石"],
      hints: ["偏向灵石收益", "收益现实，悟道较少", "可能损心境"],
      results: ["你没有执着玄妙机缘，而是取走能在坊市卖价的灵材。", "你算清利害，带回一批能换灵石的杂物。"],
      effect: () => ({ spiritStones: roll(28, 95), worldliness: roll(0, 2), mind: -roll(0, 4) }),
      death: () => roll(0, 5)
    },
    {
      style: "retreat",
      labels: ["及时退走", "不沾因果", "转身离去"],
      hints: ["保命为先", "收益低，但稳", "适合状态差时"],
      results: ["你最终没有伸手。多年后想起，仍不知这是错过机缘，还是避过死劫。", "你离开此地，心中虽有不甘，却保住了清明。"],
      effect: () => ({ mind: roll(2, 7), seclusionFatigue: -roll(1, 2) }),
      death: () => 0
    }
  ],
  dungeon: [
    {
      style: "deep",
      labels: ["深入核心", "追逐重宝", "赌命破局"],
      hints: ["极高风险，可能身死道消", "高回报，高死亡", "适合亡命之徒"],
      results: ["你选择最凶险的道路。禁制、妖影与人心一并压来，能活着出来已非易事。", "你拼尽一切闯入核心，所得足以令人眼红，代价也几乎要了你的命。"],
      effect: () => ({ cultivation: roll(60, 150), dao: roll(5, 14), spiritStones: roll(80, 220), health: -roll(28, 58), mind: -roll(4, 12) }),
      death: () => roll(34, 68)
    },
    {
      style: "team",
      labels: ["结伴稳进", "守住队形", "分工探路"],
      hints: ["仍有危险，但更可控", "收益中等", "看战力与福缘"],
      results: ["你们彼此照应，虽有人受伤，总算带着收获撤出险地。", "队伍几次险些崩散，最终靠着谨慎保住大半人手。"],
      effect: () => ({ cultivation: roll(28, 82), dao: roll(2, 7), spiritStones: roll(36, 130), health: -roll(12, 34), worldliness: roll(1, 4) }),
      death: () => roll(12, 32)
    },
    {
      style: "rescue",
      labels: ["救援同道", "护送伤者", "断后撤离"],
      hints: ["尘缘和心境较高，收益不稳", "有死亡风险", "偏正道选择"],
      results: ["你放弃了最显眼的宝物，转身救人。许多人记住了你的名字。", "你为他人断后，几乎被困死在秘境深处。"],
      effect: () => ({ worldliness: roll(4, 10), mind: roll(5, 12), dao: roll(1, 5), health: -roll(16, 42), spiritStones: roll(0, 70) }),
      death: () => roll(16, 38)
    },
    {
      style: "withdraw",
      labels: ["守在外围", "见好就收", "提前撤离"],
      hints: ["低收益，低死亡", "适合保命", "不会太亏"],
      results: ["你只在外围搜寻，错过核心重宝，却也避开了最惨烈的杀局。", "你在危险变味前撤出，带回少量收获。"],
      effect: () => ({ spiritStones: roll(20, 80), dao: roll(0, 3), health: -roll(4, 16), mind: roll(0, 4) }),
      death: () => roll(2, 10)
    }
  ],
  social: [
    {
      style: "humble",
      labels: ["虚心请教", "执弟子礼", "听其高论"],
      hints: ["心境与悟性", "稳健成长", "可能花费灵石"],
      results: ["你放下架子认真请教，对方见你诚恳，也愿多说几句。", "一番交谈后，你发现自己过去许多执念都太窄了。"],
      effect: () => ({ mind: roll(5, 12), insight: roll(0, 1), dao: roll(1, 3), spiritStones: -roll(0, 20), seclusionFatigue: -roll(1, 2) }),
      death: () => 0
    },
    {
      style: "argue",
      labels: ["据理争辩", "试其锋芒", "以道相辩"],
      hints: ["可能悟道，也可能伤心境", "偏激进", "收益波动"],
      results: ["你们争得面红耳赤，离席时仍互不相服，却都记下了对方一句话。", "争辩像一场无形斗法，你赢了气势，也失了几分平和。"],
      effect: () => ({ dao: roll(1, 5), power: roll(0, 4), mind: -roll(0, 6), worldliness: roll(0, 2) }),
      death: () => 0
    },
    {
      style: "favor",
      labels: ["结下一份人情", "赠礼交好", "帮其解围"],
      hints: ["尘缘较高，消耗资源", "后劲更好", "偏人情世故"],
      results: ["你没有只算眼前得失，而是结下一份人情。修行路远，人情有时也是护身符。", "你出手解围，对方没有多言，只郑重记下你的名字。"],
      effect: () => ({ worldliness: roll(3, 8), mind: roll(2, 7), spiritStones: -roll(10, 45), luck: roll(0, 1) }),
      death: () => 0
    },
    {
      style: "cold",
      labels: ["置身事外", "少沾因果", "冷眼旁观"],
      hints: ["少风险，少收益", "可能损心境", "偏独行"],
      results: ["你没有插手旁人的事。因果少了，心中却未必轻松。", "你选择旁观，事情很快过去，只留下一点说不清的沉默。"],
      effect: () => ({ mind: -roll(0, 4), seclusionFatigue: roll(0, 1), cultivation: roll(0, 16) }),
      death: () => 0
    }
  ]
};

const defaultState = {
  name: "青玄",
  age: 16,
  realm: 0,
  cultivation: 0,
  life: 70,
  health: 100,
  mind: 55,
  talent: 6,
  insight: 5,
  dao: 0,
  worldliness: 0,
  seclusionFatigue: 0,
  luck: 5,
  power: 12,
  spiritStones: 30,
  pills: 0,
  breakPills: {},
  goods: {},
  marketTrend: 0,
  traits: [],
  inventory: [],
  pendingChoice: null,
  log: [],
  ended: false
};

let state = normalizeState(load());
let selectedOrigin = origins[0].id;

const $ = (id) => document.getElementById(id);

function add(target, patch) {
  Object.entries(patch).forEach(([key, value]) => {
    target[key] += value;
  });
  target.health = clamp(target.health, 0, 100);
  target.mind = clamp(target.mind, 0, 100);
  target.dao = Math.max(0, target.dao);
  target.worldliness = Math.max(0, target.worldliness);
  target.seclusionFatigue = clamp(target.seclusionFatigue, 0, 10);
  target.spiritStones = Math.max(0, target.spiritStones);
  target.cultivation = Math.max(0, target.cultivation);
}

function addBreakPill(pillId, amount = 1) {
  state.breakPills[pillId] = (state.breakPills[pillId] ?? 0) + amount;
}

function removeBreakPill(pillId) {
  if (!state.breakPills[pillId]) return;
  state.breakPills[pillId] -= 1;
  if (state.breakPills[pillId] <= 0) delete state.breakPills[pillId];
}

function addGood(goodId, amount = 1) {
  state.goods[goodId] = (state.goods[goodId] ?? 0) + amount;
}

function removeGood(goodId, amount = 1) {
  if (!state.goods[goodId]) return 0;
  const removed = Math.min(state.goods[goodId], amount);
  state.goods[goodId] -= removed;
  if (state.goods[goodId] <= 0) delete state.goods[goodId];
  return removed;
}

function goodById(goodId) {
  return tradeGoods.find((item) => item.id === goodId);
}

function marketPrice(good) {
  const realmBonus = 1 + state.realm * 0.08;
  const trend = 1 + state.marketTrend * 0.06;
  const socialBonus = 1 + Math.min(0.18, state.worldliness * 0.006);
  return Math.max(1, Math.floor(good.basePrice * realmBonus * trend * socialBonus));
}

function refreshMarketTrend() {
  if (roll(1, 100) <= 35) state.marketTrend = clamp(state.marketTrend + roll(-1, 1), -3, 3);
}

function marketLabel() {
  if (state.marketTrend >= 2) return "高涨";
  if (state.marketTrend <= -2) return "低迷";
  return "平稳";
}

function goodsCount() {
  return Object.values(state.goods).reduce((sum, amount) => sum + amount, 0);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function roll(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function realm() {
  return realms[state.realm];
}

function nextRealm() {
  return realms[state.realm + 1];
}

function targetRealmIndex() {
  return state.realm + 1;
}

function pillsForTarget(targetIndex = targetRealmIndex()) {
  return breakthroughPills.filter((pill) => pill.targetRealm === targetIndex);
}

function ownedPillsForTarget(targetIndex = targetRealmIndex()) {
  return pillsForTarget(targetIndex)
    .filter((pill) => (state.breakPills[pill.id] ?? 0) > 0)
    .sort((a, b) => b.bonus - a.bonus);
}

function bestBreakPillForTarget() {
  return ownedPillsForTarget()[0] ?? null;
}

function baseBreakChance() {
  return clamp(Math.floor(
    8 +
    state.mind * 0.12 +
    state.luck * 0.7 +
    state.insight * 0.65 +
    state.worldliness * 0.25 -
    state.seclusionFatigue * 5 -
    state.realm * 6
  ), 5, 75);
}

function breakthroughChance(pill = bestBreakPillForTarget()) {
  return clamp(baseBreakChance() + (pill?.bonus ?? 0), 5, 90);
}

function pickMarketPill() {
  const options = pillsForTarget();
  if (!options.length) return null;
  const rare = options.find((pill) => pill.rare);
  if (rare && roll(1, 100) <= 18 + state.luck * 2 + state.worldliness) return rare;
  return options.find((pill) => !pill.rare) ?? options[0];
}

function maybeFindBreakthroughPill(kind) {
  if (!nextRealm()) return "";
  const chanceMap = { travel: 10, social: 6, dungeon: 20 };
  const chance = (chanceMap[kind] ?? 0) + Math.floor(state.luck / 2);
  if (roll(1, 100) > chance) return "";
  const pill = pickMarketPill();
  if (!pill) return "";
  addBreakPill(pill.id);
  return ` 你还意外得了一枚「${pill.name}」，下次冲击${nextRealm().name}可增加 ${pill.bonus}% 成功率。`;
}

function maybeFindTradeLoot(kind) {
  const pools = {
    travel: [
      ["spiritHerb", 38],
      ["spiritOre", 18],
      ["manual", 10]
    ],
    dungeon: [
      ["beastCore", 42],
      ["spiritOre", 34],
      ["formationShard", 18],
      ["rareManual", 8]
    ],
    social: [
      ["manual", 16],
      ["spiritHerb", 12]
    ]
  };
  const found = [];
  (pools[kind] ?? []).forEach(([goodId, chance]) => {
    if (roll(1, 100) <= chance + Math.floor(state.luck / 3)) {
      const amount = goodId === "spiritHerb" ? roll(1, 3) : 1;
      addGood(goodId, amount);
      found.push(`${goodById(goodId).name} x${amount}`);
    }
  });
  return found.length ? ` 你还带回了${found.join("、")}。` : "";
}

function log(text, type = "") {
  state.log.push({
    year: state.age,
    text,
    type
  });
  state.log = state.log.slice(-80);
}

function passYears(years) {
  state.age += years;
  state.health = clamp(state.health + roll(-3, 2), 0, 100);
  refreshMarketTrend();
  if (state.age >= state.life || state.health <= 0) {
    state.ended = true;
    log(`你于 ${state.age} 岁坐化。回望此生，止步于${realm().name}。`, "danger");
  }
}

function doAction(action) {
  if (!state || state.ended) return;
  if (state.pendingChoice) {
    log("眼前机缘未决，你需先作出选择。", "danger");
    render();
    return;
  }

  if (action === "cultivate") {
    const gain = gainCultivation("cultivate");
    state.mind = clamp(state.mind + roll(-2, 3), 0, 100);
    add(state, { seclusionFatigue: -1 });
    passYears(1);
    log(`你静坐吐纳一年，炼化天地灵气，修为增长 ${gain}。`);
  }

  if (action === "travel") {
    passYears(1);
    if (state.ended) {
      save();
      render();
      return;
    }
    const baseGain = gainCultivation("travel");
    openEncounter("travel", baseGain);
  }

  if (action === "dungeon") {
    passYears(1);
    if (state.ended) {
      save();
      render();
      return;
    }
    const baseGain = gainCultivation("dungeon");
    openEncounter("dungeon", baseGain);
  }

  if (action === "seclude") {
    const years = 10;
    const fatiguePenalty = state.seclusionFatigue * 34;
    const gain = Math.max(30, roll(95, 170) + state.talent * 12 + state.insight * 7 - fatiguePenalty);
    state.cultivation += gain;
    state.mind -= roll(10, 24) + state.seclusionFatigue * 2;
    state.health -= state.mind < 25 ? roll(12, 28) + state.seclusionFatigue * 2 : roll(0, 8);
    state.seclusionFatigue = clamp(state.seclusionFatigue + 3, 0, 10);
    passYears(years);
    log(`你封山闭关十年，修为增长 ${gain}。${state.seclusionFatigue >= 6 ? "久不履尘世，道心渐滞。" : ""}${state.mind < 25 ? "心魔暗生，气血大损。" : ""}`, state.mind < 25 || state.seclusionFatigue >= 6 ? "danger" : "");
  }

  if (action === "social") {
    passYears(1);
    if (state.ended) {
      save();
      render();
      return;
    }
    const baseGain = gainCultivation("social");
    openEncounter("social", baseGain);
  }

  if (action === "breakthrough") {
    attemptBreakthrough();
  }

  checkRandomCalamity();
  save();
  render();
}

function openEncounter(kind, baseGain = 0) {
  const index = roll(0, encounters[kind].length - 1);
  const event = encounters[kind][index];
  state.pendingChoice = {
    kind,
    title: event.title,
    text: event.text,
    choices: generateChoices(kind)
  };
  if (kind === "travel") add(state, { seclusionFatigue: -1 });
  const gainText = baseGain > 0 ? `一路行止亦是修行，修为增长 ${baseGain}。` : "";
  log(`你遇见了「${event.title}」。${event.text}${gainText}`, "gold");
}

function chooseOption(index) {
  const event = getPendingEncounter();
  if (!event || state.ended) return;
  const choice = event.choices[index];
  if (!choice) return;
  const practiceGain = applyChoice(choice);
  const foundPillText = maybeFindBreakthroughPill(event.kind);
  const lootText = maybeFindTradeLoot(event.kind);
  const gainText = practiceGain > 0 ? ` 此番经历令你修为增长 ${practiceGain}。` : "";
  log(`${choice.result}${gainText}${foundPillText}${lootText}`, choice.type);
  state.pendingChoice = null;
  if (state.ended) {
    save();
    render();
    return;
  }
  checkRandomCalamity();
  save();
  render();
}

function getPendingEncounter() {
  if (!state?.pendingChoice) return null;
  if (state.pendingChoice.choices) return state.pendingChoice;
  return null;
}

function generateChoices(kind) {
  const pool = [...choiceBlueprints[kind]];
  const count = kind === "dungeon" ? 3 : roll(2, 3);
  const choices = [];

  while (choices.length < count && pool.length) {
    const blueprint = pool.splice(roll(0, pool.length - 1), 1)[0];
    choices.push(materializeChoice(blueprint));
  }

  return choices;
}

function materializeChoice(blueprint) {
  return {
    label: pick(blueprint.labels),
    hint: pick(blueprint.hints),
    result: pick(blueprint.results),
    type: blueprint.style === "deep" || blueprint.style === "risk" ? "danger" : blueprint.style === "withdraw" ? "" : "gold",
    effects: blueprint.effect(),
    deathChance: blueprint.death()
  };
}

function applyChoice(choice) {
  if (choice.deathChance && deadlyRoll(state, choice.deathChance)) {
    die(state, "你终究没能扛过这场劫数。修行路上，从不缺无名白骨。");
    return 0;
  }
  add(state, choice.effects);
  return gainCultivation("choice", choice);
}

function gainCultivation(source, choice = null) {
  const realmFactor = 1 + state.realm * 0.42;
  const talentPart = state.talent * (source === "cultivate" ? 2 : 1);
  const insightPart = Math.ceil(state.insight * 0.7);
  let gain = 0;

  if (source === "cultivate") {
    gain = roll(9, 18) + talentPart + insightPart;
  }

  if (source === "travel") {
    gain = roll(5, 12) + Math.ceil(talentPart / 2);
  }

  if (source === "dungeon") {
    gain = roll(12, 28) + state.power + Math.ceil(state.luck / 2);
  }

  if (source === "social") {
    gain = roll(2, 8) + Math.ceil(state.insight / 2);
  }

  if (source === "choice" && choice) {
    const dangerBonus = Math.floor((choice.deathChance ?? 0) / 6);
    const injuryBonus = Math.floor(Math.abs(Math.min(0, choice.effects.health ?? 0)) / 6);
    const daoBonus = Math.max(0, choice.effects.dao ?? 0) * 3;
    const combatBonus = Math.max(0, choice.effects.power ?? 0) * 2;
    gain = roll(3, 10) + dangerBonus + injuryBonus + daoBonus + combatBonus;
  }

  gain = Math.max(1, Math.floor(gain * realmFactor));
  state.cultivation += gain;
  return gain;
}

function attemptBreakthrough() {
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
  const chance = breakthroughChance(pill);
  const success = roll(1, 100) <= chance;
  if (pill) removeBreakPill(pill.id);
  passYears(1);
  const pillText = pill ? `你服下「${pill.name}」，破境成功率提升 ${pill.bonus}%，此番成功率为 ${chance}%。` : `未得破境丹护持，此番成功率仅 ${chance}%。`;

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
  } else {
    state.cultivation = Math.floor(state.cultivation * 0.62);
    state.health -= roll(24, 48);
    state.mind -= roll(10, 22);
    state.seclusionFatigue = clamp(state.seclusionFatigue + 2, 0, 10);
    if (state.health <= 0 || roll(1, 100) <= 8 + state.realm * 3) {
      die(state, `${pillText} 冲关失败，灵气倒卷，经脉寸断，你没能撑过这场大劫。`);
      return;
    }
    log(`${pillText} 冲关失败，灵气倒卷，经脉如焚。你勉强保住根基。`, "danger");
  }
}

function checkRandomCalamity() {
  if (state.ended) return;
  const chance = 9 + state.realm * 3 + state.seclusionFatigue - state.luck;
  if (roll(1, 100) <= chance) {
    state.health -= roll(8, 18);
    state.mind -= roll(3, 8);
    log("夜半心魔入梦，前尘旧事化作劫火。", "danger");
  }
  if (state.health <= 0) {
    state.ended = true;
    log(`你伤势过重，未能熬过这一劫。`, "danger");
  }
}

function deadlyRoll(s, baseChance) {
  const adjusted = baseChance + s.realm * 4 - s.power * 0.35 - s.luck * 0.7 - Math.floor(s.health / 20);
  return roll(1, 100) <= clamp(Math.floor(adjusted), 5, 85);
}

function die(s, text) {
  s.health = 0;
  s.ended = true;
  log(text, "danger");
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function startLife() {
  const origin = origins.find((item) => item.id === selectedOrigin);
  state = JSON.parse(JSON.stringify(defaultState));
  state.name = $("nameInput").value.trim() || "无名";
  Object.assign(state, applyPatch(state, origin.patch));
  state.traits.push(origin.name);
  log(`你生于${origin.name}，十六岁那年，于破庙中拾得半卷《归尘经》。`, "gold");
  save();
  render();
}

function applyPatch(base, patch) {
  const next = { ...base };
  Object.entries(patch).forEach(([key, value]) => {
    next[key] += value;
  });
  return next;
}

function save() {
  if (state) localStorage.setItem("xianxia-life-save", JSON.stringify(state));
}

function load() {
  try {
    return JSON.parse(localStorage.getItem("xianxia-life-save"));
  } catch {
    return null;
  }
}

function normalizeState(saved) {
  if (!saved) return null;
  return {
    ...JSON.parse(JSON.stringify(defaultState)),
    ...saved,
    traits: saved.traits ?? [],
    inventory: saved.inventory ?? [],
    breakPills: saved.breakPills ?? {},
    goods: saved.goods ?? {},
    marketTrend: saved.marketTrend ?? 0,
    pendingChoice: saved.pendingChoice?.choices ? saved.pendingChoice : null,
    log: saved.log ?? []
  };
}

function reset() {
  localStorage.removeItem("xianxia-life-save");
  state = null;
  render();
}

function renderOrigins() {
  $("originGrid").innerHTML = origins.map((origin) => `
    <button class="origin ${origin.id === selectedOrigin ? "active" : ""}" data-origin="${origin.id}" type="button">
      <strong>${origin.name}</strong>
      <span>${origin.desc}</span>
    </button>
  `).join("");

  document.querySelectorAll("[data-origin]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedOrigin = button.dataset.origin;
      renderOrigins();
    });
  });
}

function render() {
  renderOrigins();

  $("creation").classList.toggle("hidden", !!state);
  $("game").classList.toggle("hidden", !state);

  if (!state) return;

  $("heroName").textContent = state.name;
  $("heroTitle").textContent = realm().name;
  $("ageText").textContent = `${state.age} 岁 / 寿元 ${state.life}`;
  $("fateText").textContent = state.ended ? "尘缘已尽" : `${nextRealm()?.name ?? "飞升"}在望`;

  const progress = Math.min(100, Math.floor((state.cultivation / realm().need) * 100));
  $("cultivationBar").style.width = `${progress}%`;
  $("mindBar").style.width = `${state.mind}%`;
  renderBreakNeed();
  renderMarket();

  $("statList").innerHTML = [
    ["境界", realm().name],
    ["修为", `${state.cultivation}/${realm().need}`],
    ["气血", state.health],
    ["心境", state.mind],
    ["悟道", `${state.dao}/${realm().insightNeed}`]
  ].map(([label, value]) => `<div class="stat"><span>${label}</span><strong>${value}</strong></div>`).join("");

  $("resourceGrid").innerHTML = [
    ["资质", state.talent],
    ["悟性", state.insight],
    ["福缘", state.luck],
    ["战力", state.power],
    ["灵石", state.spiritStones],
    ["清心丹", state.pills],
    ["破境丹", Object.values(state.breakPills).reduce((sum, amount) => sum + amount, 0)],
    ["货品", goodsCount()],
    ["尘缘", state.worldliness],
    ["行情", marketLabel()],
    ["闭关疲惫", state.seclusionFatigue]
  ].map(([label, value]) => `<div class="resource"><span>${label}</span><strong>${value}</strong></div>`).join("");

  $("actions").innerHTML = actionDefs.map((action) => `
    <button data-action="${action.id}" type="button" ${state.ended ? "disabled" : ""}>
      ${action.name}<br><small>${action.desc}</small>
    </button>
  `).join("");

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => doAction(button.dataset.action));
  });
  renderChoicePanel();

  $("log").innerHTML = state.log.map((entry) => `
    <div class="entry ${entry.type}">
      <strong>${entry.year}岁</strong> ${entry.text}
    </div>
  `).join("");
  $("log").scrollTop = $("log").scrollHeight;

  $("traits").innerHTML = state.traits.length
    ? state.traits.map((trait) => `<span class="pill">${trait}</span>`).join("")
    : `<span class="pill">暂无</span>`;

  const breakPillItems = breakthroughPills
    .filter((pill) => (state.breakPills[pill.id] ?? 0) > 0)
    .map((pill) => `<span class="pill">${pill.name} x${state.breakPills[pill.id]} (+${pill.bonus}%)</span>`);
  const inventoryItems = [
    ...state.inventory.map((item) => `<span class="pill">${item}</span>`),
    ...breakPillItems
  ];
  $("inventory").innerHTML = inventoryItems.length ? inventoryItems.join("") : `<span class="pill">空空如也</span>`;
}

function renderMarket() {
  if (!$("marketPanel")) return;
  const goodsRows = tradeGoods
    .filter((good) => (state.goods[good.id] ?? 0) > 0)
    .map((good) => {
      const amount = state.goods[good.id];
      const price = marketPrice(good);
      return `<div class="market-row">
        <div><strong>${good.name} x${amount}</strong><span>${good.desc}</span></div>
        <div class="market-actions">
          <button data-sell-good="${good.id}" type="button">卖1 ${price}</button>
          ${amount > 1 ? `<button data-sell-good-all="${good.id}" type="button">全卖 ${price * amount}</button>` : ""}
        </div>
      </div>`;
    });
  const pillRows = [
    state.pills > 0 ? `<div class="market-row"><div><strong>清心丹 x${state.pills}</strong><span>回血稳心，可留可卖。</span></div><div class="market-actions"><button data-sell-pill="qingxin" type="button">卖1 45</button>${state.pills > 1 ? `<button data-sell-pill-all="qingxin" type="button">全卖 ${state.pills * 45}</button>` : ""}</div></div>` : "",
    ...breakthroughPills
      .filter((pill) => (state.breakPills[pill.id] ?? 0) > 0)
      .map((pill) => {
        const amount = state.breakPills[pill.id];
        const price = Math.floor(pill.cost * 0.62);
        return `<div class="market-row"><div><strong>${pill.name} x${amount}</strong><span>冲击${realms[pill.targetRealm].name} +${pill.bonus}%。</span></div><div class="market-actions"><button data-sell-break-pill="${pill.id}" type="button">卖1 ${price}</button>${amount > 1 ? `<button data-sell-break-pill-all="${pill.id}" type="button">全卖 ${price * amount}</button>` : ""}</div></div>`;
      })
  ].filter(Boolean);
  const rows = [...goodsRows, ...pillRows];
  $("marketPanel").innerHTML = rows.length
    ? `<div class="market-note">今日行情：${marketLabel()}，尘缘越高越会讲价。</div>${rows.join("")}`
    : `<div class="market-empty">暂无可售货品。外出、秘境、论道可获得灵草、内丹、残卷等。</div>`;
}

function renderChoicePanel() {
  const choice = getPendingEncounter();
  $("choicePanel").classList.toggle("hidden", !choice);
  if (!choice) {
    $("choiceTitle").textContent = "";
    $("choiceText").textContent = "";
    $("choiceOptions").innerHTML = "";
    return;
  }

  $("choiceTitle").textContent = choice.title;
  $("choiceText").textContent = choice.text;
  $("choiceOptions").innerHTML = choice.choices.map((item, index) => `
    <button data-choice="${index}" type="button">
      <strong>${item.label}</strong><br><small>${item.hint}</small>
    </button>
  `).join("");
}

function renderBreakNeed() {
  const current = realm();
  const target = nextRealm();
  if (!target) {
    $("breakNeed").innerHTML = `<div class="need-line ok"><span>前路</span><strong>可问飞升</strong></div>`;
    return;
  }

  const items = [
    ["修为", state.cultivation, current.need],
    ["心境", state.mind, current.mindNeed],
    ["悟道", state.dao, current.insightNeed]
  ];

  const needHtml = items.map(([label, value, need]) => {
    const ok = value >= need;
    return `<div class="need-line ${ok ? "ok" : "bad"}"><span>${label}</span><strong>${value}/${need}</strong></div>`;
  }).join("");
  const pill = bestBreakPillForTarget();
  const pillName = pill ? `${pill.name} +${pill.bonus}%` : "无";
  $("breakNeed").innerHTML = `${needHtml}
    <div class="need-line"><span>基础成功率</span><strong>${baseBreakChance()}%</strong></div>
    <div class="need-line ${pill ? "ok" : "bad"}"><span>可用破境丹</span><strong>${pillName}</strong></div>
    <div class="need-line ${pill ? "ok" : ""}"><span>本次预估</span><strong>${breakthroughChance(pill)}%</strong></div>`;
}

function sellGood(goodId, amount = 1) {
  const good = goodById(goodId);
  if (!good || !state.goods[goodId]) return;
  const price = marketPrice(good);
  const sold = removeGood(goodId, amount);
  add(state, { spiritStones: price * sold, worldliness: Math.ceil(sold / 2) });
  log(`你在交易行售出「${good.name}」x${sold}，得 ${price * sold} 灵石。`, "gold");
  save();
  render();
}

function sellQingxinPill(amount = 1) {
  if (state.pills <= 0) {
    log("你并无多余清心丹可卖。", "danger");
    render();
    return;
  }
  const sold = Math.min(state.pills, amount);
  state.pills -= sold;
  add(state, { spiritStones: sold * 45, worldliness: Math.ceil(sold / 2) });
  log(`你售出清心丹 x${sold}，得 ${sold * 45} 灵石。`, "gold");
  save();
  render();
}

function sellBreakPill(pillId, amount = 1) {
  const pill = breakthroughPills.find((item) => item.id === pillId);
  if (!pill || !state.breakPills[pillId]) return;
  const price = Math.floor(pill.cost * 0.62);
  const sold = Math.min(state.breakPills[pillId], amount);
  for (let index = 0; index < sold; index += 1) removeBreakPill(pillId);
  add(state, { spiritStones: price * sold, worldliness: Math.ceil(sold / 2) });
  log(`你售出「${pill.name}」x${sold}，得 ${price * sold} 灵石。`, "gold");
  save();
  render();
}

function studyManual() {
  if (removeGood("rareManual")) {
    if (roll(1, 100) <= 22 + state.insight * 2) {
      add(state, { dao: 6, insight: 1, mind: 4 });
      log("你参悟古修功法，险些迷失，却终于窥见一线大道。悟道大涨，悟性也有所提升。", "gold");
    } else {
      add(state, { mind: -12, health: -8, dao: 2 });
      log("古修功法晦涩偏激，你强行参悟，心神震荡，所幸仍有些许所得。", "danger");
    }
    save();
    render();
    return;
  }
  if (removeGood("manual")) {
    add(state, { dao: roll(1, 3), mind: roll(1, 4) });
    log("你焚香静坐，参悟一卷功法残卷，心中疑难散去少许。", "gold");
    save();
    render();
    return;
  }
  log("你没有可参悟的功法残卷。", "danger");
  render();
}

$("startBtn").addEventListener("click", startLife);
$("saveBtn").addEventListener("click", () => {
  save();
  if (state) {
    log("你将此生所得录入玉简，待来日重读。", "gold");
    render();
  }
});
$("newLifeBtn").addEventListener("click", reset);
$("clearLogBtn").addEventListener("click", () => {
  if (!state) return;
  state.log = [];
  save();
  render();
});
$("choiceOptions").addEventListener("click", (event) => {
  const button = event.target.closest("[data-choice]");
  if (!button) return;
  chooseOption(Number(button.dataset.choice));
});
$("marketPanel").addEventListener("click", (event) => {
  const sellGoodButton = event.target.closest("[data-sell-good]");
  if (sellGoodButton) {
    sellGood(sellGoodButton.dataset.sellGood);
    return;
  }
  const sellGoodAllButton = event.target.closest("[data-sell-good-all]");
  if (sellGoodAllButton) {
    sellGood(sellGoodAllButton.dataset.sellGoodAll, state.goods[sellGoodAllButton.dataset.sellGoodAll]);
    return;
  }
  const sellPillButton = event.target.closest("[data-sell-pill]");
  if (sellPillButton) {
    sellQingxinPill();
    return;
  }
  const sellPillAllButton = event.target.closest("[data-sell-pill-all]");
  if (sellPillAllButton) {
    sellQingxinPill(state.pills);
    return;
  }
  const sellBreakPillButton = event.target.closest("[data-sell-break-pill]");
  if (sellBreakPillButton) {
    sellBreakPill(sellBreakPillButton.dataset.sellBreakPill);
    return;
  }
  const sellBreakPillAllButton = event.target.closest("[data-sell-break-pill-all]");
  if (sellBreakPillAllButton) {
    const pillId = sellBreakPillAllButton.dataset.sellBreakPillAll;
    sellBreakPill(pillId, state.breakPills[pillId]);
  }
});
$("usePillBtn").addEventListener("click", () => {
  if (!state || state.ended) return;
  if (state.pills <= 0) {
    log("你翻遍行囊，并无可用清心丹。", "danger");
    render();
    return;
  }
  state.pills -= 1;
  add(state, { health: 34, mind: 8, seclusionFatigue: -1 });
  log("你服下一枚清心丹，药力化开，气血与心境稍得恢复。", "gold");
  save();
  render();
});
$("buyPillBtn").addEventListener("click", () => {
  if (!state || state.ended) return;
  if (state.spiritStones < 80) {
    log("坊市清心丹昂贵，至少需要 80 灵石。", "danger");
    render();
    return;
  }
  add(state, { spiritStones: -80, pills: 1, worldliness: 1 });
  log("你在坊市购得一枚清心丹，花去 80 灵石。", "gold");
  save();
  render();
});
$("buyBreakPillBtn").addEventListener("click", () => {
  if (!state || state.ended) return;
  if (!nextRealm()) {
    log("你已立于此界巅峰，寻常破境丹再无用处。", "gold");
    render();
    return;
  }
  const pill = pickMarketPill();
  if (!pill) {
    log("今日坊市无适合你的破境丹。", "danger");
    render();
    return;
  }
  if (state.spiritStones < pill.cost) {
    log(`丹铺掌柜取出「${pill.name}」，开价 ${pill.cost} 灵石。你囊中羞涩，只能作罢。`, "danger");
    render();
    return;
  }
  add(state, { spiritStones: -pill.cost, worldliness: 1 });
  addBreakPill(pill.id);
  log(`你花去 ${pill.cost} 灵石，购得一枚「${pill.name}」。冲击${nextRealm().name}时可增加 ${pill.bonus}% 成功率。`, "gold");
  save();
  render();
});
$("studyManualBtn").addEventListener("click", () => {
  if (!state || state.ended) return;
  studyManual();
});
$("restWithStoneBtn").addEventListener("click", () => {
  if (!state || state.ended) return;
  if (state.spiritStones < 30) {
    log("布置调息小阵至少需要 30 灵石。", "danger");
    render();
    return;
  }
  add(state, { spiritStones: -30, mind: 10, health: 8, seclusionFatigue: -2 });
  log("你以灵石布下小聚灵阵，调息一夜，闭关疲惫散去少许。", "gold");
  save();
  render();
});

render();
