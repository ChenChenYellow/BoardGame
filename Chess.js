document.write('<table height="800" width="800" style="border:solid; border-color:black; border-width:10px ">');

let aToh = Array.from("ABCDEFGH");
let selected = undefined;
let allPieces = new Map();
let board = new Map();
let operator = {
    '<=': function (a, b) {
        return a <= b
    },
    '>=': function (a, b) {
        return a >= b
    }
};

//Set up the board 
//Set up the event

let count;
count = 0;
for (let j = 8; j >= 1; j--) {
    document.write('<tr>')
    for (let c of aToh) {
        let cj = c.toString() + j.toString();
        if (count % 2 == 0) {
            document.write(`<td id="${cj}" style="background-color:white; background-repeat:no-repeat; background-position: center;"></td>`);
        } else {
            document.write(`<td id="${cj}" style="background-color:rosybrown;  background-repeat:no-repeat; background-position: center;"></td>`);
        }
        document.getElementById(`${cj}`).addEventListener('contextmenu', function (ev) {
            ev.preventDefault();
            alert(board.get(`${cj}`).toString());
            return false;
        }, false);
        document.getElementById(`${cj}`).onclick = function (e) {
            //selected = the first selection
            //c + j = the second selection
            //if selected a Piece
            if (selected != undefined && (document.getElementById(`${cj}`).style.backgroundColor == "gold" || document.getElementById(`${cj}`).style.backgroundColor == "goldenrod")) {
                //if c + j, is in the possible places 
                //move piece
                //reset the charge mode of my side
                //change color back
                for (let i = 8; i >= 1; i--) {
                    for (let a of aToh) {
                        let ai = a.toString() + i.toString();
                        if (document.getElementById(`${ai}`).style.backgroundColor == "gold") {
                            document.getElementById(`${ai}`).style.backgroundColor = "white";
                        } else if (document.getElementById(`${ai}`).style.backgroundColor == "goldenrod") {
                            document.getElementById(`${ai}`).style.backgroundColor = "rosybrown";
                        }
                    }
                }
                for (let p of allPieces.values()) {
                    if (p.rank == "Pion" && p.color == board.get(selected).color) {
                        p.charge = false;
                    }
                }
                //If selected is a Pion
                if (board.get(selected).rank == "Pion") {
                    //If selected eat passing Pion
                    let k = c + selected[1];
                    if (selected[0] != c && board.get(`${k}`) != undefined && board.get(`${k}`).isAlive == true && board.get(`${k}`).rank == "Pion" && board.get(`${k}`).charge == true) {
                        board.get(k).isAlive = false;
                        board.set(k, undefined);
                        document.getElementById(k).style.backgroundImage = null;
                    }
                    //If selected Charge
                    else if (Math.abs(Number(selected[1]) - Number(j)) > 1) {
                        board.get(selected).charge = true;
                    }
                    //If selected promote
                    else if (Number(j) == 8 || Number(j) == 1) {
                        let r = getPromptBoxValue();
                        let ima;
                        switch(r){
                            case "Queen":
                                ima = `url(${board.get(selected).color}_queen.png)`;
                                break;
                            case "Rook":
                                ima = `url(${board.get(selected).color}_rook.png)`;
                                break;
                            case "Knight":
                                ima = `url(${board.get(selected).color}_knight.png)`;
                                break;
                            case "Bishop":
                                ima = `url(${board.get(selected).color}_bishop.png)`;
                                break;
                        }
                        board.get(selected).rank = r;
                        board.get(selected).image = ima;
                    }
                } else if (board.get(selected).rank == "King") {
                    if (Math.abs(aToh.indexOf(selected[0].toString()) - aToh.indexOf(c)) > 1) {
                        let rookName;
                        let diff;
                        //left Castling
                        if (aToh.indexOf(selected[0].toString()) > aToh.indexOf(c)) {
                            rookName = `${board.get(selected).color}RookA`;
                            diff = 1;

                        }
                        //right Castling
                        else if (aToh.indexOf(selected[0].toString()) < aToh.indexOf(c)) {
                            rookName = `${board.get(selected).color}RookH`;
                            diff = -1;
                        }

                        allPieces.get(rookName).hasMoved = true;
                        document.getElementById(aToh[aToh.indexOf(c) + diff].toString() + j.toString()).style.backgroundImage = allPieces.get(rookName).image;
                        document.getElementById(allPieces.get(rookName).place).style.backgroundImage = null;
                        board.set(allPieces.get(rookName).place, undefined);
                        allPieces.get(rookName).place = aToh[aToh.indexOf(c) + diff].toString() + j.toString();
                        board.set(allPieces.get(rookName).place, allPieces.get(rookName));
                    }
                }
                //If there is someone in the c + j square take him out;
                if (board.get(`${cj}`) != undefined) {
                    board.get(`${cj}`).isAlive = false;
                }
                board.set(`${cj}`, board.get(selected));
                board.get(`${cj}`).hasMoved = true;
                board.get(`${cj}`).place = `${cj}`;
                document.getElementById(`${cj}`).style.backgroundImage = board.get(`${cj}`).image;
                board.set(selected, undefined);
                document.getElementById(selected).style.backgroundImage = null;
                selected = undefined;

                //////////////////


            } else {
                //change color back
                for (let i = 8; i >= 1; i--) {
                    for (let a of aToh) {
                        let ai = a.toString() + i.toString();
                        if (document.getElementById(`${ai}`).style.backgroundColor == "gold") {
                            document.getElementById(`${ai}`).style.backgroundColor = "white";
                        } else if (document.getElementById(`${ai}`).style.backgroundColor == "goldenrod") {
                            document.getElementById(`${ai}`).style.backgroundColor = "rosybrown";
                        }
                    }
                }

                //else if not selected a piece, select one
                selected = `${cj}`;
                let possible_place = board.get(selected).possible_place;
                for (let c of possible_place) {
                    if (document.getElementById(c).style.backgroundColor == "white") {
                        document.getElementById(c).style.backgroundColor = "gold";
                    } else if (document.getElementById(c).style.backgroundColor == "rosybrown") {
                        document.getElementById(c).style.backgroundColor = "goldenrod";
                    }
                }

            }
        };
        count++;
    }
    count--;
    document.write('</tr>')
}

document.write("</table>");


function getPromptBoxValue() {
    let ret = prompt("Promote to (Knight, Bishop, Rook, Queen) : ", "Queen");
    if (ret == "Queen" || ret == "Knight" || ret == "Bishop" || ret == "Rook") {
        return ret;
    } else return getPromptBoxValue();
}
class Piece {
    constructor(color, rank, place, image, name) {
        this._name = name;
        this._color = color;
        this._rank = rank;
        this._place = place;
        this._hasMoved = false;
        this._image = image;
        this._possible_place = null;
        this._isAlive = true;
        this._charge = false;
        this._places_around_me = null;
        this._places_attack = null;
        this._isKingAttacked = null;
    }
    get name() {
        return this._name
    }
    set name(name) {
        this._name = name;
    }
    get isKingAttacked() {
        this._isKingAttacked = Piece.ifAttacked(allPieces.get(`${this.color}KingE`).place, this.color);
        return this._isKingAttacked;
    }
    set isKingAttacked(isKingAttacked) {
        this._isKingAttacked = isKingAttacked;
    }
    static bishopAttack(ltor, utod, pX, pY) {
        let ret = new Array();
        let max;
        let op;
        if (ltor == -1) {
            max = 0;
            op = ">=";

        } else if (ltor == 1) {
            max = 7;
            op = "<=";
        }
        for (let i = pX; operator[op](i, max); i += ltor) {
            if (i == pX) {
                continue;
            }
            let j = pY - (utod * i) + (utod * pX);
            if (j <= 0 || j > 8) {
                break;
            }
            ret.push(`${aToh[i] + j.toString()}`);
            if (board.get(`${aToh[i] + j.toString()}`) != undefined) {
                break;
            }
        }
        return ret;
    }
    static rookAttack(pX, pY, onX, ltorutod) {

        let start;
        let op;
        let max;
        let increament;
        let ret = new Array();
        if (onX == true) {
            start = pX;
            if (ltorutod == true) {
                op = '<=';
                max = 7;
                increament = 1;
            } else if (ltorutod == false) {
                op = '>=';
                max = 0;
                increament = -1;
            }
        } else if (onX == false) {
            start = pY;
            if (ltorutod == true) {
                op = '<=';
                max = 8;
                increament = 1;
            } else if (ltorutod == false) {
                op = '>=';
                max = 1;
                increament = -1;
            }
        }
        for (let i = start; operator[op](i, max); i += increament) {
            if (i == start) {
                continue;
            }
            if (onX == true) {
                ret.push(`${aToh[i] + pY.toString()}`);
                if (board.get(`${aToh[i] + pY.toString()}`) != undefined) {
                    break;
                }
            } else if (onX == false) {
                ret.push(`${aToh[pX] + i.toString()}`);
                if (board.get(`${aToh[pX] + i.toString()}`) != undefined) {
                    break;
                }
            }

        }
        return ret;
    }
    static knightAttack(pX, pY) {
        let ret = new Array();
        //for Knight
        for (let i = -2; i <= 2; i++) {
            //if pass the board limit
            if (pX + i < 0 || pX + i > 7) {
                //ret.push(`i = ${i} Con`);
                continue;
            } else {
                for (let j = -2; j <= 2; j++) {
                    //if sum not equal to 3
                    if (Math.abs(i) + Math.abs(j) != 3) {
                        continue;
                    }
                    //if pass the board limit
                    else if (pY + j < 1 || pY + j > 8) {
                        continue;
                    }
                    ret.push(`${aToh[pX + i] + (pY + j).toString()}`);
                }

            }
        }
        return ret;
    }
    static bishopPossible(ltor, utod, pX, pY, color) {
        let ret = new Array();
        let max;
        let op;
        if (ltor == -1) {
            max = 0;
            op = ">=";

        } else if (ltor == 1) {
            max = 7;
            op = "<=";
        }
        for (let i = pX; operator[op](i, max); i += ltor) {
            if (i == pX) {
                continue;
            }
            let j = pY - (utod * i) + (utod * pX);
            if (j <= 0 || j > 8) {
                break;
            }
            if (board.get(`${aToh[i] + j.toString()}`) == undefined) {
                ret.push(`${aToh[i] + j.toString()}`);
            } else if (board.get(`${aToh[i] + j.toString()}`).color != color) {
                ret.push(`${aToh[i] + j.toString()}`);
                break;
            } else {
                break;
            }

        }
        return ret;

    }
    static rookPossible(pX, pY, onX, ltorutod, color) {

        let start;
        let op;
        let max;
        let increament;
        let ret = new Array();
        if (onX == true) {
            start = pX;
            if (ltorutod == true) {
                op = '<=';
                max = 7;
                increament = 1;
            } else if (ltorutod == false) {
                op = '>=';
                max = 0;
                increament = -1;
            }
        } else if (onX == false) {
            start = pY;
            if (ltorutod == true) {
                op = '<=';
                max = 8;
                increament = 1;
            } else if (ltorutod == false) {
                op = '>=';
                max = 1;
                increament = -1;
            }
        }
        for (let i = start; operator[op](i, max); i += increament) {
            if (i == start) {
                continue;
            }
            if (onX == true) {
                if (board.get(`${aToh[i] + pY.toString()}`) == undefined) {
                    ret.push(`${aToh[i] + pY.toString()}`);
                } else if (board.get(`${aToh[i] + pY.toString()}`).color != color) {
                    ret.push(`${aToh[i] + pY.toString()}`);
                    break;
                } else {
                    break;
                }
            } else if (onX == false) {
                if (board.get(`${aToh[pX] + i.toString()}`) == undefined) {
                    ret.push(`${aToh[pX] + i.toString()}`);
                } else if (board.get(`${aToh[pX] + i.toString()}`).color != color) {
                    ret.push(`${aToh[pX] + i.toString()}`);
                    break;
                } else {
                    break;
                }
            }
        }
        return ret;
    }
    static knightPossible(pX, pY, color) {
        let ret = new Array();
        //for Knight
        for (let i = -2; i <= 2; i++) {
            //if pass the board limit
            if (pX + i < 0 || pX + i > 7) {
                continue;
            }
            for (let j = -2; j <= 2; j++) {
                //if sum not equal to 3
                if (Math.abs(i) + Math.abs(j) != 3) {
                    continue;
                }
                //if pass the board limit
                if (pY + j < 1 || pY + j > 8) {
                    continue;
                }
                if (board.get(`${aToh[pX + i] + (pY + j).toString()}`) == undefined ||
                    board.get(`${aToh[pX + i] + (pY + j).toString()}`).color != color) {
                    ret.push(`${aToh[pX + i] + (pY + j).toString()}`);
                }
            }
        }
        return ret;
    }
    static pionPossible(pX, pY, color, hasMoved) { //for Pion
        let ret = new Array();
        let temp = 0;
        //set color flag
        if (color == "black") {
            temp = -1;
        } else if (color == "white") {
            temp = 1;
        }
        //Pion push one square 
        if (board.get(aToh[pX] + (pY + temp)) == undefined) {
            ret.push(aToh[pX] + (pY + temp));
            //Pion push two square
            if (board.get(aToh[pX] + (pY + (2 * temp))) == undefined &&
                !hasMoved) {
                ret.push(aToh[pX] + (pY + (2 * temp)));
            }
        }
        //Pion eat left
        if (pX > 0 &&
            board.get(aToh[pX - 1] + (pY + temp)) != undefined &&
            board.get(aToh[pX - 1] + (pY + temp)).color != color) {
            ret.push(aToh[pX - 1] + (pY + temp));
        }
        //Pion eat right
        if (pX < 7 &&
            board.get(aToh[pX + 1] + (pY + temp)) != undefined &&
            board.get(aToh[pX + 1] + (pY + temp)).color != color) {
            ret.push(aToh[pX + 1] + (pY + temp));
        }
        //Pion eat passing pion left
        if (pX > 0 &&
            board.get(aToh[pX - 1] + (pY)) != undefined &&
            board.get(aToh[pX - 1] + (pY)).color != color &&
            board.get(aToh[pX - 1] + (pY)).rank == "Pion" &&
            board.get(aToh[pX - 1] + (pY)).charge == true) {
            ret.push(aToh[pX - 1] + (pY + temp));
        }
        //Pion eat passing pion right
        if (pX < 7 &&
            board.get(aToh[pX + 1] + (pY)) != undefined &&
            board.get(aToh[pX + 1] + (pY)).color != color &&
            board.get(aToh[pX + 1] + (pY)).rank == "Pion" &&
            board.get(aToh[pX + 1] + (pY)).charge == true) {
            ret.push(aToh[pX + 1] + (pY + temp));
        }
        return ret;
    }
    static ifAttacked(loc, color) {
        let ret = new Array();
        for (let c of allPieces.values()) {
            if (c.color != color && c.isAlive == true) {
                for (let i of c.Places_attack) {
                    if (i == loc) {
                        ret.push(c);
                    }
                }
            }
        }
        return ret;
    }
    get possible_place() {
        this.getPossible_place();
        return this._possible_place;
    }
    getPossible_place() {
        let ret = new Array();
        let pX = aToh.indexOf(this.place.toString()[0]);
        let pY = Number(this.place.toString()[1]);
        let tmp = new Array();
        switch (this.rank) {
            case "Pion":
                tmp = tmp.concat(Piece.pionPossible(pX, pY, this.color, this.hasMoved));
                break;
            case "Knight":
                tmp = tmp.concat(Piece.knightPossible(pX, pY, this.color));
                break;
            case "Queen":
            case "Bishop":
                tmp = tmp.concat(Piece.bishopPossible(1, -1, pX, pY, this.color));
                tmp = tmp.concat(Piece.bishopPossible(-1, -1, pX, pY, this.color));
                tmp = tmp.concat(Piece.bishopPossible(1, 1, pX, pY, this.color));
                tmp = tmp.concat(Piece.bishopPossible(-1, 1, pX, pY, this.color));
                if (this._rank == "Bishop") {
                    break;
                }
            case "Rook":
                tmp = tmp.concat(Piece.rookPossible(pX, pY, true, true, this.color));
                tmp = tmp.concat(Piece.rookPossible(pX, pY, false, true, this.color));
                tmp = tmp.concat(Piece.rookPossible(pX, pY, true, false, this.color));
                tmp = tmp.concat(Piece.rookPossible(pX, pY, false, false, this.color));
                break;
            case "King":
                for (let i = pX - 1; i <= pX + 1; i++) {
                    for (let j = pY - 1; j <= pY + 1; j++) {
                        if (i < 0 || i > 7 || j < 1 || j > 8) {
                            continue;
                        }
                        if (i == pX && j == pY) {
                            continue;
                        }
                        if (board.get(`${aToh[i] + j.toString()}`) == undefined ||
                            board.get(`${aToh[i] + j.toString()}`).color != this.color) {
                            tmp.push(`${aToh[i] + j.toString()}`);
                        }
                    }
                }
                try {
                    if (Piece.switchble(this.color, "A") == true) {
                        tmp.push(`${aToh[pX - 2] + pY.toString()}`);
                    }
                    if (Piece.switchble(this.color, "H") == true) {
                        tmp.push(`${aToh[pX + 2] + pY.toString()}`);

                    }
                } catch (err) {
                    alert(err.message);
                }
                break;
            default:
                break;
        }
        let currentLoc = this.place;
        let tempVal;
        if (this.rank == "Pion") {
            for (let c of tmp) {

                let t;
                if (this.color == "black") {
                    t = -1;
                } else if (this.color == "white") {
                    t = 1;
                }
                let s = `${c[0] + this.place[1].toString()}`;

                if (c[0] != this.place[0] && board.get(s) != undefined && board.get(s).rank == "Pion" && board.get(s).color != this.color && board.get(s).charge == true) {
                    tempVal = board.get(s);
                    board.set(c, this);
                    board.set(this.place, undefined);
                    this.place = c;
                    if (tempVal != undefined) {
                        allPieces.get(tempVal.name).isAlive = false;
                    }
                    if (this.isKingAttacked.length == 0) {
                        ret.push(c);
                    }
                    if (tempVal != undefined) {
                        allPieces.get(tempVal.name).isAlive = true;
                    }
                    this.place = currentLoc;
                    board.set(this.place, this);
                    tempVal = undefined;

                } else {

                    tempVal = board.get(c);
                    board.set(c, this);
                    board.set(this.place, undefined);
                    this.place = c;
                    if (tempVal != undefined) {
                        allPieces.get(tempVal.name).isAlive = false;
                    }

                    if (this.isKingAttacked.length == 0) {
                        ret.push(c);
                    }
                    if (tempVal != undefined) {
                        allPieces.get(tempVal.name).isAlive = true;
                    }
                    board.set(c, tempVal);
                    this.place = currentLoc;
                    board.set(this.place, this);
                    tempVal = undefined;

                }
            }
        } else {
            for (let c of tmp) {

                tempVal = board.get(c);
                board.set(c, this);
                board.set(this.place, undefined);
                this.place = c;
                if (tempVal != undefined) {
                    allPieces.get(tempVal.name).isAlive = false;
                }

                if (this.isKingAttacked.length == 0) {
                    ret.push(c);
                }
                if (tempVal != undefined) {
                    allPieces.get(tempVal.name).isAlive = true;
                }
                board.set(c, tempVal);
                this._place = currentLoc;
                board.set(this.place, this);
                tempVal = undefined;

            }
        }
        this._possible_place = ret;
    }
    get Places_attack() {
        this.getPlaces_attack();
        return this._places_attack;
    }
    getPlaces_attack() {
        let ret = new Array();
        let pX = aToh.indexOf(this._place.toString()[0]);
        let pY = Number(this._place.toString()[1]);

        switch (this._rank) {
            case "Pion":
                //for Pion
                {
                    let temp = 0;
                    //set color flag
                    if (this.color == "black") {
                        temp = -1;
                    } else if (this.color == "white") {
                        temp = 1;
                    }
                    //Pion eat left
                    if (pX > 0) {
                        ret.push(aToh[pX - 1] + (pY + temp));
                    }
                    //Pion eat right
                    if (pX < 7) {
                        ret.push(aToh[pX + 1] + (pY + temp));
                    }
                }
                break;
            case "Knight":
                ret = ret.concat(Piece.knightAttack(pX, pY));
                break;
            case "Queen":
            case "Bishop":
                //From bottom right to upper left
                ret = ret.concat(Piece.bishopAttack(-1, -1, pX, pY));
                //From bottom left to upper right
                ret = ret.concat(Piece.bishopAttack(1, -1, pX, pY));
                //From upper left to bottom right
                ret = ret.concat(Piece.bishopAttack(1, 1, pX, pY));
                //From upper right to bottom left
                ret = ret.concat(Piece.bishopAttack(-1, 1, pX, pY));
                if (this._rank == "Bishop") {
                    break;
                }
            case "Rook":
                ret = ret.concat(Piece.rookAttack(pX, pY, true, true));
                ret = ret.concat(Piece.rookAttack(pX, pY, false, true));
                ret = ret.concat(Piece.rookAttack(pX, pY, true, false));
                ret = ret.concat(Piece.rookAttack(pX, pY, false, false));
                break;
            case "King":
                for (let c of this.Places_around_me) {
                    ret.push(c);
                }
                break;
        }
        this._places_attack = ret;
    }

    getPlaces_around_me() {
        let ret = new Array();
        let pX = aToh.indexOf(this._place.toString()[0]);
        let pY = Number(this._place.toString()[1]);
        for (let i = pX - 1; i <= pX + 1; i++) {
            for (let j = pY - 1; j <= pY + 1; j++) {
                if (i == pX && j == pY) {
                    continue;
                }
                if (i < 0 || i > 7) {
                    continue;
                }
                if (j < 1 || j > 8) {
                    continue;
                }
                ret.push(`${aToh[i] + j.toString()}`);
            }
        }
        this._places_around_me = ret;
    }
    get Places_around_me() {
        this.getPlaces_around_me();
        return this._places_around_me;
    }
    static switchble(color, AorH) {
        let kingPlace;
        let kingMoved;
        kingMoved = allPieces.get(`${color}KingE`).hasMoved;
        if (!kingMoved && allPieces.get(`${color}Rook${AorH}`).hasMoved == false && allPieces.get(`${color}Rook${AorH}`).isAlive) {
            kingPlace = allPieces.get(`${color}KingE`).place;

            let pX = aToh.indexOf(kingPlace.toString()[0]);
            let pY = Number(kingPlace.toString()[1]);
            let max;
            let inc;
            let op;
            if (AorH == "A") {
                max = 0;
                inc = -1;
                op = ">=";
            } else if (AorH == "H") {
                max = 7;
                inc = 1;
                op = "<=";
            }
            for (let i = pX; operator[op](i, max); i += inc) {
                if (i == max) {
                    continue;
                }
                if (Piece.ifAttacked(`${aToh[i] + pY.toString()}`, color).length != 0) {
                    return false;
                }
                if (i == pX) {
                    continue;
                }
                if (board.get(`${aToh[i] + pY.toString()}`) != undefined) {
                    if (board.get(`${aToh[i] + pY.toString()}`).isAlive == true) {
                        return false;

                    }
                }

            }
            return true;
        } else {
            return false;
        }
    }

    get charge() {
        return this._charge;
    }
    set charge(charge) {
        this._charge = charge;
    }
    get isAlive() {
        return this._isAlive;
    }
    set isAlive(isAlive) {
        this._isAlive = isAlive;
    }
    get color() {
        return this._color;
    }
    set color(color) {
        this._color = color;
    }
    get image() {
        return this._image;
    }
    set image(image) {
        this._image = image;
    }
    get rank() {
        return this._rank;
    }
    set rank(rank) {
        this._rank = rank;
    }
    get place() {
        return this._place;
    }
    set place(place) {
        this._place = place;
    }
    get hasMoved() {
        return this._hasMoved;
    }
    set hasMoved(hasMoved) {
        this._hasMoved = hasMoved;
    }

    toString() {
        return `${this._color} ${this._rank} ${this._place} || ${this.possible_place} || ${this.Places_attack}`;
    }
}

//Put pieces in allPieces
//Put pieces on board
//Set up style.backgroundImage
for (let c of aToh) {

    allPieces.set(`whitePion${c}`, new Piece("white", "Pion", `${c}2`, "url(white_pion.png)", `whitePion${c}`));
    allPieces.set(`blackPion${c}`, new Piece("black", "Pion", `${c}7`, "url(black_pion.png)", `blackPion${c}`));
    board.set(`${c}2`, allPieces.get(`whitePion${c}`));
    board.set(`${c}7`, allPieces.get(`blackPion${c}`));
    document.getElementById(`${c}2`).style.backgroundImage = board.get(`${c}2`).image;
    document.getElementById(`${c}7`).style.backgroundImage = board.get(`${c}7`).image;
    switch (c) {
        case "A":
        case "H":
            allPieces.set(`whiteRook${c}`, new Piece("white", "Rook", `${c}1`, "url(white_rook.png)", `whiteRook${c}`));
            allPieces.set(`blackRook${c}`, new Piece("black", "Rook", `${c}8`, "url(black_rook.png)", `blackRook${c}`));
            board.set(`${c}1`, allPieces.get(`whiteRook${c}`));
            board.set(`${c}8`, allPieces.get(`blackRook${c}`));
            break;
        case "B":
        case "G":
            allPieces.set(`whiteKnight${c}`, new Piece("white", "Knight", `${c}1`, "url(white_knight.png)", `whiteKnight${c}`));
            allPieces.set(`blackKnight${c}`, new Piece("black", "Knight", `${c}8`, "url(black_knight.png)", `blackKnight${c}`));
            board.set(`${c}1`, allPieces.get(`whiteKnight${c}`));
            board.set(`${c}8`, allPieces.get(`blackKnight${c}`));
            break;
        case "C":
        case "F":
            allPieces.set(`whiteBishop${c}`, new Piece("white", "Bishop", `${c}1`, "url(white_bishop.png)", `whiteBishop${c}`));
            allPieces.set(`blackBishop${c}`, new Piece("black", "Bishop", `${c}8`, "url(black_bishop.png)", `blackBishop${c}`));
            board.set(`${c}1`, allPieces.get(`whiteBishop${c}`));
            board.set(`${c}8`, allPieces.get(`blackBishop${c}`));
            break;
        case "D":
            allPieces.set(`whiteQueen${c}`, new Piece("white", "Queen", `${c}1`, "url(white_queen.png)", `whiteQueen${c}`));
            allPieces.set(`blackQueen${c}`, new Piece("black", "Queen", `${c}8`, "url(black_queen.png)", `blackQueen${c}`));
            board.set(`${c}1`, allPieces.get(`whiteQueen${c}`));
            board.set(`${c}8`, allPieces.get(`blackQueen${c}`));
            break;
        case "E":
            allPieces.set(`whiteKing${c}`, new Piece("white", "King", `${c}1`, "url(white_king.png)", `whiteKing${c}`));
            allPieces.set(`blackKing${c}`, new Piece("black", "King", `${c}8`, "url(black_king.png)", `blackKing${c}`));
            board.set(`${c}1`, allPieces.get(`whiteKing${c}`));
            board.set(`${c}8`, allPieces.get(`blackKing${c}`));
            break;
        default:
            break;
    }
    document.getElementById(`${c}1`).style.backgroundImage = board.get(`${c}1`).image;
    document.getElementById(`${c}8`).style.backgroundImage = board.get(`${c}8`).image;
}

//test for storage inside the board
//document.write("here");
for (let i = 1; i <= 8; i++) {
    for (let c of aToh) {
        if (allPieces.get(c.toString() + i.toString()) != null) {
            document.write(`${c.toString() + i.toString()} ${allPieces.get(c.toString() + i.toString()).toString()}<br/>`);
        }
    }
}
//allPieces.set("A5", "pom");
//document.write(allPieces.get("A5"));
//allPieces.set("A5", undefined);
////document.write(allPieces.get("A5"));
//document.write(board.get("A2"));
//document.write(board.get("A2").possible_place);

//document.write(allPieces.get("A2").getPossible_place());


//let temp = new Piece("white", "Pion", `A2`);
//allPieces.set("A2", temp);
//document.write(`temp ${temp.toString()}<br/>`);
//document.write(`allP ${allPieces.get("A2").toString()}<br/>`);
//temp.color = "black";
//document.write(`change temp to black<br/>`);
//document.write(`temp ${temp.toString()}<br/>`);
//document.write(`allP ${allPieces.get("A2").toString()}<br/>`);
//allPieces.get("A2").place = "H8";
//document.write(`Change allp to H8<br/>`);
//document.write(`temp ${temp.toString()}<br/>`);
//document.write(`allP ${allPieces.get("A2").toString()}<br/>`);

//Test Result of above
//temp white Pion A2 false 0
//allP white Pion A2 false 0
//change temp to black
//temp black Pion A2 false 0
//allP black Pion A2 false 0
//Change allp to H8
//temp black Pion H8 false 0
//allP black Pion H8 false 0

//It prove that they, temp and allPiece.get("A2") uses the same memory address
//One change, the other one change too;

//for (let i of allPieces.entries()) {
//    document.write(i, '</br>');
//}

//let ret = ;
