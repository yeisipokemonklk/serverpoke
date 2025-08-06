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
var moves_exports = {};
__export(moves_exports, {
  Moves: () => Moves
});
module.exports = __toCommonJS(moves_exports);
const Moves = {
  allyswitch: {
    inherit: true,
    // Prevents setting the volatile used to check for Ally Switch failure
    onPrepareHit() {
    }
  },
  anchorshot: {
    inherit: true,
    isNonstandard: null
  },
  aromatherapy: {
    inherit: true,
    isNonstandard: null
  },
  assist: {
    inherit: true,
    flags: { failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1 }
  },
  auroraveil: {
    inherit: true,
    onTry() {
      return this.field.isWeather("hail");
    }
  },
  autotomize: {
    inherit: true,
    isNonstandard: null
  },
  beakblast: {
    inherit: true,
    isNonstandard: "Past"
  },
  belch: {
    inherit: true,
    flags: { protect: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1 }
  },
  blizzard: {
    inherit: true,
    onModifyMove(move) {
      if (this.field.isWeather("hail"))
        move.accuracy = true;
    }
  },
  boltbeak: {
    inherit: true,
    isNonstandard: null
  },
  bonemerang: {
    inherit: true,
    isNonstandard: null
  },
  burnup: {
    inherit: true,
    isNonstandard: null
  },
  celebrate: {
    inherit: true,
    flags: { nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1 }
  },
  charge: {
    inherit: true,
    condition: {
      onStart(pokemon, source, effect) {
        this.add("-start", pokemon, "Charge");
      },
      onRestart(pokemon, source, effect) {
        this.add("-start", pokemon, "Charge");
      },
      onBasePowerPriority: 9,
      onBasePower(basePower, attacker, defender, move) {
        if (move.type === "Electric") {
          this.debug("charge boost");
          return this.chainModify(2);
        }
      },
      onMoveAborted(pokemon, target, move) {
        if (move.id !== "charge") {
          pokemon.removeVolatile("charge");
        }
      },
      onAfterMove(pokemon, target, move) {
        if (move.id !== "charge") {
          pokemon.removeVolatile("charge");
        }
      },
      onEnd(pokemon) {
        this.add("-end", pokemon, "Charge", "[silent]");
      }
    }
  },
  chatter: {
    inherit: true,
    flags: {
      protect: 1,
      mirror: 1,
      sound: 1,
      distance: 1,
      bypasssub: 1,
      noassist: 1,
      failcopycat: 1,
      failinstruct: 1,
      failmefirst: 1,
      nosleeptalk: 1,
      failmimic: 1
    }
  },
  copycat: {
    inherit: true,
    flags: { failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1 }
  },
  coreenforcer: {
    inherit: true,
    isNonstandard: null
  },
  corrosivegas: {
    inherit: true,
    isNonstandard: null
  },
  craftyshield: {
    inherit: true,
    isNonstandard: null
  },
  curse: {
    inherit: true,
    onModifyMove(move, source, target) {
      if (!source.hasType("Ghost")) {
        move.target = move.nonGhostTarget;
      }
    },
    target: "randomNormal"
  },
  cut: {
    inherit: true,
    isNonstandard: null
  },
  darkvoid: {
    inherit: true,
    isNonstandard: "Past",
    noSketch: false
  },
  doubleironbash: {
    inherit: true,
    isNonstandard: null
  },
  dragonhammer: {
    inherit: true,
    flags: { contact: 1, protect: 1, mirror: 1 }
  },
  dualchop: {
    inherit: true,
    isNonstandard: null
  },
  electrify: {
    inherit: true,
    isNonstandard: null
  },
  eternabeam: {
    inherit: true,
    flags: { recharge: 1, protect: 1, mirror: 1, failinstruct: 1 },
    isNonstandard: null
  },
  fishiousrend: {
    inherit: true,
    isNonstandard: null
  },
  flowershield: {
    inherit: true,
    isNonstandard: null
  },
  fly: {
    inherit: true,
    onTryMove(attacker, defender, move) {
      if (attacker.removeVolatile(move.id)) {
        return;
      }
      this.add("-prepare", attacker, move.name);
      if (!this.runEvent("ChargeMove", attacker, defender, move)) {
        return;
      }
      if (this.sides.length > 2) {
        const animatedTarget = attacker.getMoveTargets(this.dex.getActiveMove("aerialace"), defender).targets[0];
        if (animatedTarget) {
          this.hint(`${move.name}'s animation targeted ${animatedTarget.name}`);
        }
      }
      attacker.addVolatile("twoturnmove", defender);
      return null;
    }
  },
  futuresight: {
    inherit: true,
    flags: { metronome: 1, futuremove: 1 }
  },
  geargrind: {
    inherit: true,
    isNonstandard: null
  },
  gearup: {
    inherit: true,
    isNonstandard: null
  },
  geomancy: {
    inherit: true,
    isNonstandard: null
  },
  glaciallance: {
    inherit: true,
    basePower: 130
  },
  grassyglide: {
    inherit: true,
    basePower: 70
  },
  grudge: {
    inherit: true,
    isNonstandard: null
  },
  hail: {
    inherit: true,
    isNonstandard: null
  },
  headcharge: {
    inherit: true,
    isNonstandard: null
  },
  heartswap: {
    inherit: true,
    isNonstandard: "Past"
  },
  holdback: {
    inherit: true,
    isNonstandard: null
  },
  holdhands: {
    inherit: true,
    isNonstandard: null,
    flags: { bypasssub: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1 }
  },
  hyperspacefury: {
    inherit: true,
    isNonstandard: "Past",
    noSketch: false
  },
  hyperspacehole: {
    inherit: true,
    isNonstandard: "Past"
  },
  icehammer: {
    inherit: true,
    isNonstandard: "Past"
  },
  judgment: {
    inherit: true,
    isNonstandard: "Past"
  },
  kinesis: {
    inherit: true,
    isNonstandard: null
  },
  kingsshield: {
    inherit: true,
    isNonstandard: null
  },
  landswrath: {
    inherit: true,
    isNonstandard: null
  },
  laserfocus: {
    inherit: true,
    isNonstandard: null
  },
  leaftornado: {
    inherit: true,
    isNonstandard: null
  },
  lovelykiss: {
    inherit: true,
    isNonstandard: null
  },
  lusterpurge: {
    inherit: true,
    basePower: 70
  },
  magiccoat: {
    inherit: true,
    isNonstandard: null
  },
  matblock: {
    inherit: true,
    isNonstandard: null
  },
  maxairstream: {
    inherit: true,
    isNonstandard: null
  },
  maxdarkness: {
    inherit: true,
    isNonstandard: null
  },
  maxflare: {
    inherit: true,
    isNonstandard: null
  },
  maxflutterby: {
    inherit: true,
    isNonstandard: null
  },
  maxgeyser: {
    inherit: true,
    isNonstandard: null
  },
  maxguard: {
    inherit: true,
    isNonstandard: null
  },
  maxhailstorm: {
    inherit: true,
    isNonstandard: null
  },
  maxknuckle: {
    inherit: true,
    isNonstandard: null
  },
  maxlightning: {
    inherit: true,
    isNonstandard: null
  },
  maxmindstorm: {
    inherit: true,
    isNonstandard: null
  },
  maxooze: {
    inherit: true,
    isNonstandard: null
  },
  maxovergrowth: {
    inherit: true,
    isNonstandard: null
  },
  maxphantasm: {
    inherit: true,
    isNonstandard: null
  },
  maxquake: {
    inherit: true,
    isNonstandard: null
  },
  maxrockfall: {
    inherit: true,
    isNonstandard: null
  },
  maxstarfall: {
    inherit: true,
    isNonstandard: null
  },
  maxsteelspike: {
    inherit: true,
    isNonstandard: null
  },
  maxstrike: {
    inherit: true,
    isNonstandard: null
  },
  maxwyrmwind: {
    inherit: true,
    isNonstandard: null
  },
  mefirst: {
    inherit: true,
    flags: {
      protect: 1,
      bypasssub: 1,
      failencore: 1,
      failmefirst: 1,
      nosleeptalk: 1,
      noassist: 1,
      failcopycat: 1,
      failinstruct: 1
    }
  },
  meteorassault: {
    inherit: true,
    isNonstandard: null
  },
  metronome: {
    inherit: true,
    flags: { failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1 }
  },
  milkdrink: {
    inherit: true,
    pp: 10
  },
  mindblown: {
    inherit: true,
    isNonstandard: null
  },
  mindreader: {
    inherit: true,
    isNonstandard: null
  },
  mirrorcoat: {
    inherit: true,
    flags: { protect: 1, failmefirst: 1, noassist: 1, failcopycat: 1 }
  },
  mirrormove: {
    inherit: true,
    flags: { failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1 }
  },
  mistball: {
    inherit: true,
    basePower: 70
  },
  multiattack: {
    inherit: true,
    isNonstandard: null
  },
  naturepower: {
    inherit: true,
    isNonstandard: null,
    flags: { failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1 }
  },
  naturesmadness: {
    inherit: true,
    isNonstandard: null
  },
  oblivionwing: {
    inherit: true,
    isNonstandard: null
  },
  obstruct: {
    inherit: true,
    isNonstandard: null
  },
  octazooka: {
    inherit: true,
    isNonstandard: null
  },
  octolock: {
    inherit: true,
    isNonstandard: null
  },
  plasmafists: {
    inherit: true,
    isNonstandard: null
  },
  poweruppunch: {
    inherit: true,
    isNonstandard: null
  },
  psychoboost: {
    inherit: true,
    isNonstandard: "Past"
  },
  psychoshift: {
    inherit: true,
    isNonstandard: null
  },
  purify: {
    inherit: true,
    isNonstandard: null
  },
  recover: {
    inherit: true,
    pp: 10
  },
  relicsong: {
    inherit: true,
    isNonstandard: "Past"
  },
  rest: {
    inherit: true,
    pp: 10
  },
  revelationdance: {
    inherit: true,
    isNonstandard: "Past"
  },
  revenge: {
    inherit: true,
    isNonstandard: null
  },
  roost: {
    inherit: true,
    pp: 10
  },
  searingshot: {
    inherit: true,
    isNonstandard: null
  },
  secretsword: {
    inherit: true,
    isNonstandard: null
  },
  seedflare: {
    inherit: true,
    isNonstandard: "Past"
  },
  shadowbone: {
    inherit: true,
    isNonstandard: null
  },
  shelltrap: {
    inherit: true,
    isNonstandard: null
  },
  shoreup: {
    inherit: true,
    pp: 10
  },
  sketch: {
    inherit: true,
    isNonstandard: "Past"
  },
  skullbash: {
    inherit: true,
    isNonstandard: null
  },
  slackoff: {
    inherit: true,
    pp: 10
  },
  sleeptalk: {
    inherit: true,
    flags: { failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1 }
  },
  snaptrap: {
    inherit: true,
    isNonstandard: null
  },
  softboiled: {
    inherit: true,
    pp: 10
  },
  spectralthief: {
    inherit: true,
    isNonstandard: null
  },
  stickyweb: {
    inherit: true,
    condition: {
      onSideStart(side) {
        this.add("-sidestart", side, "move: Sticky Web");
      },
      onEntryHazard(pokemon) {
        if (!pokemon.isGrounded() || pokemon.hasItem("heavydutyboots"))
          return;
        this.add("-activate", pokemon, "move: Sticky Web");
        this.boost({ spe: -1 }, pokemon, this.effectState.source, this.dex.getActiveMove("stickyweb"));
      }
    }
  },
  stormthrow: {
    inherit: true,
    isNonstandard: null
  },
  submission: {
    inherit: true,
    isNonstandard: null
  },
  tailglow: {
    inherit: true,
    isNonstandard: "Past"
  },
  technoblast: {
    inherit: true,
    isNonstandard: null
  },
  thousandarrows: {
    inherit: true,
    isNonstandard: null
  },
  thousandwaves: {
    inherit: true,
    isNonstandard: null
  },
  toxicthread: {
    inherit: true,
    isNonstandard: "Past"
  },
  trickortreat: {
    inherit: true,
    isNonstandard: null
  },
  vcreate: {
    inherit: true,
    isNonstandard: null
  },
  venomdrench: {
    inherit: true,
    isNonstandard: null
  },
  vitalthrow: {
    inherit: true,
    isNonstandard: null
  },
  wickedblow: {
    inherit: true,
    basePower: 80
  }
};
//# sourceMappingURL=moves.js.map
