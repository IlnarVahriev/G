class Weapon {
    constructor(name, damage) {
        this.name = name;
        this.damage = damage;
    }
}

class Character {

    #health;

    constructor(name, health, weapon) {
        this.name = name;
        this.#health = health;
        this.weapon = weapon;
    }

    getHealth() {
        return this.#health;
    }

    setHealth(newHealth) {
        if (newHealth < 0) {
            this.#health = 0;
        } else {
            this.#health = newHealth;
        }
    }

    isAlive() {
        return this.#health > 0;
    }

    ability() {
        return 0;
    }

    attack(enemy) {

        console.log("\n" + this.name + " атакует " + enemy.name);

        let bonusDamage = this.ability();

        let damage = this.weapon.damage + bonusDamage;

        console.log("Оружие: " + this.weapon.name);
        console.log("Нанесённый урон: " + damage);

        enemy.takeDamage(damage);
    }

    takeDamage(damage) {

        let newHealth = this.#health - damage;

        this.setHealth(newHealth);

        console.log(this.name + " получил " + damage + " урона");
        console.log("Здоровье: " + this.#health);

        if (!this.isAlive()) {
            console.log("☠ " + this.name + " погиб!");
        }
    }
}

class Orc extends Character {

    ability() {
        console.log("ОРК использует ЯРОСТЬ! +10 урона");
        return 10;
    }
}

class Dwarf extends Character {

    takeDamage(damage) {

        console.log("Гном использует броню! -5 урона");

        let newDamage = damage - 5;

        if (newDamage < 1) {
            newDamage = 1;
        }

        super.takeDamage(newDamage);
    }
}

class Elf extends Character {

    ability() {
        console.log("ЭЛЬФ использует МАГИЮ! +5 урона");
        return 5;
    }
}


class Human extends Character {

    ability() {
        console.log("ЧЕЛОВЕК использует БОЕВОЙ КЛИЧ! +3 урона");
        return 3;
    }
}


class CharacterFactory {


    static createCharacter(race, name) {

        if (race == "orc") {
            let weapon = new Weapon("Большой топор", 45);
            return new Orc(name, 80, weapon);
        }

        if (race == "dwarf") {
            let weapon = new Weapon("Молот", 40);
            return new Dwarf(name, 100, weapon);
        }

        if (race == "elf") {
            let weapon = new Weapon("Лук", 45);
            return new Elf(name, 70, weapon);
        }

        if (race == "human") {
            let weapon = new Weapon("Меч", 42);
            return new Human(name, 85, weapon);
        }

        console.log("Неизвестная раса!");
        return null;
    }
}

class GameStorage {

    static instance = null;

    constructor() {

        if (GameStorage.instance != null) {
            return GameStorage.instance;
        }

        this.characters = [];

        GameStorage.instance = this;
    }

    addCharacter(character) {

        if (character != null) {
            this.characters.push(character);
        }
    }

    getCharacters() {
        return this.characters;
    }
}

class Battle {

    constructor(storage) {
        this.storage = storage;
    }

    start() {

        console.log("\n================================");
        console.log("       БИТВА ЧЕТЫРЁХ РАС!");
        console.log("================================");

        let characters = this.storage.getCharacters();

        while (true) {

            for (let i = 0; i < characters.length; i++) {

                let attacker = characters[i];

                if (!attacker.isAlive()) {
                    continue;
                }

                let enemies = [];

                for (let j = 0; j < characters.length; j++) {

                    let enemy = characters[j];

                    if (enemy != attacker && enemy.isAlive()) {
                        enemies.push(enemy);
                    }
                }

                if (enemies.length == 0) {
                    break;
                }

                let randomNumber = Math.floor(
                    Math.random() * enemies.length
                );

                let enemy = enemies[randomNumber];

                attacker.attack(enemy);
            }

            let aliveCount = 0;

            for (let i = 0; i < characters.length; i++) {

                if (characters[i].isAlive()) {
                    aliveCount++;
                }
            }

            console.log("\nЖивых персонажей: " + aliveCount);

            if (aliveCount <= 1) {
                break;
            }
        }

        let winner = null;

        for (let i = 0; i < characters.length; i++) {

            if (characters[i].isAlive()) {
                winner = characters[i];
                break;
            }
        }

        console.log("\n================================");

        if (winner != null) {

            console.log("🏆 ПОБЕДИТЕЛЬ: " + winner.name);
            console.log("РАСА: " + winner.constructor.name);
            console.log("ОСТАЛОСЬ ЗДОРОВЬЯ: " + winner.getHealth());

        } else {

            console.log("Все персонажи погибли!");
        }

        console.log("================================");
    }
}

console.log("ПРОГРАММА ЗАПУЩЕНА!");

let storage = new GameStorage();

let storage2 = new GameStorage();

console.log("Проверка Singleton: " + (storage === storage2));

let orc = CharacterFactory.createCharacter("orc", "Гром");
let dwarf = CharacterFactory.createCharacter("dwarf", "Борин");
let elf = CharacterFactory.createCharacter("elf", "Леголас");
let human = CharacterFactory.createCharacter("human", "Артур");

storage.addCharacter(orc);
storage.addCharacter(dwarf);
storage.addCharacter(elf);
storage.addCharacter(human);

console.log("\nУЧАСТНИКИ БИТВЫ:");

for (let i = 0; i < storage.getCharacters().length; i++) {

    let character = storage.getCharacters()[i];

    console.log("--------------------------");
    console.log("Имя: " + character.name);
    console.log("Раса: " + character.constructor.name);
    console.log("Здоровье: " + character.getHealth());
    console.log("Оружие: " + character.weapon.name);
    console.log("Урон: " + character.weapon.damage);
}

let battle = new Battle(storage);

battle.start();

console.log("\nПРОГРАММА ЗАВЕРШЕНА!");
