"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var scripts_exports = {};
__export(scripts_exports, {
  Scripts: () => Scripts
});
module.exports = __toCommonJS(scripts_exports);
const Scripts = {
  gen: 9,
  init() {
    for (const i in this.data.Items) {
      if (!this.data.Items[i].megaStone)
        continue;
      this.modData("Items", i).onTakeItem = false;
      const id = this.toID(this.data.Items[i].megaStone);
      this.modData("FormatsData", id).isNonstandard = null;
    }
  },
  start() {
    if (this.deserialized)
      return;
    if (!this.sides.every((side) => !!side))
      throw new Error(`Missing sides: ${this.sides}`);
    if (this.started)
      throw new Error(`Battle already started`);
    const format = this.format;
    this.started = true;
    if (this.gameType === "multi") {
      this.sides[1].foe = this.sides[2];
      this.sides[0].foe = this.sides[3];
      this.sides[2].foe = this.sides[1];
      this.sides[3].foe = this.sides[0];
      this.sides[1].allySide = this.sides[3];
      this.sides[0].allySide = this.sides[2];
      this.sides[2].allySide = this.sides[0];
      this.sides[3].allySide = this.sides[1];
      this.sides[2].sideConditions = this.sides[0].sideConditions;
      this.sides[3].sideConditions = this.sides[1].sideConditions;
    } else {
      this.sides[1].foe = this.sides[0];
      this.sides[0].foe = this.sides[1];
      if (this.sides.length > 2) {
        this.sides[2].foe = this.sides[3];
        this.sides[3].foe = this.sides[2];
      }
    }
    for (const side of this.sides) {
      this.add("teamsize", side.id, side.pokemon.length);
    }
    this.add("gen", this.gen);
    this.add("tier", format.name);
    if (this.rated) {
      if (this.rated === "Rated battle")
        this.rated = true;
      this.add("rated", typeof this.rated === "string" ? this.rated : "");
    }
    if (format.onBegin)
      format.onBegin.call(this);
    for (const rule of this.ruleTable.keys()) {
      if ("+*-!".includes(rule.charAt(0)))
        continue;
      const subFormat = this.dex.formats.get(rule);
      if (subFormat.onBegin)
        subFormat.onBegin.call(this);
    }
    for (const pokemon of this.getAllPokemon()) {
      const item = pokemon.getItem();
      if ([
        "adamantcrystal",
        "griseouscore",
        "lustrousglobe",
        "wellspringmask",
        "cornerstonemask",
        "hearthflamemask",
        "vilevial"
      ].includes(item.id) && item.forcedForme !== pokemon.species.name) {
        const rawSpecies = this.actions.getMixedSpecies(pokemon.m.originalSpecies, item.forcedForme, pokemon);
        const species = pokemon.setSpecies(rawSpecies);
        if (!species)
          continue;
        pokemon.baseSpecies = rawSpecies;
        pokemon.details = species.name + (pokemon.level === 100 ? "" : ", L" + pokemon.level) + (pokemon.gender === "" ? "" : ", " + pokemon.gender) + (pokemon.set.shiny ? ", shiny" : "");
        pokemon.ability = this.toID(species.abilities["0"]);
        pokemon.baseAbility = pokemon.ability;
      }
    }
    if (this.sides.some((side) => !side.pokemon[0])) {
      throw new Error("Battle not started: A player has an empty team.");
    }
    if (this.debugMode) {
      this.checkEVBalance();
    }
    if (format.onTeamPreview)
      format.onTeamPreview.call(this);
    for (const rule of this.ruleTable.keys()) {
      if ("+*-!".includes(rule.charAt(0)))
        continue;
      const subFormat = this.dex.formats.get(rule);
      if (subFormat.onTeamPreview)
        subFormat.onTeamPreview.call(this);
    }
    this.queue.addChoice({ choice: "start" });
    this.midTurn = true;
    if (!this.requestState)
      this.go();
  },
  runAction(action) {
    const pokemonOriginalHP = action.pokemon?.hp;
    let residualPokemon = [];
    switch (action.choice) {
      case "start": {
        for (const side of this.sides) {
          if (side.pokemonLeft)
            side.pokemonLeft = side.pokemon.length;
        }
        this.add("start");
        for (const pokemon of this.getAllPokemon()) {
          let rawSpecies = null;
          const item = pokemon.getItem();
          if (item.id === "rustedsword") {
            rawSpecies = this.actions.getMixedSpecies(pokemon.m.originalSpecies, "Zacian-Crowned", pokemon);
          } else if (item.id === "rustedshield") {
            rawSpecies = this.actions.getMixedSpecies(pokemon.m.originalSpecies, "Zamazenta-Crowned", pokemon);
          }
          if (!rawSpecies)
            continue;
          const species = pokemon.setSpecies(rawSpecies);
          if (!species)
            continue;
          pokemon.baseSpecies = rawSpecies;
          pokemon.details = species.name + (pokemon.level === 100 ? "" : ", L" + pokemon.level) + (pokemon.gender === "" ? "" : ", " + pokemon.gender) + (pokemon.set.shiny ? ", shiny" : "");
          pokemon.ability = this.toID(species.abilities["0"]);
          pokemon.baseAbility = pokemon.ability;
          const behemothMove = {
            "Rusted Sword": "behemothblade",
            "Rusted Shield": "behemothbash"
          };
          const ironHead = pokemon.baseMoves.indexOf("ironhead");
          if (ironHead >= 0) {
            const move = this.dex.moves.get(behemothMove[pokemon.getItem().name]);
            pokemon.baseMoveSlots[ironHead] = {
              move: move.name,
              id: move.id,
              pp: move.noPPBoosts || move.isZ ? move.pp : move.pp * 8 / 5,
              maxpp: move.noPPBoosts || move.isZ ? move.pp : move.pp * 8 / 5,
              target: move.target,
              disabled: false,
              disabledSource: "",
              used: false
            };
            pokemon.moveSlots = pokemon.baseMoveSlots.slice();
          }
        }
        if (this.format.onBattleStart)
          this.format.onBattleStart.call(this);
        for (const rule of this.ruleTable.keys()) {
          if ("+*-!".includes(rule.charAt(0)))
            continue;
          const subFormat = this.dex.formats.get(rule);
          if (subFormat.onBattleStart)
            subFormat.onBattleStart.call(this);
        }
        for (const side of this.sides) {
          for (let i = 0; i < side.active.length; i++) {
            if (!side.pokemonLeft) {
              side.active[i] = side.pokemon[i];
              side.active[i].fainted = true;
              side.active[i].hp = 0;
            } else {
              this.actions.switchIn(side.pokemon[i], i);
            }
          }
        }
        for (const pokemon of this.getAllPokemon()) {
          this.singleEvent("Start", this.dex.conditions.getByID(pokemon.species.id), pokemon.speciesState, pokemon);
        }
        this.midTurn = true;
        break;
      }
      case "move":
        if (!action.pokemon.isActive)
          return false;
        if (action.pokemon.fainted)
          return false;
        this.actions.runMove(
          action.move,
          action.pokemon,
          action.targetLoc,
          action.sourceEffect,
          action.zmove,
          void 0,
          action.maxMove,
          action.originalTarget
        );
        break;
      case "megaEvo":
        this.actions.runMegaEvo(action.pokemon);
        break;
      case "runDynamax":
        action.pokemon.addVolatile("dynamax");
        action.pokemon.side.dynamaxUsed = true;
        if (action.pokemon.side.allySide)
          action.pokemon.side.allySide.dynamaxUsed = true;
        break;
      case "terastallize":
        this.actions.terastallize(action.pokemon);
        break;
      case "beforeTurnMove":
        if (!action.pokemon.isActive)
          return false;
        if (action.pokemon.fainted)
          return false;
        this.debug("before turn callback: " + action.move.id);
        const target = this.getTarget(action.pokemon, action.move, action.targetLoc);
        if (!target)
          return false;
        if (!action.move.beforeTurnCallback)
          throw new Error(`beforeTurnMove has no beforeTurnCallback`);
        action.move.beforeTurnCallback.call(this, action.pokemon, target);
        break;
      case "priorityChargeMove":
        if (!action.pokemon.isActive)
          return false;
        if (action.pokemon.fainted)
          return false;
        this.debug("priority charge callback: " + action.move.id);
        if (!action.move.priorityChargeCallback)
          throw new Error(`priorityChargeMove has no priorityChargeCallback`);
        action.move.priorityChargeCallback.call(this, action.pokemon);
        break;
      case "event":
        this.runEvent(action.event, action.pokemon);
        break;
      case "team":
        if (action.index === 0) {
          action.pokemon.side.pokemon = [];
        }
        action.pokemon.side.pokemon.push(action.pokemon);
        action.pokemon.position = action.index;
        return;
      case "pass":
        return;
      case "instaswitch":
      case "switch":
        if (action.choice === "switch" && action.pokemon.status) {
          this.singleEvent("CheckShow", this.dex.abilities.getByID("naturalcure"), null, action.pokemon);
        }
        if (this.actions.switchIn(action.target, action.pokemon.position, action.sourceEffect) === "pursuitfaint") {
          if (this.gen <= 4) {
            this.hint("Previously chosen switches continue in Gen 2-4 after a Pursuit target faints.");
            action.priority = -101;
            this.queue.unshift(action);
            break;
          } else {
            this.hint("A Pokemon can't switch between when it runs out of HP and when it faints");
            break;
          }
        }
        break;
      case "revivalblessing":
        action.pokemon.side.pokemonLeft++;
        if (action.target.position < action.pokemon.side.active.length) {
          this.queue.addChoice({
            choice: "instaswitch",
            pokemon: action.target,
            target: action.target
          });
        }
        action.target.fainted = false;
        action.target.faintQueued = false;
        action.target.subFainted = false;
        action.target.status = "";
        action.target.hp = 1;
        action.target.sethp(action.target.maxhp / 2);
        this.add("-heal", action.target, action.target.getHealth, "[from] move: Revival Blessing");
        action.pokemon.side.removeSlotCondition(action.pokemon, "revivalblessing");
        break;
      case "runUnnerve":
        this.singleEvent("PreStart", action.pokemon.getAbility(), action.pokemon.abilityState, action.pokemon);
        break;
      case "runSwitch":
        this.actions.runSwitch(action.pokemon);
        break;
      case "runPrimal":
        if (!action.pokemon.transformed) {
          this.singleEvent("Primal", action.pokemon.getItem(), action.pokemon.itemState, action.pokemon);
        }
        break;
      case "shift":
        if (!action.pokemon.isActive)
          return false;
        if (action.pokemon.fainted)
          return false;
        this.swapPosition(action.pokemon, 1);
        break;
      case "beforeTurn":
        this.eachEvent("BeforeTurn");
        break;
      case "residual":
        this.add("");
        this.clearActiveMove(true);
        this.updateSpeed();
        residualPokemon = this.getAllActive().map((pokemon) => [pokemon, pokemon.getUndynamaxedHP()]);
        this.residualEvent("Residual");
        this.add("upkeep");
        break;
    }
    for (const side of this.sides) {
      for (const pokemon of side.active) {
        if (pokemon.forceSwitchFlag) {
          if (pokemon.hp)
            this.actions.dragIn(pokemon.side, pokemon.position);
          pokemon.forceSwitchFlag = false;
        }
      }
    }
    this.clearActiveMove();
    this.faintMessages();
    if (this.ended)
      return true;
    if (!this.queue.peek() || this.gen <= 3 && ["move", "residual"].includes(this.queue.peek().choice)) {
      this.checkFainted();
    } else if (action.choice === "megaEvo" && this.gen === 7) {
      this.eachEvent("Update");
      for (const [i, queuedAction] of this.queue.list.entries()) {
        if (queuedAction.pokemon === action.pokemon && queuedAction.choice === "move") {
          this.queue.list.splice(i, 1);
          queuedAction.mega = "done";
          this.queue.insertChoice(queuedAction, true);
          break;
        }
      }
      return false;
    } else if (this.queue.peek()?.choice === "instaswitch") {
      return false;
    }
    if (this.gen >= 5) {
      this.eachEvent("Update");
      for (const [pokemon, originalHP] of residualPokemon) {
        const maxhp = pokemon.getUndynamaxedHP(pokemon.maxhp);
        if (pokemon.hp && pokemon.getUndynamaxedHP() <= maxhp / 2 && originalHP > maxhp / 2) {
          this.runEvent("EmergencyExit", pokemon);
        }
      }
    }
    if (action.choice === "runSwitch") {
      const pokemon = action.pokemon;
      if (pokemon.hp && pokemon.hp <= pokemon.maxhp / 2 && pokemonOriginalHP > pokemon.maxhp / 2) {
        this.runEvent("EmergencyExit", pokemon);
      }
    }
    const switches = this.sides.map(
      (side) => side.active.some((pokemon) => pokemon && !!pokemon.switchFlag)
    );
    for (let i = 0; i < this.sides.length; i++) {
      let reviveSwitch = false;
      if (switches[i] && !this.canSwitch(this.sides[i])) {
        for (const pokemon of this.sides[i].active) {
          if (this.sides[i].slotConditions[pokemon.position]["revivalblessing"]) {
            reviveSwitch = true;
            continue;
          }
          pokemon.switchFlag = false;
        }
        if (!reviveSwitch)
          switches[i] = false;
      } else if (switches[i]) {
        for (const pokemon of this.sides[i].active) {
          if (pokemon.switchFlag && pokemon.switchFlag !== "revivalblessing" && !pokemon.skipBeforeSwitchOutEventFlag) {
            this.runEvent("BeforeSwitchOut", pokemon);
            pokemon.skipBeforeSwitchOutEventFlag = true;
            this.faintMessages();
            if (this.ended)
              return true;
            if (pokemon.fainted) {
              switches[i] = this.sides[i].active.some((sidePokemon) => sidePokemon && !!sidePokemon.switchFlag);
            }
          }
        }
      }
    }
    for (const playerSwitch of switches) {
      if (playerSwitch) {
        this.makeRequest("switch");
        return true;
      }
    }
    if (this.gen < 5)
      this.eachEvent("Update");
    if (this.gen >= 8 && (this.queue.peek()?.choice === "move" || this.queue.peek()?.choice === "runDynamax")) {
      this.updateSpeed();
      for (const queueAction of this.queue.list) {
        if (queueAction.pokemon)
          this.getActionSpeed(queueAction);
      }
      this.queue.sort();
    }
    return false;
  },
  actions: {
    canMegaEvo(pokemon) {
      if (pokemon.species.isMega)
        return null;
      const item = pokemon.getItem();
      if (item.megaStone) {
        if (item.megaStone === pokemon.baseSpecies.name)
          return null;
        return item.megaStone;
      } else {
        return null;
      }
    },
    runMegaEvo(pokemon) {
      if (pokemon.species.isMega)
        return false;
      const species = this.getMixedSpecies(pokemon.m.originalSpecies, pokemon.canMegaEvo, pokemon);
      if (this.dex.species.get(pokemon.canMegaEvo).baseSpecies === pokemon.m.originalSpecies) {
        pokemon.formeChange(species, pokemon.getItem(), true);
      } else {
        const oSpecies = this.dex.species.get(pokemon.m.originalSpecies);
        const oMegaSpecies = this.dex.species.get(species.originalSpecies);
        pokemon.formeChange(species, pokemon.getItem(), true);
        this.battle.add("-start", pokemon, oMegaSpecies.requiredItem, "[silent]");
        if (oSpecies.types.length !== pokemon.species.types.length || oSpecies.types[1] !== pokemon.species.types[1]) {
          this.battle.add("-start", pokemon, "typechange", pokemon.species.types.join("/"), "[silent]");
        }
      }
      pokemon.canMegaEvo = null;
      return true;
    },
    terastallize(pokemon) {
      if (pokemon.illusion?.species.baseSpecies === "Ogerpon") {
        this.battle.singleEvent("End", this.dex.abilities.get("Illusion"), pokemon.abilityState, pokemon);
      }
      if (pokemon.illusion?.species.baseSpecies === "Terapagos") {
        this.battle.singleEvent("End", this.dex.abilities.get("Illusion"), pokemon.abilityState, pokemon);
      }
      let type = pokemon.teraType;
      if (pokemon.species.baseSpecies !== "Ogerpon" && pokemon.getItem().name.endsWith("Mask")) {
        type = this.dex.species.get(pokemon.getItem().forcedForme).forceTeraType;
      }
      this.battle.add("-terastallize", pokemon, type);
      pokemon.terastallized = type;
      for (const ally of pokemon.side.pokemon) {
        ally.canTerastallize = null;
      }
      pokemon.addedType = "";
      pokemon.knownType = true;
      pokemon.apparentType = type;
      if (pokemon.species.baseSpecies === "Ogerpon") {
        const tera = pokemon.species.id === "ogerpon" ? "tealtera" : "tera";
        pokemon.formeChange(pokemon.species.id + tera, pokemon.getItem(), true);
      } else {
        if (pokemon.getItem().name.endsWith("Mask")) {
          const species = this.getMixedSpecies(
            pokemon.m.originalSpecies,
            pokemon.getItem().forcedForme + "-Tera",
            pokemon
          );
          const oSpecies = this.dex.species.get(pokemon.m.originalSpecies);
          const originalTeraSpecies = this.dex.species.get(species.originalSpecies);
          pokemon.formeChange(species, pokemon.getItem(), true);
          this.battle.add("-start", pokemon, originalTeraSpecies.requiredItem, "[silent]");
          if (oSpecies.types.length !== pokemon.species.types.length || oSpecies.types[1] !== pokemon.species.types[1]) {
            this.battle.add("-start", pokemon, "typechange", pokemon.species.types.join("/"), "[silent]");
          }
        }
      }
      if (pokemon.species.name === "Terapagos-Terastal" && type === "Stellar") {
        pokemon.formeChange("Terapagos-Stellar", null, true);
      }
      this.battle.runEvent("AfterTerastallization", pokemon);
    },
    getMixedSpecies(originalForme, megaForme, pokemon) {
      const originalSpecies = this.dex.species.get(originalForme);
      const megaSpecies = this.dex.species.get(megaForme);
      if (originalSpecies.baseSpecies === megaSpecies.baseSpecies)
        return megaSpecies;
      const deltas = this.getFormeChangeDeltas(megaSpecies, pokemon);
      const species = this.mutateOriginalSpecies(originalSpecies, deltas);
      return species;
    },
    getFormeChangeDeltas(formeChangeSpecies, pokemon) {
      const baseSpecies = this.dex.species.get(formeChangeSpecies.baseSpecies);
      const deltas = {
        ability: formeChangeSpecies.abilities["0"],
        baseStats: {},
        weighthg: formeChangeSpecies.weighthg - baseSpecies.weighthg,
        originalSpecies: formeChangeSpecies.name,
        requiredItem: formeChangeSpecies.requiredItem
      };
      let statId;
      for (statId in formeChangeSpecies.baseStats) {
        deltas.baseStats[statId] = formeChangeSpecies.baseStats[statId] - baseSpecies.baseStats[statId];
      }
      if (formeChangeSpecies.types.length > baseSpecies.types.length) {
        deltas.type = formeChangeSpecies.types[1];
      } else if (formeChangeSpecies.types.length < baseSpecies.types.length) {
        deltas.type = "mono";
      } else if (formeChangeSpecies.types[1] !== baseSpecies.types[1]) {
        deltas.type = formeChangeSpecies.types[1];
      }
      let formeType = null;
      if (formeChangeSpecies.isMega)
        formeType = "Mega";
      if (formeChangeSpecies.isPrimal)
        formeType = "Primal";
      if (formeChangeSpecies.name.endsWith("Crowned"))
        formeType = "Crowned";
      if (formeType)
        deltas.formeType = formeType;
      if (!deltas.formeType && formeChangeSpecies.abilities["H"] && pokemon && pokemon.baseSpecies.abilities["H"] === pokemon.getAbility().name) {
        deltas.ability = formeChangeSpecies.abilities["H"];
      }
      return deltas;
    },
    mutateOriginalSpecies(speciesOrForme, deltas) {
      if (!deltas)
        throw new TypeError("Must specify deltas!");
      const species = this.dex.deepClone(this.dex.species.get(speciesOrForme));
      species.abilities = { "0": deltas.ability };
      if (species.types[0] === deltas.type) {
        species.types = [deltas.type];
      } else if (deltas.type === "mono") {
        species.types = [species.types[0]];
      } else if (deltas.type) {
        species.types = [species.types[0], deltas.type];
      }
      const baseStats = species.baseStats;
      for (const statName in baseStats) {
        baseStats[statName] = this.battle.clampIntRange(baseStats[statName] + deltas.baseStats[statName], 1, 255);
      }
      species.weighthg = Math.max(1, species.weighthg + deltas.weighthg);
      species.originalSpecies = deltas.originalSpecies;
      species.requiredItem = deltas.requiredItem;
      switch (deltas.formeType) {
        case "Mega":
          species.isMega = true;
          break;
        case "Primal":
          species.isPrimal = true;
          break;
      }
      return species;
    }
  }
};
//# sourceMappingURL=scripts.js.map
