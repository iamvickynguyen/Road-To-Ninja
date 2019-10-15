new Vue({
    el: '#app',
    data: {
        narutoHealth: 100,
        sasukeHealth: 100,
        gameIsRunning: false,
        turns: [],
        special_attack_count: 3,
        heal_count: 3,
        naruto_img: 'n1.png',
        sasuke_img: 's1.png',
        check_action: false,
        check_special_attack: false,
        check_heal: false
    },
    methods: {
        startGame: function () {
            this.gameIsRunning = true;
            this.narutoHealth = 100;
            this.sasukeHealth = 100;
            this.turns = [];
            this.naruto_img = 'n1.png';
            this.sasuke_img = 's1.png';
            this.check_action = false;
            this.check_special_attack = false;
            this.check_heal = false;
            this.special_attack_count = 3;
            this.heal_count = 3;
        },
        attack: function () {
            //-------- naruto --------
            this.disableButton();
            this.changeImg(1, this.createAction('naruto', 'attack')); //1: naruto
            setTimeout(() => {
                var damage = this.calculateDamage(3, 10);
                this.resetZero(2, damage); // this.sasukeHealth -= damage;
                this.turns.unshift({
                    isPlayer: true,
                });
                this.changeImg(2, this.createAction('sasuke', 'beaten'));
            }, 1000);
            setTimeout(() => {
                if (this.checkWin()) {
                    return;
                }
            }, 2000);
            //-------- sasuke --------
            this.sasukeAttack();

        },

        specialAttack: function () {
            this.disableButton();
            this.special_attack_count -= 1;
            this.changeImg(1, this.createAction('naruto', 'special')); //1: naruto
            setTimeout(() => {
                var damage = this.calculateDamage(10, 20);
                this.resetZero(2, damage); //this.sasukeHealth -= damage;
                this.turns.unshift({
                    isPlayer: true,
                });
                this.changeImg(2, this.createAction('sasuke', 'beaten'));
            }, 1200);

            setTimeout(() => {
                if (this.checkWin()) {
                    return;
                }
            }, 2000);
            this.sasukeAttack();
        },
        heal: function () {
            this.disableButton();
            this.heal_count -= 1;
            if (this.narutoHealth <= 90) {
                this.narutoHealth += 10;
            } else {
                this.narutoHealth = 100;
            }
            this.turns.unshift({
                isPlayer: true,
                text: 'Player heals for 10'
            });
            this.sasukeAttack();
        },
        giveUp: function () {
            this.gameIsRunning = false;
        },
        sasukeAttacks: function () {
            var damage = this.calculateDamage(5, 12);
            this.resetZero(1, damage); //this.narutoHealth -= damage;
            this.checkWin();
            this.turns.unshift({
                isPlayer: false,
            });
        },
        calculateDamage: function (min, max) {
            return Math.max(Math.floor(Math.random() * max) + 1, min);
        },
        checkWin: function () {
            if (this.sasukeHealth <= 0) {
                this.sasukeHealth = 0;
                this.endGame(2);
                if (confirm('You won! New Game?')) {
                    this.startGame();
                } else {
                    this.gameIsRunning = false;
                }
                return true;

            } else if (this.narutoHealth <= 0) {
                this.narutoHealth = 0;
                this.endGame(1);
                if (confirm('You lost! New Game?')) {
                    this.startGame();
                } else {
                    this.gameIsRunning = false;
                }
                return true;
            }
            return false;
        },

        //1: naruto, 2: sasuke
        changeImg: function (player, action) {
            for (var i = 0; i < action.length; i++) {
                setTimeout((y) => {
                    if (player == 1)
                        this.naruto_img = action[y];
                    else
                        this.sasuke_img = action[y];
                }, i * 300, i);
            }
        },

        createAction: function (player, action) {
            if (player == 'naruto') {
                if (action == 'attack') {
                    return ['n_attack/n2.png', 'n_attack/n3.png', 'n_attack/n4.png', 'n_attack/n5.png', 'n1.png'];
                } if (action == 'beaten') {
                    return ['n_beaten/nb1.png', 'n_beaten/nb2.png', 'n1.png'];
                } if (action == 'special')
                    return ['n_special/n7.png', 'n_special/n8.png', 'n_special/n9.png', 'n_special/n9.png', 'n_special/n8.png', 'n_special/n10.png', 'n1.png'];
            } else {
                if (action == 'attack') {
                    return ['s_attack/s2.png', 's_attack/s3.png', 's_attack/s4.png', 's_attack/s5.png', 's_attack/s6.png', 's1.png'];
                } if (action == 'beaten')
                    return ['s_beaten/sb1.png', 's_beaten/sb2.png', 's_beaten/sb3.png', 's1.png'];
            }
        },

        sasukeAttack: function () {
            setTimeout(() => {
                this.changeImg(2, this.createAction('sasuke', 'attack'));
            }, 3500);
            setTimeout(() => {
                this.sasukeAttacks();
                this.changeImg(1, this.createAction('naruto', 'beaten'));
            }, 5000);
            setTimeout(() => {
                this.check_action = false;
                if (this.special_attack_count == 0)
                    this.check_special_attack = true;
                else
                    this.check_special_attack = false;

                if (this.heal_count == 0)
                    this.check_heal = true;
                else
                    this.check_heal = false;
            }, 6000);
        },

        disableButton() {
            this.check_action = true;
            this.check_special_attack = true;
            this.check_heal = true;
        },

        endGame(character) {
            setTimeout(() => {
                if (character == 1)
                    this.changeImg(1, ['n_die/nd1.png', 'n_die/nd2.png', 'n_die/nd3.png', 'n_die/nd4.png']);
                else
                    this.changeImg(2, ['s_die/sd1.png', 's_die/sd2.png', 's_die/sd3.png', 's_die/sd4.png']);
            }, 3000);
        },

        resetZero(character, damage) {
            if (character == 1) {
                if (this.narutoHealth - damage < 0)
                    this.narutoHealth = 0;
                else
                    this.narutoHealth -= damage;
            }
            else {
                if (this.sasukeHealth - damage < 0)
                    this.sasukeHealth = 0;
                else
                    this.sasukeHealth -= damage;
            }
        }
    }
});