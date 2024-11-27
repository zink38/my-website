// Player_Student.js 
// Computer Science 3200 - Assignment 3
// Author: Keegan Churchill 201510260 kcm507

class Player_Student {
    
    constructor(config) {
        this.infinity = 10000;
        this.negInfinity = -10000

        this.config = config;
        this.searchStartTime = 0;

        this.bestAction         = null;
        this.currentBestAction  = null;
        this.currentMaxDepth    = null;
        this.maxPlayer          = null;
    }
    
    getHash(state) {
        return 0;
    }

    getAction(state) {
        return this.IDAlphaBeta(state);
    }

    eval(state, player, depth) {
        let winner = state.winner();
        if      (winner == player)              { return 9999 - depth; }   // one away from alpha
        else if (winner == (player + 1) % 2)    { return -9999 - depth; }   // and beta infinity bounds
        else if (winner == PLAYER_DRAW)         { return 0; }       
        else if (winner == PLAYER_NONE) {
            let h = 1000; 
            let centre = Math.trunc(state.width/2);
            for(let i = 0; i < state.height; i++){
                for(let j = 0; j < centre;j++){
                    // Heavily weight actions as they near the centre
                    if(state.get(centre+j,i) == player || state.get(centre-j,i) == player) {
                        h += state.height*state.height + state.width - i - (state.width+state.height)*j;
                    }
                    // Modestly weight Diagonal ends of potential future connections
                    if(j%2 == 0 && i%2 == 0) {
                        if(state.get(centre+j,i) == player || state.get(centre-j,i) == player) {
                            h += 2*state.height + state.width - i - j ;
                        }
                    }
                    // lightly weight the filling of diagonal connections
                    else if(j%2 == 1 && i%2 == 1) {
                        if(state.get(centre+j,i) == player || state.get(centre-j,i) == player) {
                            h += state.height + state.width - i - j  ;
                        }
                    }
                    // Worsen odds of playing end of the board
                    if(state.get(0,i) == player || state.get(state.width-1,i) == player){
                        h -= i * state.height;
                    }
                    // Worsen odds of playing top of the board
                    if(state.get(centre + j,state.height-1) == player || state.get(centre - j,state.height-1) == player) {
                        h-= state.height;
                    }
                }
            }                 
            // heuristic most relevant for low depth
            return h - 2*depth; 
        }
    }

    IDAlphaBeta(state) {
        this.searchStartTime = performance.now();
        this.bestAction = null;
        this.maxPlayer = state.player;
        for (let d=1; d <= this.config.maxDepth || this.config.maxDepth == 0; d++) {
            this.currentMaxDepth = d;
            try{
                this.AlphaBeta(state, this.negInfinity, this.infinity, 0, true);
                this.bestAction = this.currentBestAction;
            } catch(TimeOutException){
                break;
            }
        }
        return this.bestAction
    }

    AlphaBeta(state, alpha, beta, depth, max) {

        var timeElapsed = performance.now() - this.searchStartTime;

        if (state.winner() != PLAYER_NONE || depth >= this.currentMaxDepth){
            return this.eval(state, this.maxPlayer, depth);
        } 
        
        if (timeElapsed > this.config.timeLimit && this.config.timeLimit != 0){
            throw TimeOutException;
        }

        let legalActions = state.getLegalActions();
        if (max) {
            let v = this.negInfinity;
            for (let a = 0; a< legalActions.length; a++) {
                let child = state.copy();
                child.doAction(legalActions[a]);
                
                let vPrime = this.AlphaBeta(child, alpha, beta, depth+1, !max)

                
                if (vPrime > v) {
                    v = vPrime;
                } 
                
                if (vPrime >= beta) {
                    return v;
                } 
                
                if (vPrime > alpha) {
                    alpha = vPrime
                    if (depth == 0) {
                        this.currentBestAction = legalActions[a];
                    }   
                }
            }
            return v;
        } else {
            let v = this.infinity;
            for (let a = 0; a< legalActions.length; a++) {
                let child = state.copy();
                child.doAction(legalActions[a]);
                let vPrime = this.AlphaBeta(child, alpha, beta, depth+1, !max)
                if (vPrime < v) {
                    v = vPrime;
                }
                if (vPrime <= alpha) {
                    return v;
                } 
                if (vPrime < beta) {
                    beta = vPrime;
                }
            }
            return v
        }
    }   
}