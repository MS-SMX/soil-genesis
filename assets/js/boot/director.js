window.SG = window.SG || {};

SG.boot = {

    sequence:[],

    handlers:{},

    async start(){

        await SG.timeline.run(

            this.sequence,

            this.handlers

        );

    }

};